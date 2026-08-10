'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Customer } from '@/lib/types';

type Status = 'planned' | 'active' | 'on_hold' | 'done';

const styles = {
  page: {
    padding: 24,
    maxWidth: 800,
    margin: '0 auto',
  } as const,

  h1: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
  } as const,

  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    background: 'white',
    marginTop: 16,
  } as const,

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  } as const,

  field: {
    display: 'grid',
    gap: 6,
  } as const,

  label: {
    fontWeight: 800,
  } as const,

  input: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    boxSizing: 'border-box',
  } as const,

  select: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    boxSizing: 'border-box',
  } as const,

  textarea: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    minHeight: 120,
    resize: 'vertical',
    boxSizing: 'border-box',
  } as const,

  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 14,
  } as const,

  btn: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: 'white',
    fontWeight: 800,
    cursor: 'pointer',
  } as const,

  primary: {
    background: '#111827',
    color: 'white',
    border: '1px solid #111827',
  } as const,

  error: {
    color: 'crimson',
    fontWeight: 800,
  } as const,

  muted: {
    color: '#6b7280',
    fontSize: 13,
  } as const,
};

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Status>('planned');
  const [customerId, setCustomerId] = useState('');

  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch(`${API_URL}/customers`);

        if (!res.ok) {
          throw new Error('Failed to load customers');
        }

        const data = await res.json();
        setCustomers(data);
      } catch {
        setError('Could not load customers (API down?)');
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, [API_URL]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !customerId) {
      setError('Title and customer are required');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          status,
          customerId,
          description,
          startDate: startDate || undefined,
          dueDate: dueDate || undefined,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(msg || 'Failed to create project');
        return;
      }

      router.push('/admin/projects');
    } catch {
      setError('Network error. Is the API running?');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main style={styles.page}>Loading…</main>;
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.h1}>Create Project</h1>

      <p style={styles.muted}>
        Fill the form and click Create.
      </p>

      <div style={styles.card}>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Title</label>

              <input
                style={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Website"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Status</label>

              <select
                style={styles.select}
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Status)
                }
              >
                <option value="planned">Planned</option>
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div
              style={{
                ...styles.field,
                gridColumn: '1 / -1',
              }}
            >
              <label style={styles.label}>Customer</label>

              <select
                style={styles.select}
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">-- Select customer --</option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                ...styles.field,
                gridColumn: '1 / -1',
              }}
            >
              <label style={styles.label}>Description</label>

              <textarea
                style={styles.textarea}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe the project, goals, requirements, or important notes..."
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Start Date</label>

              <input
                type="date"
                style={styles.input}
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Due Date</label>

              <input
                type="date"
                style={styles.input}
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
              />
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.btn,
                ...styles.primary,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Creating…' : 'Create'}
            </button>

            <button
              type="button"
              style={styles.btn}
              onClick={() => router.push('/admin/projects')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}