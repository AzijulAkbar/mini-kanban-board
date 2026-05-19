import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, status } = await req.json();

    const fields: string[] = [];
    const values: any[] = [];

    if (title !== undefined) { fields.push("title = ?"); values.push(title.trim()); }
    if (status !== undefined) { fields.push("status = ?"); values.push(status); }
    if (!fields.length) return NextResponse.json({ error: "Tidak ada data yang diubah" }, { status: 400 });

    values.push(id);
    await pool.query(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`, values);

    const [rows]: any = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate tugas" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus tugas" }, { status: 500 });
  }
}
