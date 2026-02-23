import http from 'node:http';
import { URL } from 'node:url';
import { initDatabase, getUserByUsername, listRecords, getRecord, createRecord, updateRecord, setRecordStatus, hardDeleteRecord, logAudit, listAuditLogs } from './db.mjs';
import { issueToken, verifyPassword, verifyToken } from './auth.mjs';
const PORT = Number(process.env.ALTUS_API_PORT || 8787);
const ALLOWED_ORIGIN = process.env.ALTUS_ALLOWED_ORIGIN || '*';
initDatabase();
const ENTITY_ALLOWLIST = new Set(['properties','tenants','maintenance','vendors','rocks','kpis','critical-numbers','huddles','transactions','owner-statements']);
const sendJson = (res, status, payload) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':ALLOWED_ORIGIN,'Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, OPTIONS'}); res.end(JSON.stringify(payload)); };
function parseBody(req){return new Promise((resolve,reject)=>{let raw=''; req.on('data',(c)=>{raw+=c;if(raw.length>2_000_000){reject(new Error('Payload too large'));req.destroy();}}); req.on('end',()=>{if(!raw)return resolve({});try{resolve(JSON.parse(raw));}catch{reject(new Error('Invalid JSON payload'));}}); req.on('error',reject);});}
const authFromRequest=(req)=>{const h=req.headers.authorization||'';const[,token]=h.split(' ');return verifyToken(token);};
const requireRole=(u,roles)=>u&&roles.includes(u.role);
const server=http.createServer(async(req,res)=>{
  if(req.method==='OPTIONS') return sendJson(res,200,{ok:true});
  const url=new URL(req.url||'/',`http://${req.headers.host}`); const path=url.pathname;
  try{
    if(req.method==='GET'&&path==='/api/health') return sendJson(res,200,{status:'ok',service:'altus-api',timestamp:new Date().toISOString()});
    if(req.method==='POST'&&path==='/api/auth/login'){
      const body=await parseBody(req); const user=getUserByUsername(body.username||'');
      if(!user||!user.active) return sendJson(res,401,{error:'Invalid credentials'});
      if(!verifyPassword(body.password||'',user.password_salt,user.password_hash)) return sendJson(res,401,{error:'Invalid credentials'});
      const token=issueToken(user);
      logAudit({actorUserId:user.id,actorUsername:user.username,action:'auth.login',entityType:'auth',metadata:{sourceIp:req.socket.remoteAddress}});
      return sendJson(res,200,{token,user:{id:user.id,username:user.username,role:user.role}});
    }
    const user=authFromRequest(req); if(!user) return sendJson(res,401,{error:'Unauthorized'});
    if(req.method==='GET'&&path==='/api/audit'){
      if(!requireRole(user,['admin','auditor'])) return sendJson(res,403,{error:'Forbidden'});
      const limit=Math.min(Number(url.searchParams.get('limit')||200),1000);
      return sendJson(res,200,{items:listAuditLogs({limit,entityType:url.searchParams.get('entityType')||undefined,entityId:url.searchParams.get('entityId')||undefined})});
    }
    const match=path.match(/^\/api\/([a-z-]+)(?:\/([a-f0-9-]+))?(?:\/(archive|restore))?$/i);
    if(!match) return sendJson(res,404,{error:'Not found'});
    const [,entityType,entityId,action]=match;
    if(!ENTITY_ALLOWLIST.has(entityType)) return sendJson(res,400,{error:'Unsupported entity type'});
    if(req.method==='GET'&&!entityId){const items=listRecords(entityType,url.searchParams.get('includeArchived')==='true').map((r)=>({id:r.id,status:r.status,createdAt:r.created_at,updatedAt:r.updated_at,...r.payload})); return sendJson(res,200,{items});}
    if(req.method==='GET'&&entityId){const r=getRecord(entityType,entityId); if(!r) return sendJson(res,404,{error:'Not found'}); return sendJson(res,200,{item:{id:r.id,status:r.status,createdAt:r.created_at,updatedAt:r.updated_at,...r.payload}});}
    if(req.method==='POST'&&!entityId){if(!requireRole(user,['admin','manager','operator'])) return sendJson(res,403,{error:'Forbidden'}); const body=await parseBody(req); const created=createRecord({entityType,payload:body.payload??body,actorUserId:user.sub}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.create',entityType,entityId:created.id}); return sendJson(res,201,{item:{id:created.id,status:created.status,...created.payload}});}
    if(req.method==='PUT'&&entityId){if(!requireRole(user,['admin','manager','operator'])) return sendJson(res,403,{error:'Forbidden'}); const body=await parseBody(req); const updated=updateRecord({entityType,id:entityId,payload:body.payload??body,actorUserId:user.sub}); if(!updated) return sendJson(res,404,{error:'Not found'}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.update',entityType,entityId}); return sendJson(res,200,{item:{id:updated.id,status:updated.status,...updated.payload}});}
    if(req.method==='POST'&&entityId&&action==='archive'){if(!requireRole(user,['admin','manager'])) return sendJson(res,403,{error:'Forbidden'}); const archived=setRecordStatus({entityType,id:entityId,status:'archived',actorUserId:user.sub}); if(!archived) return sendJson(res,404,{error:'Not found'}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.archive',entityType,entityId}); return sendJson(res,200,{ok:true});}
    if(req.method==='POST'&&entityId&&action==='restore'){if(!requireRole(user,['admin','manager'])) return sendJson(res,403,{error:'Forbidden'}); const restored=setRecordStatus({entityType,id:entityId,status:'active',actorUserId:user.sub}); if(!restored) return sendJson(res,404,{error:'Not found'}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.restore',entityType,entityId}); return sendJson(res,200,{ok:true});}
    if(req.method==='DELETE'&&entityId){if(!requireRole(user,['admin'])) return sendJson(res,403,{error:'Forbidden'}); if(!hardDeleteRecord({entityType,id:entityId})) return sendJson(res,404,{error:'Not found'}); logAudit({actorUserId:user.sub,actorUsername:user.username,action:'record.delete',entityType,entityId}); return sendJson(res,200,{ok:true});}
    return sendJson(res,405,{error:'Method not allowed'});
  }catch(error){ return sendJson(res,500,{error:'Internal server error',detail:error.message}); }
});
server.listen(PORT,()=>console.log(`Altus API listening on http://localhost:${PORT}`));
