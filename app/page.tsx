"use client";

import { useState, useEffect } from "react";
import { Task, TaskStatus } from "./types";
import TaskCard from "./components/TaskCard";

const COLUMNS: { status: TaskStatus; label: string; accent: string }[] = [
  { status: "todo",  label: "To Do",       accent: "#71717a" },
  { status: "doing", label: "In Progress",  accent: "#f59e0b" },
  { status: "done",  label: "Done",         accent: "#22c55e" },
];

export default function Home() {
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [title, setTitle]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);

  useEffect(() => {
    fetch("/api/tasks")
      .then(r => r.json())
      .then(d => setTasks(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || adding) return;
    setAdding(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      const task = await res.json();
      setTasks(p => [task, ...p]);
      setTitle("");
    }
    setAdding(false);
  };

  const updateTask = async (id: number, data: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks(p => p.map(t => t.id === id ? updated : t));
    }
  };

  const deleteTask = async (id: number) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) setTasks(p => p.filter(t => t.id !== id));
  };

  if (loading) return <div className="loader-wrap"><div className="loader" /></div>;

  return (
    <main className="page">
      <div className="page-inner">

        <div className="topbar">
          <div>
            <h1 className="topbar-title">Task Board</h1>
            <p className="topbar-sub">{tasks.length} tasks total</p>
          </div>
          <form onSubmit={addTask} className="add-form">
            <input
              className="add-input"
              type="text"
              placeholder="New task..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={adding}
            />
            <button className="add-btn" type="submit" disabled={adding}>
              {adding ? "..." : "Add"}
            </button>
          </form>
        </div>

        <div className="board">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.status);
            return (
              <div key={col.status} className="col" data-status={col.status}>
                <div className="col-head">
                  <span className="col-label">
                    <span className="col-accent" style={{ background: col.accent }} />
                    {col.label}
                  </span>
                  <span className="col-count">{colTasks.length}</span>
                </div>
                <div className="col-body">
                  {colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="empty">empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
