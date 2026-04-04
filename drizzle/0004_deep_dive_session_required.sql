-- Backfill any existing NULL session_id rows before making column NOT NULL
UPDATE deep_dives SET session_id = 'legacy-' || id WHERE session_id IS NULL;

-- Make session_id required
ALTER TABLE deep_dives ALTER COLUMN session_id SET NOT NULL;
