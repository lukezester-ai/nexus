-- init-db.sql
CREATE TABLE IF NOT EXISTS saga_state (
  correlation_id TEXT PRIMARY KEY,
  step VARCHAR(50),
  data JSONB,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
