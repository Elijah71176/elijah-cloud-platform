'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Project = {
  id: string;
  title: string;
  status: 'planned' | 'active' | 'on_hold' | 'done';
  description?: string;
  startDate?: string;
  dueDate?: string;
};

function EditProjectForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [status, setStatus] =
    useState<Project['status']>('planned');

  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/projects`);

      if (!res.ok) {
        alert('Could not load project');
        setLoading(false);
        return;
      }

      const data = (await res.json()) as Project[];
      const project = data.find((p) => p.id === id);

      if (project) {
        setTitle(project.title);
        setStatus(project.status);
        setDescription(project.description || '');
        setStartDate(project.startDate || '');
        setDueDate(project.dueDate || '');
      }

      setLoading(false);
    }

    load();
  }, [id]);

  async function handleUpdate() {
    if (!id) {
      alert('Project ID is missing');
      return;
    }

    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        status,
        description,
        startDate,
        dueDate,
      }),
    });

    if (!res.ok) {
      alert('Update failed');
      return;
    }

    window.location.href = '/admin/projects';
  }

  if (loading) {
    return <main style={{ padding: 24 }}>Loading...</main>;
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 40,
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          maxWidth: 700,
          background: '#ffffff',
          padding: 30,
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        }}
      >
        <h1 style={{ marginTop: 0 }}>Edit Project</h1>

        {/* Title */}
        <div style={{ marginTop: 20 }}>
          <label
            htmlFor="title"
            style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Title
          </label>

          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 600,
              padding: 10,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Status */}
        <div style={{ marginTop: 20 }}>
          <label
            htmlFor="status"
            style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as Project['status'])
            }
            style={{
              padding: 10,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
            }}
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Description */}
        <div style={{ marginTop: 20 }}>
          <label
            htmlFor="description"
            style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the project, requirements, goals, or important notes..."
            rows={6}
            style={{
              width: '100%',
              maxWidth: 600,
              padding: 12,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontSize: 15,
              lineHeight: 1.5,
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Start Date */}
        <div style={{ marginTop: 20 }}>
          <label
            htmlFor="startDate"
            style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Start Date
          </label>

          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              padding: 10,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
            }}
          />
        </div>

        {/* Due Date */}
        <div style={{ marginTop: 20 }}>
          <label
            htmlFor="dueDate"
            style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Due Date
          </label>

          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{
              padding: 10,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
            }}
          />
        </div>

        {/* Update */}
        <button
          onClick={handleUpdate}
          style={{
            marginTop: 24,
            padding: '10px 16px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Update Project
        </button>

        <div style={{ marginTop: 20 }}>
          <Link href="/admin/projects">
            ← Back to Projects
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function EditProjectPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: 24 }}>
          Loading...
        </main>
      }
    >
      <EditProjectForm />
    </Suspense>
  );
}