import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { title, status } = await req.json();

    let rows;
    if (title !== undefined && status !== undefined) {
      rows = await sql`UPDATE tasks SET title = ${title.trim()}, status = ${status} WHERE id = ${id} RETURNING *`;
    } else if (title !== undefined) {
      rows = await sql`UPDATE tasks SET title = ${title.trim()} WHERE id = ${id} RETURNING *`;
    } else if (status !== undefined) {
      rows = await sql`UPDATE tasks SET status = ${status} WHERE id = ${id} RETURNING *`;
    } else {
      return NextResponse.json({ error: "Tidak ada data yang diubah" }, { status: 400 });
    }

    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate tugas" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus tugas" }, { status: 500 });
  }
}
