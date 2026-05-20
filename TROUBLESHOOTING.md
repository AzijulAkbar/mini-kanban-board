# 🔧 TROUBLESHOOTING GUIDE

## ❌ Error: "Gagal mengupdate tugas"

### Penyebab:
1. Kolom `updated_at` belum ada di database
2. Query UPDATE salah
3. Koneksi database bermasalah

### Solusi:

#### 1. Cek Database Schema
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks';
```

Pastikan ada kolom:
- `description` (text)
- `priority` (varchar)
- `due_date` (date)
- `updated_at` (timestamp)

#### 2. Tambahkan Kolom yang Kurang
```sql
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

#### 3. Buat Trigger Auto-Update
```sql
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
```

#### 4. Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

#### 5. Test Update
- Buka app di browser
- Klik pensil di card
- Edit task
- Klik "Simpan"
- Cek console (F12) untuk error

---

## ❌ Error: "Unexpected token 'style(' in media list"

### Penyebab:
CSS error atau API response yang salah

### Solusi:

#### 1. Clear Browser Cache
```
Ctrl + Shift + Delete → Clear cache
Atau
Ctrl + F5 (hard refresh)
```

#### 2. Cek API Response
Buka Network tab (F12):
- Cari request `PUT /api/tasks/[id]`
- Klik → Response tab
- Pastikan response JSON, bukan HTML/CSS

#### 3. Cek Console Error
```javascript
// Buka Console (F12)
// Lihat error detail
```

---

## ❌ CRUD Tidak Berfungsi

### Test Satu Per Satu:

#### 1. Test CREATE
```javascript
// Di browser console (F12)
fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test',
    priority: 'high'
  })
})
.then(r => r.json())
.then(d => console.log('CREATE:', d))
.catch(e => console.error('ERROR:', e));
```

**Jika gagal:**
- Cek `POST Error:` di terminal/console
- Pastikan `DATABASE_URL` benar di `.env.local`
- Cek koneksi database

#### 2. Test READ
```javascript
fetch('/api/tasks')
.then(r => r.json())
.then(d => console.log('READ:', d))
.catch(e => console.error('ERROR:', e));
```

**Jika gagal:**
- Cek `GET Error:` di terminal
- Pastikan tabel `tasks` ada
- Jalankan: `SELECT * FROM tasks;`

#### 3. Test UPDATE
```javascript
// Ganti 1 dengan ID task yang ada
fetch('/api/tasks/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'done'
  })
})
.then(r => r.json())
.then(d => console.log('UPDATE:', d))
.catch(e => console.error('ERROR:', e));
```

**Jika gagal:**
- Cek `PUT Error:` di terminal
- Pastikan ID task ada
- Cek kolom `updated_at` ada

#### 4. Test DELETE
```javascript
// Ganti 1 dengan ID task yang mau dihapus
fetch('/api/tasks/1', {
  method: 'DELETE'
})
.then(r => r.json())
.then(d => console.log('DELETE:', d))
.catch(e => console.error('ERROR:', e));
```

**Jika gagal:**
- Cek `DELETE Error:` di terminal
- Pastikan ID task ada

---

## ❌ Database Connection Error

### Error: "Failed to connect to database"

#### 1. Cek Environment Variable
```bash
# Lihat .env.local
cat .env.local

# Pastikan ada:
DATABASE_URL=postgresql://user:pass@host/dbname
```

#### 2. Test Koneksi
```bash
# Install psql (jika belum)
# Windows: Download PostgreSQL
# Mac: brew install postgresql
# Linux: sudo apt install postgresql-client

# Test koneksi
psql $DATABASE_URL
```

#### 3. Cek Neon Dashboard
- Buka [neon.tech](https://neon.tech)
- Pastikan database online
- Copy connection string yang benar

#### 4. Restart Dev Server
```bash
npm run dev
```

---

## ❌ Task Tidak Muncul di Board

### Penyebab:
1. API GET gagal
2. Data tidak ada di database
3. Filter aktif

### Solusi:

#### 1. Cek Console
```
F12 → Console tab
Lihat error "Fetch error:" atau "GET Error:"
```

#### 2. Cek Network
```
F12 → Network tab
Cari request "tasks"
Klik → Response tab
Pastikan ada array tasks
```

#### 3. Cek Database
```sql
SELECT * FROM tasks ORDER BY created_at DESC;
```

#### 4. Reset Filter
Klik tombol "Reset Filter" di app

---

## ❌ Filter Tidak Bekerja

### Solusi:

#### 1. Hard Refresh
```
Ctrl + F5
```

#### 2. Cek State
```javascript
// Di browser console
// Lihat state filter
console.log('Filter Priority:', filterPriority);
console.log('Filter Search:', filterSearch);
```

#### 3. Clear Filter
Klik "Reset Filter"

---

## ❌ SweetAlert Tidak Muncul

### Solusi:

#### 1. Cek Package
```bash
npm list sweetalert2
```

#### 2. Install Ulang
```bash
npm install sweetalert2
```

#### 3. Restart Server
```bash
npm run dev
```

---

## ✅ CHECKLIST DEBUGGING

Ikuti urutan ini:

1. [ ] **Cek Database Schema** - Jalankan `database-check.sql`
2. [ ] **Cek Environment** - Pastikan `DATABASE_URL` benar
3. [ ] **Restart Server** - `npm run dev`
4. [ ] **Clear Cache** - Ctrl + F5
5. [ ] **Test CREATE** - Tambah task baru
6. [ ] **Test READ** - Refresh page
7. [ ] **Test UPDATE** - Edit task
8. [ ] **Test DELETE** - Hapus task
9. [ ] **Cek Console** - F12 untuk error
10. [ ] **Cek Network** - F12 → Network tab

---

## 📞 MASIH ERROR?

Kirim info ini:

1. **Error Message** (dari console)
2. **API Response** (dari Network tab)
3. **Database Schema** (hasil query check)
4. **Environment** (OS, Node version, Database)

Format:
```
Error: [paste error message]
API Response: [paste response]
Database: [Neon/Vercel/Local]
Node: [version]
```

---

**Semua CRUD harus berfungsi setelah troubleshooting! 💪**
