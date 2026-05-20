-- 🔧 CEK & FIX DATABASE
-- Jalankan query ini di Neon/Vercel Postgres untuk memastikan database sudah benar

-- 1. CEK STRUKTUR TABEL
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'tasks'
ORDER BY ordinal_position;

-- Expected result:
-- column_name  | data_type | column_default | is_nullable
-- id           | integer   | nextval(...)   | NO
-- title        | varchar   | NULL           | NO
-- description  | text      | NULL           | YES
-- status       | varchar   | 'todo'         | NO
-- priority     | varchar   | 'medium'       | YES
-- due_date     | date      | NULL           | YES
-- created_at   | timestamp | CURRENT_...    | YES
-- updated_at   | timestamp | CURRENT_...    | YES

-- 2. JIKA KOLOM BELUM ADA, TAMBAHKAN:
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. CEK TRIGGER (untuk auto-update updated_at)
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'tasks';

-- Expected result:
-- trigger_name              | event_manipulation | event_object_table
-- update_tasks_updated_at   | UPDATE             | tasks

-- 4. JIKA TRIGGER BELUM ADA, BUAT:
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at 
BEFORE UPDATE ON tasks
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 5. TEST DATA (opsional - untuk testing)
-- INSERT sample task
INSERT INTO tasks (title, description, status, priority, due_date)
VALUES ('Sample Task', 'Ini contoh task', 'todo', 'high', '2024-12-31')
RETURNING *;

-- 6. CEK DATA
SELECT 
    id,
    title,
    status,
    priority,
    due_date,
    created_at,
    updated_at
FROM tasks
ORDER BY created_at DESC
LIMIT 5;

-- 7. TEST UPDATE (untuk cek trigger)
-- Ganti ID sesuai task yang ada
UPDATE tasks 
SET title = 'Updated Title' 
WHERE id = 1
RETURNING id, title, created_at, updated_at;

-- updated_at harus berubah otomatis!

-- 8. CLEANUP (hapus sample data jika perlu)
-- DELETE FROM tasks WHERE title = 'Sample Task';

-- 9. CEK INDEX (opsional - untuk performa)
SELECT 
    indexname, 
    indexdef
FROM pg_indexes
WHERE tablename = 'tasks';

-- 10. BUAT INDEX (opsional - untuk performa query)
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- ✅ SETELAH SEMUA QUERY DIJALANKAN:
-- 1. Restart dev server: npm run dev
-- 2. Test CRUD di browser
-- 3. Cek console untuk error
