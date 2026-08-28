-- Migration number: 0001 	 2026-08-28T00:00:00.000Z
--
-- Organizations that have signed the principles. Consultation requests are deliberately absent:
-- they are emailed on and followed up from the inbox, never stored here.
--
-- `status` is what a future public signatory list would filter on.

CREATE TABLE signatories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organisation_name TEXT NOT NULL,
  organisation_type TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  role TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | published | rejected
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX idx_signatories_status ON signatories(status);
CREATE INDEX idx_signatories_created_at ON signatories(created_at);
