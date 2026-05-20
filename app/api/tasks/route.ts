import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title?.trim()) return NextResponse.json({ error: "Judul tidak boleh kosong" }, { status: 400 });

    const rows = await sql`
      INSERT INTO tasks (title, status) 
      VALUES (${title.trim()}, 'todo') 
      RETURNING *
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal membuat tugas" }, { status: 500 });
  }
}
