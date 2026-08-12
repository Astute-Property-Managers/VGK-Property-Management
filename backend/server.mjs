import http from 'node:http';
import { URL } from 'node:url';
import {
  initDatabase, getUserByUsername, getUserById, listRecords, getRecord, createRecord, updateRecord, setRecordStatus,
  hardDeleteRecord, logAudit, listAuditLogs, revokeTokenJti, isTokenRevoked, getState, setState, deleteState
} from './db.mjs';
import { issueToken, verifyPassword, verifyToken } from './auth.mjs';

const PORT = Number(process.env.ALTUS_API_PORT || 8787);
const ALLOWED_ORIGIN = process.env.ALTUS_ALLOWED_ORIGIN || 'http://localhost:3000';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
initDatabase();

const ENTITY_ALLOWLIST = new Set(['properties','tenants','maintenance','vendors','rocks','kpis','critical-numbers','huddles','transactions','owner-statements']);
const loginAttempts = new Map();
const MAX_ATTEMPTS = Number(process.env.ALTUS_LOGIN_MAX_ATTEMPTS || 5);
const LOCKOUT_MS = Number(process.env.ALTUS_LOGIN_LOCKOUT_MS || 15 * 60 * 1000);

// Periodically sweep expired lockout entries so the map cannot grow unbounded.
setInterval(() => {
  const cutoff = Date.now() - LOCKOUT_MS;
  for (const [key, record] of loginAttempts) {
    if (record.lastAttempt < cutoff) loginAttempts.delete(key);
  }
}, LOCKOUT_MS).unref();

function corsHeaders(req) {
  const origin = req.headers.origin;
  if (IS_PRODUCTION && (!origin || origin !== ALLOWED_ORIGIN)) return null;
  return {
    'Access-Control-Allow-Origin': origin || ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };
}
function sendJson(req,res,status,payload){
  const cors=corsHeaders(req); if(!cors) return sendRaw(res,403,'Forbidden origin');
  res.writeHead(status,{ 'Content-Type':'application/json; charset=utf-8', ...cors});
  res.end(JSON.stringify(payload));
}
function sendRaw(res,status,text){ res.writeHead(status,{ 'Content-Type':'text/plain; charset=utf-8' }); res.end(text); }
function parseBody(req){return new Promise((resolve,reject)=>{let raw=''; req.on('data',(c)=>{raw+=c;if(raw.length>2_000_000){reject(new Error('Payload too large'));req.destroy();}}); req.on('end',()=>{if(!raw)return resolve({});try{resolve(JSON.parse(raw));}catch{reject(new Error('Invalid JSON payload'));}}); req.on('error',reject);});}
function authFromRequest(req){
  const h=req.headers.authorization||'';const[,token]=h.split(' ');
  const claims=verifyToken(token); if(!claims) return null;
  if(isTokenRevoked(claims.jti)) return null;
  // Re-check the account on every request: deactivated or deleted users lose access immediately,
  // even if their token has not yet expired.
  const dbUser=getUserById(claims.sub);
  if(!dbUser||!dbUser.active) return null;
  return {token,claims};
}
const requireRole=(u,roles)=>u&&roles.includes(u.role);
function checkLockout(key){
  const r=loginAttempts.get(key); if(!r) return false;
  // Lockout window has passed: clear the record so the user gets a fresh set of attempts.
  if((Date.now()-r.lastAttempt)>=LOCKOUT_MS){ loginAttempts.delete(key); return false; }
  return r.count>=MAX_ATTEMPTS;
}
function recordFailedLogin(key){ const r=loginAttempts.get(key)||{count:0,lastAttempt:0}; r.count+=1; r.lastAttempt=Date.now(); loginAttempts.set(key,r); }
function clearLoginAttempts(key){ loginAttempts.delete(key); }

