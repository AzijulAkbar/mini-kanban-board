# 📋 Mini Kanban Board

Aplikasi Kanban Board modern dan responsif yang dibangun dengan Next.js 16, TypeScript, dan PostgreSQL. Kelola tugas Anda dengan mudah menggunakan sistem drag-and-drop visual dengan fitur lengkap seperti priority, due date, dan deskripsi.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=flat-square&logo=postgresql)

## ✨ Fitur Utama

### 🎯 Manajemen Task Lengkap
- **Tambah Task dengan Modal** - Form lengkap dengan validasi
- **Edit Task** - Edit judul dan deskripsi langsung di card
- **Hapus Task** - Konfirmasi hapus dengan SweetAlert2
- **Status Task** - To Do, In Progress, Done

### 🔥 Fitur Premium
- **Priority Level** - High (Merah), Medium (Kuning), Low (Hijau)
- **Due Date** - Deadline dengan indikator overdue otomatis
- **Description** - Deskripsi detail untuk setiap task
- **Real-time Updates** - Perubahan langsung tanpa reload

### 🎨 UI/UX Modern
- **Desain Minimalis** - Clean dan profesional
- **Responsive** - Mobile-friendly
- **Smooth Animations** - Transisi halus
- **Color-coded Columns** - Visual yang jelas untuk setiap status

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ atau Bun
- Database PostgreSQL (Neon) atau MySQL/MariaDB
- npm/yarn/pnpm/bun

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd mini-kanban-board
```

2. **Install dependencies**
```bash
npm install
# atau
pnpm install
# atau
bun install
```

3. **Setup Database**

Jalankan query SQL untuk membuat tabel:
```sql
-- Untuk PostgreSQL (Neon)
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(10) NOT NULL DEFAULT 'todo',
  priority VARCHAR(10) DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Jika sudah ada database lama**, jalankan update:
```bash
# Lihat file: database-update.sql
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS due_date DATE;
```

4. **Setup Environment Variables**

Buat file `.env.local`:
```env
DATABASE_URL=your_database_connection_string
```

5. **Run Development Server**
```bash
npm run dev
# atau
pnpm dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Project

```
mini-kanban-board/
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts          # GET, POST tasks
│   │       └── [id]/route.ts     # PUT, DELETE task
│   ├── components/
│   │   └── TaskCard.tsx          # Komponen card task
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (Kanban board)
│   └── types.ts                  # TypeScript types
├── lib/
│   └── db.ts                     # Database connection
├── database.sql                  # SQL schema awal
├── database-update.sql           # SQL update untuk fitur baru
└── package.json
```

## 🎯 Cara Penggunaan

### Tambah Task Baru
1. Klik tombol **"+ Tambah Task"**
2. Isi form:
   - **Judul Task** (wajib)
   - **Deskripsi** (opsional)
   - **Priority** (High/Medium/Low)
   - **Due Date** (opsional)
3. Klik **"Simpan Task"**

### Edit Task
1. Hover pada card task
2. Klik icon **pensil** (Edit)
3. Edit judul dan deskripsi
4. Tekan **Enter** atau klik **"Simpan"**

### Ubah Status
- Gunakan dropdown di bagian bawah card
- Pilih: To Do, In Progress, atau Done

### Hapus Task
1. Hover pada card task
2. Klik icon **trash** (Hapus)
3. Konfirmasi dengan SweetAlert

## 🎨 Kustomisasi

### Warna & Theme
Edit `app/globals.css`:
```css
:root {
  --bg:         #f0f0f7;  /* Background utama */
  --surface:    #ffffff;  /* Background card */
  --todo-col:   #f59e0b;  /* Warna To Do */
  --doing-col:  #6366f1;  /* Warna In Progress */
  --done-col:   #22c55e;  /* Warna Done */
}
```

### Priority Colors
Edit `app/components/TaskCard.tsx`:
```typescript
const PRIORITY_CONFIG = {
  high: { label: "High", color: "#ef4444" },
  medium: { label: "Medium", color: "#f59e0b" },
  low: { label: "Low", color: "#22c55e" },
};
```

## 🔧 Tech Stack

- **Framework**: Next.js 16.2 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL (Neon) / MySQL
- **ORM**: @neondatabase/serverless
- **UI Library**: SweetAlert2
- **Styling**: Custom CSS (No Tailwind)

## 📊 Database Schema

```sql
tasks
├── id (SERIAL/INT) - Primary Key
├── title (VARCHAR) - Judul task
├── description (TEXT) - Deskripsi task
├── status (VARCHAR) - todo/doing/done
├── priority (VARCHAR) - high/medium/low
├── due_date (DATE) - Deadline
└── created_at (TIMESTAMP) - Tanggal dibuat
```

## 🐛 Troubleshooting

### Database Connection Error
- Pastikan `DATABASE_URL` di `.env.local` benar
- Cek koneksi database Anda

### Task tidak muncul
- Cek console browser untuk error
- Pastikan API endpoint berjalan: `/api/tasks`

### SweetAlert tidak muncul
- Pastikan `sweetalert2` sudah terinstall:
```bash
npm install sweetalert2
```

## 📝 Update dari Versi Lama

Jika Anda upgrade dari versi lama:

1. **Backup database** terlebih dahulu
2. Jalankan `database-update.sql`
3. Install dependencies baru: `npm install`
4. Restart dev server

## 🤝 Contributing

Contributions are welcome! Silakan buat Pull Request.

## 📄 License

MIT License - Bebas digunakan untuk project pribadi maupun komersial.

## 🙏 Credits

Built with ❤️ using:
- [Next.js](https://nextjs.org)
- [Neon Database](https://neon.tech)
- [SweetAlert2](https://sweetalert2.github.io)

---

**Happy Coding! 🚀**
