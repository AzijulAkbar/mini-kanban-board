import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title?.trim()) return NextResponse.json({ error: "Judul tidak boleh kosong" }, { status: 400 });

    const [result]: any = await pool.query(
      "INSERT INTO tasks (title, status) VALUES (?, 'todo')",
      [title.trim()]
    );
    const [rows]: any = await pool.query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal membuat tugas" }, { status: 500 });
  }
}
