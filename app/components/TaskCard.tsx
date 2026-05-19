"use client";

import { useState } from "react";
import { Task, TaskStatus } from "../types";

interface Props {
  task: Task;
  onUpdate: (id: number, data: Partial<Task>) => void;
  onDelete: (id: number) => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo",  label: "To Do" },
  { value: "doing", label: "In Progress" },
  { value: "done",  label: "Done" },
];

export default function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [editing, setEditing]     = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const save = () => {
    if (!editTitle.trim()) return;
    onUpdate(task.id, { title: editTitle.trim() });
    setEditing(false);
  };

  const cancel = () => {
    setEditTitle(task.title);
    setEditing(false);
  };

  if (editing) return (
    <div className="card">
      <div className="card-edit">
        <input
          className="edit-input"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
          autoFocus
        />
        <div className="edit-actions">
          <button className="btn-save" onClick={save}>Simpan</button>
          <button className="btn-cancel" onClick={cancel}>Batal</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="card-view">
        <div className="card-top">
          <p className="card-title">{task.title}</p>
          <div className="card-actions">
            <button className="icon-btn" onClick={() => setEditing(true)} title="Edit">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
            </button>
            <button className="icon-btn danger" onClick={() => onDelete(task.id)} title="Hapus">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
        {task.created_at && (
          <p className="card-date">
            {new Date(task.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        )}
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
