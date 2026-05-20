"use client";
import { useState, useEffect, useCallback } from "react";
import { Task, TaskStatus, TaskPriority } from "./types";
import TaskCard from "./components/TaskCard";

const COLUMNS: { status: TaskStatus; label: string; accent: string }[] = [
  { status: "todo",  label: "To Do",       accent: "#71717a" },
  { status: "doing", label: "In Progress",  accent: "#f59e0b" },
  { status: "done",  label: "Done",         accent: "#22c55e" },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [filterSearch, setFilterSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    due_date: "",
  });

  useEffect(() => {
    fetch("/api/tasks")
      .then(r => r.json())
      .then(d => setTasks(Array.isArray(d) ? d : []))
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const task = await res.json();
        setTasks(p => [task, ...p]);
        setFormData({ title: "", description: "", priority: "medium", due_date: "" });
        setShowModal(false);
      }
    } catch (err) {
      console.error('Add error:', err);
    }
    setAdding(false);
  };

  const updateTask = useCallback(async (id: number, data: Partial<Task>) => {
    setTasks(p => p.map(t => t.id === id ? { ...t, ...data } : t));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(p => p.map(t => t.id === id ? updated : t));
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (res.ok) setTasks(p => p.filter(t => t.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, []);

  const handleDragStart = useCallback((task: Task) => setDraggedTask(task), []);
  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);
  const handleDrop = useCallback((status: TaskStatus) => {
    if (draggedTask && draggedTask.status !== status) {
      updateTask(draggedTask.id, { status });
    }
    setDraggedTask(null);
  }, [draggedTask, updateTask]);

  const filteredTasks = tasks.filter(task => {
    const matchPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchSearch = task.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
    (task.description?.toLowerCase().includes(filterSearch.toLowerCase()) || false);
    return matchPriority && matchSearch;
  });

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <main className="page">
      <div className="page-inner">
        <div className="topbar">
          <div>
            <h1 className="topbar-title">Mini Kanban Board</h1>
            <p className="topbar-sub">{tasks.length} tasks · Kelola tugas Anda dengan mudah</p>
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>+ Tambah Task</button>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <input className="filter-search" type="text" placeholder="Cari task..." value={filterSearch} onChange={e => setFilterSearch(e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label">Priority:</label>
            <select className="filter-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value as TaskPriority | "all")}>
              <option value="all">Semua</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          {(filterPriority !== "all" || filterSearch) && (
            <button className="filter-reset" onClick={() => { setFilterPriority("all"); setFilterSearch(""); }}>Reset Filter</button>
          )}
        </div>

        <div className="board">
          {COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div key={col.status} className={`col ${draggedTask?.status !== col.status && draggedTask ? 'drag-over' : ''}`} data-status={col.status} onDragOver={handleDragOver} onDrop={() => handleDrop(col.status)}>
                <div className="col-head">
                  <span className="col-label">
                    <span className="col-accent" style={{ background: col.accent }} />
                    {col.label}
                  </span>
                  <span className="col-count">{colTasks.length}</span>
                </div>
                <div className="col-body">
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onDragStart={handleDragStart} />
                  ))}
                  {colTasks.length === 0 && <div className="empty">{draggedTask ? "Drop di sini" : "Belum ada task"}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Tambah Task Baru</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={addTask} className="modal-form">
              <div className="form-group">
                <label className="form-label">Judul Task *</label>
                <input className="form-input" type="text" placeholder="Masukkan judul task..." value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Deskripsi</label>
                <textarea className="form-textarea" placeholder="Tambahkan deskripsi (opsional)..." value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prioritas</label>
                  <select className="form-select" value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value as TaskPriority }))}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="form-input" type="date" value={formData.due_date} onChange={e => setFormData(p => ({ ...p, due_date: e.target.value }))} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={adding}>Batal</button>
                <button type="submit" className="btn-save" disabled={adding}>{adding ? "Menyimpan..." : "Simpan Task"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
