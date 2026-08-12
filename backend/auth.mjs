import crypto from 'node:crypto';
import { randomUUID } from 'node:crypto';

const TOKEN_TTL_SECONDS = Number(process.env.ALTUS_TOKEN_TTL_SECONDS || 60 * 60 * 8);
const DEFAULT_JWT_SECRET = 'change-this-in-production';
const JWT_SECRET = process.env.ALTUS_JWT_SECRET || DEFAULT_JWT_SECRET;

if (process.env.NODE_ENV === 'production' && JWT_SECRET === DEFAULT_JWT_SECRET) {
  throw new Error('ALTUS_JWT_SECRET must be set to a strong random value in production.');
}

const b64 = (i) => Buffer.from(i).toString('base64url');
const fromB64 = (i) => Buffer.from(i, 'base64url').toString('utf8');

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, expectedHash) {
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  const derivedBuf = Buffer.from(derived, 'hex');
  const expectedBuf = Buffer.from(expectedHash, 'hex');
  if (derivedBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(derivedBuf, expectedBuf);
}

export function issueToken(user) {
  const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = b64(JSON.stringify({ sub: user.id, username: user.username, role: user.role, jti: randomUUID(), iat: now, exp: now + TOKEN_TTL_SECONDS }));
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${h}.${p}`).digest('base64url');
    const sigBuf = Buffer.from(s);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;
    const payload = JSON.parse(fromB64(p));
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
