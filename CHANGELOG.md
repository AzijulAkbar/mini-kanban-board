# 🔧 PERBAIKAN CRUD & FITUR BARU

## ✅ YANG SUDAH DIPERBAIKI:

### 1. **CRUD Operations** 
- ✅ **CREATE** - Tambah task dengan modal lengkap
- ✅ **READ** - Fetch tasks dari database
- ✅ **UPDATE** - Edit task (title, description, due_date, status, priority)
- ✅ **DELETE** - Hapus task dengan konfirmasi SweetAlert

### 2. **Fitur Baru**
- ✅ **Filter by Priority** - Filter task berdasarkan High/Medium/Low
- ✅ **Search** - Cari task berdasarkan title atau description
- ✅ **Task ID** - Tampilkan ID task di card (#1, #2, dst)
- ✅ **Updated At** - Tracking kapan task terakhir diupdate
- ✅ **Due Date di Edit** - Bisa edit due date langsung di card

### 3. **Error Handling**
- ✅ Console logging untuk debugging
- ✅ Alert error jika CRUD gagal
- ✅ Validasi input

---

## 📋 UPDATE DATABASE:

### **Untuk Database yang Sudah Ada:**

Jalankan query ini di Neon/Vercel Postgres:

```sql
-- Tambah kolom baru
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Tambah trigger auto-update
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

### **Untuk Database Baru:**

Gunakan file `database-postgres.sql` (sudah include semua kolom + trigger)

---

## 🎯 CARA MENGGUNAKAN:

### **1. Filter Tasks**
- **Search**: Ketik di search box untuk cari task
- **Priority Filter**: Pilih High/Medium/Low/Semua
- **Reset**: Klik "Reset Filter" untuk clear semua filter

### **2. Tambah Task**
1. Klik "Tambah Task"
2. Isi form (title wajib, lainnya opsional)
3. Klik "Simpan Task"

### **3. Edit Task**
1. Hover pada card → Klik icon pensil
2. Edit title, description, dan due date
3. Klik "Simpan" atau tekan Enter

### **4. Ubah Status**
- Gunakan dropdown di card
- Pilih: To Do / In Progress / Done

### **5. Hapus Task**
1. Hover pada card → Klik icon trash
2. Konfirmasi dengan SweetAlert
3. Task terhapus

---

## 🔍 DEBUGGING:

Jika CRUD tidak berfungsi, cek:

### **1. Browser Console (F12)**
```
Cek error di Console tab:
- "POST Error:" → Gagal create
- "PUT Error:" → Gagal update
- "DELETE Error:" → Gagal delete
- "Fetch error:" → Gagal load tasks
```

### **2. Network Tab**
```
Cek request/response:
- POST /api/tasks → Status 201 (success)
- PUT /api/tasks/[id] → Status 200 (success)
- DELETE /api/tasks/[id] → Status 200 (success)
- GET /api/tasks → Status 200 (success)
```

### **3. Database**
```sql
-- Cek struktur tabel
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tasks';

-- Cek data
SELECT * FROM tasks ORDER BY created_at DESC;
```

---

## 🚀 DEPLOY KE VERCEL:

### **1. Setup Database di Neon**
1. Buka [neon.tech](https://neon.tech)
2. Create project → Copy connection string
3. Jalankan query dari `database-postgres.sql`

### **2. Deploy ke Vercel**
```bash
# Push ke GitHub
git add .
git commit -m "Fix CRUD + Add filters"
git push

# Di Vercel Dashboard
1. Import repository
2. Add Environment Variable:
   - Key: DATABASE_URL
   - Value: postgresql://... (dari Neon)
3. Deploy
```

### **3. Test Production**
- Buka URL Vercel
- Test semua fitur CRUD
- Cek filter & search

---

## 📊 FITUR LENGKAP:

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Create Task | ✅ | Modal dengan form lengkap |
| Read Tasks | ✅ | Auto-load saat buka app |
| Update Task | ✅ | Edit inline di card |
| Delete Task | ✅ | Dengan konfirmasi SweetAlert |
| Filter Priority | ✅ | High/Medium/Low/All |
| Search | ✅ | Cari di title & description |
| Task ID | ✅ | Tampil di card (#1, #2) |
| Due Date | ✅ | Dengan indikator overdue |
| Updated At | ✅ | Auto-update timestamp |
| Priority Badge | ✅ | Color-coded |
| Description | ✅ | Support multiline |
| Responsive | ✅ | Mobile-friendly |

---

## ⚠️ CATATAN PENTING:

1. **Updated At**: Otomatis update setiap kali task diubah (via trigger)
2. **Due Date**: Bisa diubah saat edit task
3. **Filter**: Real-time, tidak perlu reload
4. **Error Handling**: Semua error di-log ke console
5. **Validation**: Title wajib diisi

---

## 🐛 TROUBLESHOOTING:

### **Error: "Gagal mengupdate tugas"**
- Cek console untuk detail error
- Pastikan kolom `updated_at` sudah ada di database
- Pastikan trigger sudah dibuat

### **Filter tidak bekerja**
- Refresh browser (Ctrl+F5)
- Cek apakah tasks ter-load dengan benar

### **Task ID tidak muncul**
- Pastikan database menggunakan SERIAL (auto-increment)
- Cek apakah `id` ada di response API

---

**Semua fitur sudah siap production! 🎉**