const server=http.createServer(async(req,res)=>{
  if(req.method==='OPTIONS'){ const cors=corsHeaders(req); if(!cors) return sendRaw(res,403,'Forbidden origin'); res.writeHead(200,cors); return res.end(); }
  const url=new URL(req.url||'/',`http://${req.headers.host}`); const path=url.pathname;
  try{
    if(req.method==='GET'&&path==='/api/health') return sendJson(req,res,200,{status:'ok',service:'altus-api',timestamp:new Date().toISOString()});
    if(req.method==='POST'&&path==='/api/auth/login'){
      const body=await parseBody(req); const key=`${req.socket.remoteAddress}:${body.username||''}`;
      if(checkLockout(key)) return sendJson(req,res,429,{error:'Too many login attempts. Try again later.'});
      const user=getUserByUsername(body.username||'');
      if(!user||!user.active||!verifyPassword(body.password||'',user.password_salt,user.password_hash)){ recordFailedLogin(key); return sendJson(req,res,401,{error:'Invalid credentials'}); }
      clearLoginAttempts(key);
      const token=issueToken(user);
      logAudit({actorUserId:user.id,actorUsername:user.username,action:'auth.login',entityType:'auth',metadata:{sourceIp:req.socket.remoteAddress}});
      return sendJson(req,res,200,{token,user:{id:user.id,username:user.username,role:user.role}});
    }

    const auth=authFromRequest(req); if(!auth) return sendJson(req,res,401,{error:'Unauthorized'});
    const user=auth.claims;

    if(req.method==='POST'&&path==='/api/auth/logout'){
      revokeTokenJti(user.jti,'logout');
      logAudit({actorUserId:user.sub,actorUsername:user.username,action:'auth.logout',entityType:'auth'});
      return sendJson(req,res,200,{ok:true});
    }

    const stateMatch = path.match(/^\/api\/state\/([A-Za-z0-9_-]+)$/);
    if (stateMatch) {
      const key = stateMatch[1];
      if (req.method === 'GET') {
        if (!requireRole(user, ['admin','manager','operator','auditor'])) return sendJson(req,res,403,{error:'Forbidden'});
        return sendJson(req,res,200,{ value: getState(key) });
      }
      if (req.method === 'PUT') {
        if (!requireRole(user, ['admin','manager','operator'])) return sendJson(req,res,403,{error:'Forbidden'});
        const body = await parseBody(req); setState({ key, value: String(body.value ?? ''), actorUserId: user.sub });
        logAudit({actorUserId:user.sub,actorUsername:user.username,action:'state.update',entityType:'state',entityId:key});
        return sendJson(req,res,200,{ok:true});
      }
      if (req.method === 'DELETE') {
        if (!requireRole(user, ['admin'])) return sendJson(req,res,403,{error:'Forbidden'});
        deleteState(key);
        logAudit({actorUserId:user.sub,actorUsername:user.username,action:'state.delete',entityType:'state',entityId:key});
        return sendJson(req,res,200,{ok:true});
      }
    }

    if(req.method==='GET'&&path==='/api/audit'){
      if(!requireRole(user,['admin','auditor'])) return sendJson(req,res,403,{error:'Forbidden'});
      const limit=Math.min(Number(url.searchParams.get('limit')||200),1000);
      return sendJson(req,res,200,{items:listAuditLogs({limit,entityType:url.searchParams.get('entityType')||undefined,entityId:url.searchParams.get('entityId')||undefined})});
    }

    const match=path.match(/^\/api\/([a-z-]+)(?:\/([a-f0-9-]+))?(?:\/(archive|restore))?$/i);
    if(!match) return sendJson(req,res,404,{error:'Not found'});
    const [,entityType,entityId,action]=match;
    if(!ENTITY_ALLOWLIST.has(entityType)) return sendJson(req,res,400,{error:'Unsupported entity type'});
    if(req.method==='GET'&&!entityId){const items=listRecords(entityType,url.searchParams.get('includeArchived')==='true').map((r)=>({id:r.id,status:r.status,createdAt:r.created_at,updatedAt:r.updated_at,...r.payload})); return sendJson(req,res,200,{items});}
    if(req.method==='GET'&&entityId){const r=getRecord(entityType,entityId); if(!r) return sendJson(req,res,404,{error:'Not found'}); return sendJson(req,res,200,{item:{id:r.id,status:r.status,createdAt:r.created_at,updatedAt:r.updated_at,...r.payload}});}
    if(req.method==='POST'&&!entityId){if(!requireRole(user,['admin','manager','operator'])) return sendJson(req,res,403,{error:'Forbidden'}); const body=await parseBody(req); const created=createRecord({entityType,payload:body.payload??body,actorUserId:user.sub}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.create',entityType,entityId:created.id}); return sendJson(req,res,201,{item:{id:created.id,status:created.status,...created.payload}});}
    if(req.method==='PUT'&&entityId){if(!requireRole(user,['admin','manager','operator'])) return sendJson(req,res,403,{error:'Forbidden'}); const body=await parseBody(req); const updated=updateRecord({entityType,id:entityId,payload:body.payload??body,actorUserId:user.sub}); if(!updated) return sendJson(req,res,404,{error:'Not found'}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.update',entityType,entityId}); return sendJson(req,res,200,{item:{id:updated.id,status:updated.status,...updated.payload}});}
    if(req.method==='POST'&&entityId&&action==='archive'){if(!requireRole(user,['admin','manager'])) return sendJson(req,res,403,{error:'Forbidden'}); const archived=setRecordStatus({entityType,id:entityId,status:'archived',actorUserId:user.sub}); if(!archived) return sendJson(req,res,404,{error:'Not found'}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.archive',entityType,entityId}); return sendJson(req,res,200,{ok:true});}
    if(req.method==='POST'&&entityId&&action==='restore'){if(!requireRole(user,['admin','manager'])) return sendJson(req,res,403,{error:'Forbidden'}); const restored=setRecordStatus({entityType,id:entityId,status:'active',actorUserId:user.sub}); if(!restored) return sendJson(req,res,404,{error:'Not found'}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.restore',entityType,entityId}); return sendJson(req,res,200,{ok:true});}
    if(req.method==='DELETE'&&entityId){if(!requireRole(user,['admin'])) return sendJson(req,res,403,{error:'Forbidden'}); if(!hardDeleteRecord({entityType,id:entityId})) return sendJson(req,res,404,{error:'Not found'}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.delete',entityType,entityId}); return sendJson(req,res,200,{ok:true});}
    return sendJson(req,res,405,{error:'Method not allowed'});
  }catch(error){ console.error('Unhandled API error:', error); return sendJson(req,res,500,{error:'Internal server error'}); }
});
server.listen(PORT,()=>console.log(`Altus API listening on http://localhost:${PORT}`));
