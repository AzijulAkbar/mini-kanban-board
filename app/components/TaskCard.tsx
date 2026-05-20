"use client";

import { useState } from "react";
import { Task, TaskStatus, TaskPriority } from "../types";
import Swal from "sweetalert2";

interface Props {
  task: Task;
  onUpdate: (id: number, data: Partial<Task>) => void;
  onDelete: (id: number) => void;
  onDragStart: (task: Task) => void;
  lang: "en" | "id";
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo",  label: "To Do" },
  { value: "doing", label: "In Progress" },
  { value: "done",  label: "Done" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "high",  label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low",  label: "Low" },
];

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  high: { label: "High", color: "#ef4444" },
  medium: { label: "Medium", color: "#f59e0b" },
  low: { label: "Low", color: "#22c55e" },
};

const T = {
  en: {
    deleteTitle: "Delete Task?",
    deleteText: "This task will be permanently deleted!",
    confirmDelete: "Yes, Delete!",
    cancel: "Cancel",
    deleted: "Deleted!",
    deleteSuccess: "Task successfully deleted.",
    save: "Save",
  },
  id: {
    deleteTitle: "Hapus Tugas?",
    deleteText: "Tugas ini akan dihapus permanen!",
    confirmDelete: "Ya, Hapus!",
    cancel: "Batal",
    deleted: "Terhapus!",
    deleteSuccess: "Tugas berhasil dihapus.",
    save: "Simpan",
  }
};

export default function TaskCard({ task, onUpdate, onDelete, onDragStart, lang }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || "");
  const [editDueDate, setEditDueDate] = useState(task.due_date || "");
  const [editPriority, setEditPriority] = useState(task.priority);

  const t = T[lang];

  const save = () => {
    if (!editTitle.trim()) return;
    onUpdate(task.id, { 
      title: editTitle.trim(), 
      description: editDesc.trim() || undefined,
      due_date: editDueDate || undefined,
      priority: editPriority
    });
    setEditing(false);
  };

  const cancel = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setEditDueDate(task.due_date || "");
    setEditPriority(task.priority);
    setEditing(false);
  };

  const handleDelete = () => {
    Swal.fire({
      title: t.deleteTitle,
      text: t.deleteText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#8888a8",
      confirmButtonText: t.confirmDelete,
      cancelButtonText: t.cancel,
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(task.id);
        Swal.fire({
          title: t.deleted,
          text: t.deleteSuccess,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const formatDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString(lang === "en" ? "en-US" : "id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  if (editing) return (
    <div className="card">
      <div className="card-edit">
        <input
          className="edit-input"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) save(); if (e.key === "Escape") cancel(); }}
          placeholder="Task title..."
          autoFocus
        />
        <textarea
          className="edit-textarea"
          value={editDesc}
          onChange={e => setEditDesc(e.target.value)}
          placeholder="Description (optional)..."
          rows={2}
        />
        <div className="edit-row">
          <div className="edit-group">
            <label className="edit-label">Priority</label>
            <select
              className="edit-select"
              value={editPriority}
              onChange={e => setEditPriority(e.target.value as TaskPriority)}
            >
              {PRIORITY_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="edit-group">
            <label className="edit-label">Due Date</label>
            <input
              className="edit-input"
              type="date"
              value={editDueDate}
              onChange={e => setEditDueDate(e.target.value)}
            />
          </div>
        </div>
        <div className="edit-actions">
          <button className="btn-save" onClick={save}>{t.save}</button>
          <button className="btn-cancel" onClick={cancel}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="card"
      draggable
      onDragStart={() => onDragStart(task)}
    >
      <div className="card-view">
        <div className="card-header">
          <div className="card-id">#{task.id}</div>
          <div className="card-actions">
            <button className="icon-btn" onClick={() => setEditing(true)} title="Edit">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
            </button>
            <button className="icon-btn danger" onClick={handleDelete} title="Delete">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="card-top">
          <div className="card-title-wrap">
            <p className="card-title">{task.title}</p>
            <span className="priority-badge" style={{ background: PRIORITY_CONFIG[task.priority].color }}>
              {PRIORITY_CONFIG[task.priority].label}
            </span>
          </div>
        </div>
        {task.description && (
          <p className="card-desc">{task.description}</p>
        )}
        <div className="card-meta">
          {task.due_date && (
            <div className={`card-date ${isOverdue ? 'overdue' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{formatDate(task.due_date)}</span>
            </div>
          )}
        </div>
        <select
          className="card-select"
          value={task.status}
          onChange={e => onUpdate(task.id, { status: e.target.value as TaskStatus })}
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
