"use client";
import { useState, useEffect, useCallback } from "react";
import { Task, TaskStatus, TaskPriority } from "./types";
import TaskCard from "./components/TaskCard";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To Do" },
  { status: "doing", label: "In Progress" },
  { status: "done", label: "Done" },
];

const T = {
  en: {
    title: "Mini Kanban Board",
    subtitle: "tasks · Manage your tasks easily",
    addTask: "+ Add Task",
    search: "Search tasks...",
    priority: "Priority:",
    status: "Status:",
    all: "All",
    high: "High",
    medium: "Medium",
    low: "Low",
    todo: "To Do",
    doing: "In Progress",
    done: "Done",
    resetFilter: "Reset Filter",
    dropHere: "Drop here",
    noTasks: "No tasks yet",
    modalTitle: "Add New Task",
    taskTitle: "Task Title *",
    taskTitlePlaceholder: "Enter task title...",
    description: "Description",
    descriptionPlaceholder: "Add description (optional)...",
    dueDate: "Due Date",
    cancel: "Cancel",
    save: "Save Task",
    saving: "Saving...",
  },
  id: {
    title: "Mini Kanban Board",
    subtitle: "tugas · Kelola tugas Anda dengan mudah",
    addTask: "+ Tambah Tugas",
    search: "🔍 Cari tugas...",
    priority: "Prioritas:",
    status: "Status:",
    all: "Semua",
    high: "Tinggi",
    medium: "Sedang",
    low: "Rendah",
    todo: "Belum Dikerjakan",
    doing: "Sedang Dikerjakan",
    done: "Selesai",
    resetFilter: "Reset Filter",
    dropHere: "Taruh di sini",
    noTasks: "Belum ada tugas",
    modalTitle: "Tambah Tugas Baru",
    taskTitle: "Judul Tugas *",
    taskTitlePlaceholder: "Masukkan judul tugas...",
    description: "Deskripsi",
    descriptionPlaceholder: "Tambahkan deskripsi (opsional)...",
    dueDate: "Tenggat Waktu",
    cancel: "Batal",
    save: "Simpan Tugas",
    saving: "Menyimpan...",
  }
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [lang, setLang] = useState<"en" | "id">("en");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterSearch, setFilterSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    due_date: "",
  });

  const t = T[lang];

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
    const matchStatus = filterStatus === "all" || task.status === filterStatus;
    const matchSearch = task.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
                       (task.description?.toLowerCase().includes(filterSearch.toLowerCase()) || false);
    return matchPriority && matchStatus && matchSearch;
  });

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <main className="page">
      <div className="page-inner">
        <div className="topbar">
          <div>
            <h1 className="topbar-title">{t.title}</h1>
            <p className="topbar-sub">{tasks.length} {t.subtitle}</p>
          </div>
          <div className="topbar-actions">
            <button className="lang-btn" onClick={() => setLang(lang === "en" ? "id" : "en")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {lang === "en" ? "ID" : "EN"}
            </button>
            <button className="add-btn" onClick={() => setShowModal(true)}>{t.addTask}</button>
          </div>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            <input className="filter-search" type="text" placeholder={t.search} value={filterSearch} onChange={e => setFilterSearch(e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label">{t.status}</label>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value as TaskStatus | "all")}>
              <option value="all">{t.all}</option>
              <option value="todo">{t.todo}</option>
              <option value="doing">{t.doing}</option>
              <option value="done">{t.done}</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">{t.priority}</label>
            <select className="filter-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value as TaskPriority | "all")}>
              <option value="all">{t.all}</option>
              <option value="high">{t.high}</option>
              <option value="medium">{t.medium}</option>
              <option value="low">{t.low}</option>
            </select>
          </div>
          {(filterPriority !== "all" || filterStatus !== "all" || filterSearch) && (
            <button className="filter-reset" onClick={() => { setFilterPriority("all"); setFilterStatus("all"); setFilterSearch(""); }}>{t.resetFilter}</button>
          )}
        </div>

        <div className="board">
          {COLUMNS.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div key={col.status} className={`col ${draggedTask?.status !== col.status && draggedTask ? 'drag-over' : ''}`} data-status={col.status} onDragOver={handleDragOver} onDrop={() => handleDrop(col.status)}>
                <div className="col-head">
                  <span className="col-label">{col.label}</span>
                  <span className="col-count">{colTasks.length}</span>
                </div>
                <div className="col-body">
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onDragStart={handleDragStart} lang={lang} />
                  ))}
                  {colTasks.length === 0 && <div className="empty">{draggedTask ? t.dropHere : t.noTasks}</div>}
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
              <h2 className="modal-title">{t.modalTitle}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={addTask} className="modal-form">
              <div className="form-group">
                <label className="form-label">{t.taskTitle}</label>
                <input className="form-input" type="text" placeholder={t.taskTitlePlaceholder} value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">{t.description}</label>
                <textarea className="form-textarea" placeholder={t.descriptionPlaceholder} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t.priority}</label>
                  <select className="form-select" value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value as TaskPriority }))}>
                    <option value="high">{t.high}</option>
                    <option value="medium">{t.medium}</option>
                    <option value="low">{t.low}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t.dueDate}</label>
                  <input className="form-input" type="date" value={formData.due_date} onChange={e => setFormData(p => ({ ...p, due_date: e.target.value }))} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={adding}>{t.cancel}</button>
                <button type="submit" className="btn-save" disabled={adding}>{adding ? t.saving : t.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
