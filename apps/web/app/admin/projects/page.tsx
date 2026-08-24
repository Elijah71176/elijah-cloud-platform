'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  status: 'planned' | 'active' | 'on_hold' | 'done';
  customerId: string;
  description?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
};

type Customer = {
  id: string;
  name: string;
  email: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

  if (status === 'on_hold') {
    return {
      background: '#f3e8ff',
      color: '#7e22ce',
      border: '1px solid #e9d5ff',
    };
  }

  return {
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
  };
}

function getDeadlineStatus(project: Project) {
  if (!project.dueDate || project.status === 'done') {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${project.dueDate}T00:00:00`);

  const differenceInDays = Math.ceil(
    (dueDate.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24),
  );

  if (differenceInDays < 0) {
    return 'overdue';
  }

  if (differenceInDays <= 7) {
    return 'due_soon';
  }

  return null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [statusFilter, setStatusFilter] =
    useState<'all' | Project['status']>('all');

  useEffect(() => {
    async function load() {
      setError(null);
      setLoading(true);

      try {
        const token = localStorage.getItem(
          'elijah-cloud-platform-token',
        );

        if (!token) {
          throw new Error(
            'Admin session not found. Please log in again.',
          );
        }

        const authHeaders = {
          Authorization: `Bearer ${token}`,
        };

        const [pRes, cRes] = await Promise.all([
          fetch(`${API_URL}/projects`, {
            headers: authHeaders,
          }),
          fetch(`${API_URL}/customers`, {
            headers: authHeaders,
          }),
        ]);

        if (!pRes.ok) {
          throw new Error(await pRes.text());
        }

        if (!cRes.ok) {
          throw new Error(await cRes.text());
        }

        setProjects((await pRes.json()) as Project[]);
        setCustomers((await cRes.json()) as Customer[]);
      } catch (e: any) {
        setError(e?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const customerMap = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers],
  );

  const stats = {
    total: projects.length,

    planned: projects.filter(
      (p) => p.status === 'planned',
    ).length,

    active: projects.filter(
      (p) => p.status === 'active',
    ).length,

    onHold: projects.filter(
      (p) => p.status === 'on_hold',
    ).length,

    overdue: projects.filter(
      (p) => getDeadlineStatus(p) === 'overdue',
    ).length,

    dueSoon: projects.filter(
      (p) => getDeadlineStatus(p) === 'due_soon',
    ).length,

    done: projects.filter(
      (p) => p.status === 'done',
    ).length,
  };

  const filteredProjects = projects.filter((project) => {
    const customer = customerMap.get(project.customerId);

    const searchText = search.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(searchText) ||
      project.description?.toLowerCase().includes(searchText) ||
      customer?.name.toLowerCase().includes(searchText) ||
      customer?.email.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === 'all' ||
      project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function deleteProject(id: string) {
    const ok = confirm('Delete this project?');

    if (!ok) return;

    const token = localStorage.getItem(
      'elijah-cloud-platform-token',
    );

    if (!token) {
      alert('Admin session not found. Please log in again.');
      return;
    }

    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok && res.status !== 204) {
      alert('Delete failed');
      return;
    }

    setProjects((prev) =>
      prev.filter((p) => p.id !== id),
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
      <section
        style={{
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
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
            <p
              style={{
                margin: 0,
                color: '#2563eb',
                fontWeight: 800,
              }}
            >
              Elijah Cloud Platform
            </p>

            <h1
              style={{
                margin: '6px 0',
                fontSize: 38,
              }}
            >
              Project Dashboard
            </h1>

            <p
              style={{
                margin: 0,
                color: '#64748b',
              }}
            >
              View, manage and track customer projects.
            </p>
          </div>

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
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            ['Total Projects', stats.total],
            ['Planned', stats.planned],
            ['Active', stats.active],
            ['On Hold', stats.onHold],
            ['Overdue', stats.overdue],
            ['Due Soon', stats.dueSoon],
            ['Done', stats.done],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: 18,
                boxShadow:
                  '0 10px 25px rgba(15,23,42,0.06)',
              }}
            >
              <div
                style={{
                  color: '#64748b',
                  fontWeight: 700,
                }}
              >
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
            boxShadow:
              '0 10px 30px rgba(15,23,42,0.08)',
          }}
        >
          {loading && <div>Loading projects…</div>}

          {!loading && error && (
            <div
              style={{
                color: 'crimson',
                fontWeight: 800,
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && (
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 20,
                flexWrap: 'wrap',
              }}
            >
              <input
                type="text"
                placeholder="Search project or customer..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                style={{
                  flex: 1,
                  minWidth: 240,
                  padding: '11px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  fontSize: 14,
                }}
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as
                    | 'all'
                    | Project['status'],
                  )
                }
                style={{
                  padding: '11px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  background: 'white',
                  fontWeight: 700,
                }}
              >
                <option value="all">
                  All Statuses
                </option>
                <option value="planned">
                  Planned
                </option>
                <option value="active">
                  Active
                </option>
                <option value="on_hold">
                  On Hold
                </option>
                <option value="done">
                  Done
                </option>
              </select>
            </div>
          )}

          {!loading && !error && (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  minWidth: 1000,
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr>
                    {[
                      'Title',
                      'Description',
                      'Status',
                      'Start Date',
                      'Due Date',
                      'Customer',
                      'Actions',
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          textAlign:
                            heading === 'Actions'
                              ? 'right'
                              : 'left',
                          padding: 12,
                          borderBottom:
                            '1px solid #e2e8f0',
                          fontSize: 13,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: 0.6,
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map((project) => {
                    const customer = customerMap.get(
                      project.customerId,
                    );

                    const customerLabel = customer
                      ? `${customer.name} (${customer.email})`
                      : project.customerId;

                    const deadlineStatus =
                      getDeadlineStatus(project);

                    return (
                      <tr key={project.id}>
                        <td
                          style={{
                            padding: 12,
                            borderBottom:
                              '1px solid #f1f5f9',
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 900,
                            }}
                          >
                            {project.title}
                          </div>

                          <div
                            style={{
                              color: '#64748b',
                              fontSize: 13,
                            }}
                          >
                            {project.id}
                          </div>
                        </td>

                        <td
                          style={{
                            padding: 12,
                            borderBottom:
                              '1px solid #f1f5f9',
                            maxWidth: 260,
                          }}
                        >
                          {project.description ||
                            'No description'}
                        </td>

                        <td
                          style={{
                            padding: 12,
                            borderBottom:
                              '1px solid #f1f5f9',
                          }}
                        >
                          <span
                            style={{
                              ...statusStyle(
                                project.status,
                              ),
                              display: 'inline-flex',
                              padding: '5px 11px',
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 900,
                              textTransform: 'uppercase',
                            }}
                          >
                            {project.status.replaceAll(
                              '_',
                              ' ',
                            )}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: 12,
                            borderBottom:
                              '1px solid #f1f5f9',
                          }}
                        >
                          {project.startDate ||
                            'Not set'}
                        </td>

                        <td
                          style={{
                            padding: 12,
                            borderBottom:
                              '1px solid #f1f5f9',
                          }}
                        >
                          <div>
                            <div>
                              {project.dueDate ||
                                'Not set'}
                            </div>

                            {deadlineStatus ===
                              'overdue' && (
                                <div
                                  style={{
                                    color: '#b91c1c',
                                    fontWeight: 900,
                                  }}
                                >
                                  OVERDUE
                                </div>
                              )}

                            {deadlineStatus ===
                              'due_soon' && (
                                <div
                                  style={{
                                    color: '#92400e',
                                    fontWeight: 900,
                                  }}
                                >
                                  DUE SOON
                                </div>
                              )}
                          </div>
                        </td>

                        <td
                          style={{
                            padding: 12,
                            borderBottom:
                              '1px solid #f1f5f9',
                          }}
                        >
                          <strong>
                            {customerLabel}
                          </strong>
                        </td>

                        <td
                          style={{
                            padding: 12,
                            borderBottom:
                              '1px solid #f1f5f9',
                            textAlign: 'right',
                          }}
                        >
                          <Link
                            href={`/admin/projects/edit?id=${project.id}`}
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
                            onClick={() =>
                              deleteProject(project.id)
                            }
                            style={{
                              border:
                                '1px solid #fecaca',
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

                  {filteredProjects.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: 18,
                        }}
                      >
                        <strong>
                          No matching projects found.
                        </strong>

                        <div
                          style={{
                            color: '#64748b',
                            marginTop: 4,
                          }}
                        >
                          Try changing your search or
                          status filter.
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