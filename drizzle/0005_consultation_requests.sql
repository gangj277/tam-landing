CREATE TABLE consultation_requests (
  id TEXT PRIMARY KEY,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  child_grade TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL
);
