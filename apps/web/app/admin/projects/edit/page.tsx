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
  progress: number;
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
  const [progress, setProgress] = useState(0);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState('');
  const [sendingUpdate, setSendingUpdate] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(
        'elijah-cloud-platform-token'
      );

      const res = await fetch(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        setProgress(project.progress ?? 0);
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

    const token = localStorage.getItem(
      'elijah-cloud-platform-token'
    );

    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        status,
        progress,
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
  async function handleProjectUpdate() {
    if (!id) {
      alert('Project ID is missing');
      return;
    }

    if (!updateMessage.trim()) {
      alert('Please enter a project update');
      return;
    }

    const token = localStorage.getItem(
      'elijah-cloud-platform-token'
    );

    try {
      setSendingUpdate(true);

      const res = await fetch(`${API_URL}/projects/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: id,
          message: updateMessage.trim(),
        }),
      });

      if (!res.ok) {
        alert('Could not send project update');
        return;
      }

      setUpdateMessage('');
      alert('Project update sent successfully');
    } finally {
      setSendingUpdate(false);
    }
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

        {/* Progress */}
        <div style={{ marginTop: 20 }}>
          <label
            htmlFor="progress"
            style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Progress: {progress}%
          </label>

          <input
            id="progress"
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) =>
              setProgress(Number(e.target.value))
            }
            style={{
              width: '100%',
              maxWidth: 600,
            }}
          />
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
            onChange={(e) =>
              setDescription(e.target.value)
            }
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
            onChange={(e) =>
              setStartDate(e.target.value)
            }
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
            onChange={(e) =>
              setDueDate(e.target.value)
            }
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

        {/* Project Update Message */}
        <div
          style={{
            marginTop: 30,
            paddingTop: 24,
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <h2>Project Updates</h2>

          <p style={{ color: '#64748b' }}>
            Send an update that the customer can see in their portal.
          </p>

          <textarea
            value={updateMessage}
            onChange={(e) => setUpdateMessage(e.target.value)}
            placeholder="Write a project update..."
            rows={4}
            style={{
              width: '100%',
              maxWidth: 600,
              padding: 12,
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />

          <div>
            <button
              type="button"
              onClick={handleProjectUpdate}
              disabled={sendingUpdate}
              style={{
                marginTop: 12,
                padding: '10px 16px',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                cursor: sendingUpdate ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              {sendingUpdate ? 'Sending...' : 'Send Update'}
            </button>
          </div>
        </div>

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