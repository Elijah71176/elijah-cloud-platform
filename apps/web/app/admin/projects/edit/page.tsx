'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Project = {
  id: string;
  title: string;
  status: 'planned' | 'active' | 'done';
};

function EditProjectForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Project['status']>('planned');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/projects`);
      const data = (await res.json()) as Project[];
      const project = data.find((p) => p.id === id);

      if (project) {
        setTitle(project.title);
        setStatus(project.status);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  async function handleUpdate() {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status }),
    });

    if (!res.ok) {
      alert('Update failed');
      return;
    }
    window.location.href = '/admin/projects';
  }

  if (loading) return <main style={{ padding: 24 }}>Loading...</main>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Edit Project</h1>

      <div style={{ marginTop: 20 }}>
        <label>Title</label>
        <br />
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Status</label>
        <br />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Project['status'])}
        >
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="done">Done</option>
        </select>
      </div>

      <button onClick={handleUpdate} style={{ marginTop: 20 }}>
        Update Project
      </button>

      <div style={{ marginTop: 20 }}>
        <Link href="/admin/projects">← Back</Link>
      </div>
    </main>
  );
}

export default function EditProjectPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>Loading...</main>}>
      <EditProjectForm />
    </Suspense>
  );
}