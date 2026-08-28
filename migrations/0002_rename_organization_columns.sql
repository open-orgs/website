-- Migration number: 0002 	 2026-08-28T18:30:00.000Z
--
-- American English, to match the site copy and the field names on the wire.
--
-- The reset is deliberate, not collateral. `Co-operative` left ORGANIZATION_TYPES in the same
-- change, so any row holding it would carry a value the app can no longer produce or offer back.
-- The table was empty on both environments when this was written, so nothing is actually lost;
-- the DELETE is here so that a database seeded before the rename cannot keep the old spelling.

ALTER TABLE signatories RENAME COLUMN organisation_name TO organization_name;
ALTER TABLE signatories RENAME COLUMN organisation_type TO organization_type;

DELETE FROM signatories;
