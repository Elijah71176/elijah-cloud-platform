'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  status: 'planned' | 'active' | 'on_hold' | 'done';
  customerId: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function statusStyle(status: Project['status']) {
  if (status === 'done') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0',
    };
  }

  if (status === 'active') {
    return {
      background: '#dbeafe',
      color: '#1d4ed8',
      border: '1px solid #bfdbfe',
    };
  }
  if (status === "on_hold") {
    return {
      background: "#f3e8ff",
      color: "#7e22ce",
      border: "1px solid #e9d5ff",
    };
  }

  return {
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
  };
}

export default function ProjectsPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ADMIN AUTH CHECK
  useEffect(() => {
    const isAdmin = localStorage.getItem('elijah-cloud-platform-admin');

    if (isAdmin !== 'true') {
      router.push('/admin/login');
      return;
    }

    setAuthorized(true);
  }, [router]);

  // LOAD DATA
  useEffect(() => {
    async function load() {
      setError(null);
      setLoading(true);

      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/customers`),
        ]);

        if (!pRes.ok) throw new Error(await pRes.text());
        if (!cRes.ok) throw new Error(await cRes.text());

        setProjects((await pRes.json()) as Project[]);
        setCustomers((await cRes.json()) as Customer[]);
      } catch (e: any) {
        setError(e?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    if (authorized) {
      load();
    }
  }, [authorized]);

  const customerMap = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers]
  );

  const stats = {
    total: projects.length,
    planned: projects.filter((p) => p.status === 'planned').length,
    active: projects.filter((p) => p.status === 'active').length,
    onHold: projects.filter((p) => p.status === "on_hold").length,
    done: projects.filter((p) => p.status === 'done').length,
  };

  async function deleteProject(id: string) {
    const ok = confirm('Delete this project?');
    if (!ok) return;

    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok && res.status !== 204) {
      alert('Delete failed');
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  if (!authorized) {
    return (
      <main style={{ padding: 24 }}>
        Checking admin access...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '40px 24px',
      }}
    >
      <section style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            marginBottom: 28,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p style={{ margin: 0, color: '#2563eb', fontWeight: 800 }}>
              Elijah Cloud Platform
            </p>

            <h1 style={{ margin: '6px 0', fontSize: 38 }}>
              Project Dashboard
            </h1>

            <p style={{ margin: 0, color: '#64748b' }}>
              View, manage and track customer projects.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link
              href="/projects/new"
              style={{
                background: '#0f172a',
                color: 'white',
                padding: '12px 16px',
                borderRadius: 12,
                textDecoration: 'none',
                fontWeight: 800,
              }}
            >
              + New Project
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem('elijah-cloud-platform-admin');
                router.push('/admin/login');
              }}
              style={{
                border: '1px solid #cbd5e1',
                background: 'white',
                borderRadius: 12,
                padding: '12px 16px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            ['Total Projects', stats.total],
            ['Planned', stats.planned],
            ['Active', stats.active],
            ['On Hold', stats.onHold],
            ['Done', stats.done],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: 18,
                boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
              }}
            >
              <div style={{ color: '#64748b', fontWeight: 700 }}>
                {label}
              </div>

              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  marginTop: 8,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: 18,
            padding: 22,
            boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
          }}
        >
          {loading && <div>Loading projects…</div>}

          {!loading && error && (
            <div style={{ color: 'crimson', fontWeight: 800 }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr>
                    {['Title', 'Status', 'Customer', 'Actions'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: h === 'Actions' ? 'right' : 'left',
                          padding: 12,
                          borderBottom: '1px solid #e2e8f0',
                          fontSize: 13,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: 0.6,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {projects.map((p) => {
                    const c = customerMap.get(p.customerId);

                    const customerLabel = c
                      ? `${c.name} (${c.email})`
                      : p.customerId;

                    return (
                      <tr key={p.id}>
                        <td
                          style={{
                            padding: 12,
                            borderBottom: '1px solid #f1f5f9',
                          }}
                        >
                          <div style={{ fontWeight: 900 }}>
                            {p.title}
                          </div>

                          <div
                            style={{
                              color: '#64748b',
                              fontSize: 13,
                            }}
                          >
                            {p.id}
                          </div>
                        </td>

                        <td
                          style={{
                            padding: 12,
                            borderBottom: '1px solid #f1f5f9',
                          }}
                        >
                          <span
                            style={{
                              ...statusStyle(p.status),
                              display: 'inline-flex',
                              padding: '5px 11px',
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 900,
                              textTransform: 'uppercase',
                            }}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: 12,
                            borderBottom: '1px solid #f1f5f9',
                          }}
                        >
                          <strong>{customerLabel}</strong>
                        </td>

                        <td
                          style={{
                            padding: 12,
                            borderBottom: '1px solid #f1f5f9',
                            textAlign: 'right',
                          }}
                        >
                          <Link
                            href={`/admin/projects/edit?id=${p.id}`}
                            style={{
                              fontWeight: 800,
                              textDecoration: 'none',
                              marginRight: 14,
                              color: '#2563eb',
                            }}
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => deleteProject(p.id)}
                            style={{
                              border: '1px solid #fecaca',
                              background: '#fff1f2',
                              color: '#be123c',
                              borderRadius: 10,
                              padding: '7px 11px',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: 18 }}>
                        <strong>No projects yet.</strong>

                        <div style={{ color: '#64748b' }}>
                          Click New Project to create one.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
