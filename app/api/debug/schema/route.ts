import { NextResponse } from "next/server";
import sql from "@/lib/db";

// API untuk cek struktur database
// Akses: http://localhost:3000/api/debug/schema

export async function GET() {
  try {
    // Cek struktur tabel tasks
    const columns = await sql`
      SELECT 
        column_name, 
        data_type, 
        column_default,
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'tasks'
      ORDER BY ordinal_position
    `;

    // Cek sample data
    const tasks = await sql`SELECT * FROM tasks LIMIT 3`;

    // Cek triggers
    const triggers = await sql`
      SELECT 
        trigger_name, 
        event_manipulation
      FROM information_schema.triggers
      WHERE event_object_table = 'tasks'
    `;

    return NextResponse.json({
      success: true,
      database: {
        columns: columns,
        sampleTasks: tasks,
        triggers: triggers,
      },
      message: "Database schema check successful"
    });
  } catch (error: any) {
    console.error('Schema check error:', error);
    return NextResponse.json({ 
      error: "Failed to check schema", 
      details: error.message 
    }, { status: 500 });
  }
}
