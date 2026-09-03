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
type ProjectMessage = {
  id: string;
  projectId: string;
  senderEmail: string;
  senderRole: "ADMIN" | "CUSTOMER";
  message: string;
  createdAt: string;
};
type ProjectAttachment = {
  id: string;
  projectId: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  category: 'attachment' | 'deliverable';
  uploadedAt: string;
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
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [messageDraft, setMessageDraft] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deliverables, setDeliverables] = useState<ProjectAttachment[]>([]);
  const [deliverableFile, setDeliverableFile] = useState<File | null>(null);
  const [uploadingDeliverable, setUploadingDeliverable] = useState(false);

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
      const messagesResponse = await fetch(`${API_URL}/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (messagesResponse.ok) {
        const messagesData =
          (await messagesResponse.json()) as ProjectMessage[];

        setMessages(messagesData);
      }
      const attachmentsResponse = await fetch(
        `${API_URL}/projects/${id}/attachments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (attachmentsResponse.ok) {
        const attachmentsData =
          (await attachmentsResponse.json()) as ProjectAttachment[];

        setDeliverables(
          attachmentsData.filter(
            (attachment) => attachment.category === 'deliverable'
          )
        );
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

  async function handleSendMessage() {
    if (!id) {
      alert('Project ID is missing');
      return;
    }

    if (!messageDraft.trim()) {
      alert('Please write a message');
      return;
    }

    const token = localStorage.getItem(
      'elijah-cloud-platform-token'
    );

    try {
      setSendingMessage(true);

      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: id,
          message: messageDraft.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Could not send message');
        return;
      }

      setMessages((current) => [
        ...current,
        data,
      ]);

      setMessageDraft('');
    } finally {
      setSendingMessage(false);
    }
  }
  async function handleUploadDeliverable() {
    if (!id) {
      alert('Project ID is missing');
      return;
    }

    if (!deliverableFile) {
      alert('Please select a file');
      return;
    }

    const token = localStorage.getItem(
      'elijah-cloud-platform-token'
    );

    const formData = new FormData();
    formData.append('file', deliverableFile);

    try {
      setUploadingDeliverable(true);

      const res = await fetch(
        `${API_URL}/projects/${id}/deliverables`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Could not upload deliverable');
        return;
      }

      setDeliverables((current) => [
        ...current,
        data,
      ]);

      setDeliverableFile(null);

      alert('Deliverable uploaded successfully');
    } finally {
      setUploadingDeliverable(false);
    }
  }
  async function handleDownloadDeliverable(
    attachmentId: string,
    originalName: string
  ) {
    if (!id) {
      return;
    }

    const token = localStorage.getItem(
      'elijah-cloud-platform-token'
    );

    const response = await fetch(
      `${API_URL}/projects/${id}/attachments/${attachmentId}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert('Could not download deliverable');
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = originalName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  }
  async function handleDeleteDeliverable(
    attachmentId: string
  ) {
    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      'Delete this deliverable?'
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem(
      'elijah-cloud-platform-token'
    );

    const response = await fetch(
      `${API_URL}/projects/${id}/attachments/${attachmentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert('Could not delete deliverable');
      return;
    }

    setDeliverables((current) =>
      current.filter(
        (deliverable) =>
          deliverable.id !== attachmentId
      )
    );

    alert('Deliverable deleted successfully');
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
          maxWidth: 1000,
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

        {/* Project Messages */}
        <div
          style={{
            marginTop: 30,
            paddingTop: 24,
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <h2>Messages</h2>

          <p style={{ color: '#64748b' }}>
            Message the customer about this project.
          </p>

          {messages.length === 0 ? (
            <p style={{ color: '#64748b' }}>
              No messages yet.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: 10,
                marginBottom: 16,
              }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background:
                      message.senderRole === 'ADMIN'
                        ? '#eff6ff'
                        : '#f8fafc',
                  }}
                >
                  <strong>
                    {message.senderRole === 'ADMIN'
                      ? 'You'
                      : 'Customer'}
                  </strong>

                  <p style={{ margin: '6px 0' }}>
                    {message.message}
                  </p>

                  <small style={{ color: '#64748b' }}>
                    {new Date(message.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={messageDraft}
            onChange={(e) => setMessageDraft(e.target.value)}
            placeholder="Write a message to customer..."
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
              onClick={handleSendMessage}
              disabled={sendingMessage}
              style={{
                marginTop: 12,
                padding: '10px 16px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                cursor: sendingMessage ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              {sendingMessage ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
        {/* Deliverables */}
        <div
          style={{
            marginTop: 30,
            paddingTop: 24,
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <h2>Deliverables</h2>

          <p style={{ color: '#64748b' }}>
            Upload finished documents or files for the customer.
          </p>

          {deliverables.length === 0 ? (
            <p style={{ color: '#64748b' }}>
              No deliverables uploaded yet.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: 10,
                marginBottom: 16,
              }}
            >
              {deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  style={{
                    padding: 12,
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    background: '#f8fafc',
                  }}
                >
                  <strong>
                    📦 {deliverable.originalName}
                  </strong>

                  <div
                    style={{
                      color: '#64748b',
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    {(deliverable.size / 1024).toFixed(1)} KB
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteDeliverable(deliverable.id)
                    }
                    style={{
                      marginTop: 10,
                      marginLeft: 8,
                      padding: '8px 12px',
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadDeliverable(
                        deliverable.id,
                        deliverable.originalName
                      )
                    }
                    style={{
                      marginTop: 10,
                      padding: '8px 12px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            onChange={(e) =>
              setDeliverableFile(
                e.target.files?.[0] ?? null
              )
            }
          />


          <div>
            <button
              type="button"
              onClick={handleUploadDeliverable}
              disabled={
                uploadingDeliverable || !deliverableFile
              }
              style={{
                marginTop: 12,
                padding: '10px 16px',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                cursor:
                  uploadingDeliverable || !deliverableFile
                    ? 'not-allowed'
                    : 'pointer',
                fontWeight: 600,
              }}
            >
              {uploadingDeliverable
                ? 'Uploading...'
                : 'Upload Deliverable'}
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