import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    console.log('PUT Request - ID:', id, 'Body:', body);

    // Get current task first
    const current = await sql`SELECT * FROM tasks WHERE id = ${id}`;
    if (current.length === 0) {
      return NextResponse.json({ error: "Task tidak ditemukan" }, { status: 404 });
    }

    console.log('Current task:', current[0]);

    // Merge with current data
    const updated = {
      title: body.title !== undefined ? body.title.trim() : current[0].title,
      description: body.description !== undefined ? (body.description?.trim() || null) : current[0].description,
      status: body.status !== undefined ? body.status : current[0].status,
      priority: body.priority !== undefined ? body.priority : current[0].priority,
      due_date: body.due_date !== undefined ? (body.due_date || null) : current[0].due_date,
    };

    console.log('Updated data:', updated);

    // Update - cek apakah kolom updated_at ada
    let rows;
    try {
      // Try dengan updated_at
      rows = await sql`
        UPDATE tasks 
        SET 
          title = ${updated.title},
          description = ${updated.description},
          status = ${updated.status},
          priority = ${updated.priority},
          due_date = ${updated.due_date},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } catch (updateError: any) {
      // Jika error (kolom updated_at belum ada), update tanpa updated_at
      console.log('Trying without updated_at...');
      rows = await sql`
        UPDATE tasks 
        SET 
          title = ${updated.title},
          description = ${updated.description},
          status = ${updated.status},
          priority = ${updated.priority},
          due_date = ${updated.due_date}
        WHERE id = ${id}
        RETURNING *
      `;
    }

    console.log('PUT Success:', rows[0]);
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('PUT Error:', error);
    console.error('Error details:', error.message);
    return NextResponse.json({ 
      error: "Gagal mengupdate tugas", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('DELETE Request - ID:', id);
    
    const result = await sql`DELETE FROM tasks WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Task tidak ditemukan" }, { status: 404 });
    }
    
    console.log('DELETE Success:', id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    console.error('Error details:', error.message);
    return NextResponse.json({ 
      error: "Gagal menghapus tugas", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
