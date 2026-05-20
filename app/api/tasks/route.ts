import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
    console.log('GET Success - Total tasks:', rows.length);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: "Gagal mengambil data", details: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('POST Request - Body:', body);
    
    const { title, description, priority, due_date } = body;
    
    if (!title?.trim()) {
      return NextResponse.json({ error: "Judul tidak boleh kosong" }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO tasks (title, description, status, priority, due_date) 
      VALUES (
        ${title.trim()}, 
        ${description?.trim() || null}, 
        'todo', 
        ${priority || 'medium'}, 
        ${due_date || null}
      ) 
      RETURNING *
    `;
    
    console.log('POST Success:', rows[0]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: "Gagal membuat tugas", details: String(error) }, { status: 500 });
  }
}
