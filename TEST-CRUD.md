# 🧪 TEST CRUD OPERATIONS

## Cara Test Manual di Browser Console (F12)

Buka browser console dan jalankan script ini satu per satu:

### 1️⃣ **TEST CREATE (POST)**
```javascript
// Test tambah task baru
fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Task',
    description: 'Ini deskripsi test',
    priority: 'high',
    due_date: '2024-12-31'
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ CREATE Success:', d);
  window.testTaskId = d.id; // Simpan ID untuk test selanjutnya
})
.catch(e => console.error('❌ CREATE Error:', e));
```

**Expected Result:**
```json
{
  "id": 1,
  "title": "Test Task",
  "description": "Ini deskripsi test",
  "status": "todo",
  "priority": "high",
  "due_date": "2024-12-31",
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

---

### 2️⃣ **TEST READ (GET)**
```javascript
// Test ambil semua tasks
fetch('/api/tasks')
.then(r => r.json())
.then(d => {
  console.log('✅ READ Success - Total tasks:', d.length);
  console.log('Tasks:', d);
})
.catch(e => console.error('❌ READ Error:', e));
```

**Expected Result:**
```json
[
  {
    "id": 1,
    "title": "Test Task",
    "status": "todo",
    ...
  }
]
```

---

### 3️⃣ **TEST UPDATE (PUT)**
```javascript
// Test update task (ganti ID sesuai task yang ada)
const taskId = window.testTaskId || 1; // Gunakan ID dari CREATE test

fetch(`/api/tasks/${taskId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Task Updated',
    description: 'Deskripsi sudah diupdate',
    status: 'doing',
    priority: 'medium',
    due_date: '2024-12-25'
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ UPDATE Success:', d);
})
.catch(e => console.error('❌ UPDATE Error:', e));
```

**Expected Result:**
```json
{
  "id": 1,
  "title": "Test Task Updated",
  "description": "Deskripsi sudah diupdate",
  "status": "doing",
  "priority": "medium",
  "due_date": "2024-12-25",
  "updated_at": "2024-01-15T10:05:00.000Z"
}
```

---

### 4️⃣ **TEST UPDATE STATUS ONLY**
```javascript
// Test update status saja (seperti saat ubah dropdown)
const taskId = window.testTaskId || 1;

fetch(`/api/tasks/${taskId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'done'
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ UPDATE STATUS Success:', d);
})
.catch(e => console.error('❌ UPDATE STATUS Error:', e));
```

---

### 5️⃣ **TEST DELETE**
```javascript
// Test hapus task (ganti ID sesuai task yang mau dihapus)
const taskId = window.testTaskId || 1;

fetch(`/api/tasks/${taskId}`, {
  method: 'DELETE'
})
.then(r => r.json())
.then(d => {
  console.log('✅ DELETE Success:', d);
})
.catch(e => console.error('❌ DELETE Error:', e));
```

**Expected Result:**
```json
{
  "success": true
}
```

---

## 🔍 CEK DATABASE

Setelah test, cek database:

```sql
-- Lihat semua tasks
SELECT * FROM tasks ORDER BY created_at DESC;

-- Cek struktur tabel
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks'
ORDER BY ordinal_position;

-- Cek apakah updated_at auto-update
SELECT id, title, created_at, updated_at 
FROM tasks 
ORDER BY id DESC 
LIMIT 5;
```

---

## ✅ CHECKLIST TEST

Centang jika berhasil:

- [ ] **CREATE** - Task baru muncul di board
- [ ] **READ** - Tasks ter-load saat buka app
- [ ] **UPDATE (Edit)** - Klik pensil, edit, save → berhasil
- [ ] **UPDATE (Status)** - Ubah dropdown status → berhasil
- [ ] **DELETE** - Klik trash, konfirmasi → task hilang
- [ ] **Filter Priority** - Pilih High/Medium/Low → filter bekerja
- [ ] **Search** - Ketik di search box → hasil filter
- [ ] **Task ID** - ID muncul di card (#1, #2)
- [ ] **Due Date** - Tanggal muncul di card
- [ ] **Updated At** - Timestamp update muncul

---

## 🐛 JIKA ADA ERROR

### Error: "Gagal mengupdate tugas"
1. Buka Console (F12)
2. Lihat error detail di "PUT Error:"
3. Cek apakah kolom `updated_at` ada di database
4. Jalankan: `ALTER TABLE tasks ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`

### Error: "Task tidak ditemukan"
1. Cek ID task yang digunakan
2. Jalankan: `SELECT * FROM tasks;` di database
3. Pastikan ID yang digunakan ada

### Error: Network/Connection
1. Cek `DATABASE_URL` di `.env.local`
2. Pastikan database online (Neon/Vercel)
3. Test koneksi: `psql $DATABASE_URL`

---

## 📊 EXPECTED BEHAVIOR

| Action | Frontend | Backend | Database |
|--------|----------|---------|----------|
| **Add Task** | Modal → Form → Submit | POST /api/tasks | INSERT INTO tasks |
| **Load Tasks** | useEffect fetch | GET /api/tasks | SELECT * FROM tasks |
| **Edit Task** | Klik pensil → Edit → Save | PUT /api/tasks/[id] | UPDATE tasks SET ... |
| **Change Status** | Dropdown onChange | PUT /api/tasks/[id] | UPDATE tasks SET status |
| **Delete Task** | Klik trash → Confirm | DELETE /api/tasks/[id] | DELETE FROM tasks |
| **Filter** | Client-side filter | - | - |
| **Search** | Client-side search | - | - |

---

**Semua CRUD harus berfungsi 100%! 🎯**
