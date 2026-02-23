import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import { hashPassword } from './auth.mjs';
const DB_PATH = process.env.ALTUS_DB_PATH || 'backend/altus.db';
export const db = new DatabaseSync(DB_PATH);
const nowIso = () => new Date().toISOString();
export function initDatabase() {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL, password_salt TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','manager','operator','auditor')),
      active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY, entity_type TEXT NOT NULL, payload_json TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('active','archived')) DEFAULT 'active',
      created_by TEXT NOT NULL, updated_by TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_records_entity ON records(entity_type);
    CREATE INDEX IF NOT EXISTS idx_records_status ON records(status);
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY, actor_user_id TEXT NOT NULL, actor_username TEXT NOT NULL,
      action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT, metadata_json TEXT, created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);
  `);
  seedAdmin();
}
function seedAdmin() {
  const username = process.env.ALTUS_ADMIN_USERNAME || 'admin';
  const password = process.env.ALTUS_ADMIN_PASSWORD || 'ChangeMeNow!';
  if (process.env.NODE_ENV === 'production' && password === 'ChangeMeNow!') throw new Error('ALTUS_ADMIN_PASSWORD must be set in production.');
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) return;
  const { salt, hash } = hashPassword(password);
  const now = nowIso();
  db.prepare("INSERT INTO users (id, username, password_hash, password_salt, role, active, created_at, updated_at) VALUES (?, ?, ?, ?, 'admin', 1, ?, ?)")
    .run(randomUUID(), username, hash, salt, now, now);
}
export const getUserByUsername = (username) => db.prepare('SELECT * FROM users WHERE username = ?').get(username);
export function logAudit({ actorUserId, actorUsername, action, entityType, entityId = null, metadata = {} }) {
  db.prepare('INSERT INTO audit_logs (id, actor_user_id, actor_username, action, entity_type, entity_id, metadata_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(randomUUID(), actorUserId, actorUsername, action, entityType, entityId, JSON.stringify(metadata), nowIso());
}
export function listRecords(entityType, includeArchived = false) {
  const sql = includeArchived ? 'SELECT * FROM records WHERE entity_type = ? ORDER BY updated_at DESC' : "SELECT * FROM records WHERE entity_type = ? AND status = 'active' ORDER BY updated_at DESC";
  return db.prepare(sql).all(entityType).map((r) => ({ ...r, payload: JSON.parse(r.payload_json) }));
}
export function getRecord(entityType, id) {
  const r = db.prepare('SELECT * FROM records WHERE entity_type = ? AND id = ?').get(entityType, id);
  return r ? { ...r, payload: JSON.parse(r.payload_json) } : null;
}
export function createRecord({ entityType, payload, actorUserId }) {
  const id = randomUUID(); const now = nowIso();
  db.prepare("INSERT INTO records (id, entity_type, payload_json, status, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, 'active', ?, ?, ?, ?)")
    .run(id, entityType, JSON.stringify(payload), actorUserId, actorUserId, now, now);
  return getRecord(entityType, id);
}
export function updateRecord({ entityType, id, payload, actorUserId }) {
  const result = db.prepare('UPDATE records SET payload_json = ?, updated_by = ?, updated_at = ? WHERE entity_type = ? AND id = ?')
    .run(JSON.stringify(payload), actorUserId, nowIso(), entityType, id);
  return result.changes ? getRecord(entityType, id) : null;
}
export function setRecordStatus({ entityType, id, status, actorUserId }) {
  const result = db.prepare('UPDATE records SET status = ?, updated_by = ?, updated_at = ? WHERE entity_type = ? AND id = ?')
    .run(status, actorUserId, nowIso(), entityType, id);
  return result.changes ? getRecord(entityType, id) : null;
}
export const hardDeleteRecord = ({ entityType, id }) => db.prepare('DELETE FROM records WHERE entity_type = ? AND id = ?').run(entityType, id).changes > 0;
export function listAuditLogs({ limit = 200, entityType, entityId }) {
  let sql = 'SELECT * FROM audit_logs WHERE 1=1'; const params = [];
  if (entityType) { sql += ' AND entity_type = ?'; params.push(entityType); }
  if (entityId) { sql += ' AND entity_id = ?'; params.push(entityId); }
  sql += ' ORDER BY created_at DESC LIMIT ?'; params.push(limit);
  return db.prepare(sql).all(...params).map((l) => ({ ...l, metadata: JSON.parse(l.metadata_json || '{}') }));
}
