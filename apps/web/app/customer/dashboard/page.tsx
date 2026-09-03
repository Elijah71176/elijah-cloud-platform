"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProjectMessage = {
  id: string;
  projectId: string;
  senderEmail: string;
  senderRole: "ADMIN" | "CUSTOMER";
  message: string;
  createdAt: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  description?: string | null;
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

type Project = {
  id: string;
  title: string;
  description?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  status: "planned" | "active" | "on_hold" | "done";
  customerId: string;
  progress: number;
};
type ProjectUpdate = {
  id: string;
  projectId: string;
  message: string;
  createdAt: string;
};
type ServiceRequest = {
  id: string;
  name: string;
  email: string;
  service: string;
  telephone?: string;
  message: string;
  status: "pending" | "temporarily_closed" | "closed";
  converted: boolean;
  createdAt: string;
};
type Notification = {
  id: string;
  recipientEmail: string;
  recipientRole: "ADMIN" | "CUSTOMER";
  type: string;
  title: string;
  message: string;
  projectId?: string | null;
  isRead: boolean;
  createdAt: string;
};
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CustomerDashboardPage() {
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectUpdates, setProjectUpdates] = useState<
    Record<string, ProjectUpdate[]>
  >({});
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [attachments, setAttachments] = useState<
    Record<string, ProjectAttachment[]>
  >({});

  const [selectedFiles, setSelectedFiles] = useState<
    Record<string, File | null>
  >({});

  const [projectMessages, setProjectMessages] = useState<
    Record<string, ProjectMessage[]>
  >({});
  const [messageDrafts, setMessageDrafts] = useState<
    Record<string, string>
  >({});

  const [uploadingProjectId, setUploadingProjectId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomerData() {
      try {
        const token = localStorage.getItem(
          "elijah-cloud-platform-customer-token"
        );

        if (!token) {
          router.replace("/customer/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          customerResponse,
          projectsResponse,
          requestsResponse,
          notificationsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/customers/me`, {
            headers,
          }),

          fetch(`${API_URL}/projects/my`, {
            headers,
          }),

          fetch(`${API_URL}/request/my`, {
            headers,
          }),
          fetch(`${API_URL}/notifications/my`, {
            headers,
          }),
        ]);

        if (
          customerResponse.status === 401 ||
          customerResponse.status === 403 ||
          projectsResponse.status === 401 ||
          projectsResponse.status === 403 ||
          requestsResponse.status === 401 ||
          requestsResponse.status === 403 ||
          notificationsResponse.status === 401 ||
          notificationsResponse.status === 403
        ) {
          localStorage.removeItem(
            "elijah-cloud-platform-customer-token"
          );

          localStorage.removeItem(
            "elijah-cloud-platform-customer-user"
          );

          router.replace("/customer/login");
          return;
        }

        if (
          !customerResponse.ok ||
          !projectsResponse.ok ||
          !requestsResponse.ok
        ) {
          throw new Error("Failed to load customer data");
        }

        const customerData =
          (await customerResponse.json()) as Customer;

        const projectsData =
          (await projectsResponse.json()) as Project[];

        const requestsData =
          (await requestsResponse.json()) as ServiceRequest[];

        const notificationsData =
          (await notificationsResponse.json()) as Notification[];

        setCustomer(customerData);
        setProjects(projectsData);
        setServiceRequests(requestsData);
        setNotifications(notificationsData);

        const attachmentEntries = await Promise.all(
          projectsData.map(async (project) => {
            const response = await fetch(
              `${API_URL}/projects/${project.id}/attachments`,
              {
                headers,
              }
            );

            if (!response.ok) {
              return [project.id, []] as const;
            }

            const data =
              (await response.json()) as ProjectAttachment[];

            return [project.id, data] as const;
          })
        );
        const updateEntries = await Promise.all(
          projectsData.map(async (project) => {
            const response = await fetch(
              `${API_URL}/projects/${project.id}/updates`,
              {
                headers,
              }
            );

            if (!response.ok) {
              return [project.id, []] as const;
            }

            const data =
              (await response.json()) as ProjectUpdate[];

            return [project.id, data] as const;
          })
        );
        const messageEntries = await Promise.all(
          projectsData.map(async (project) => {
            const response = await fetch(
              `${API_URL}/messages/${project.id}`,
              {
                headers,
              }
            );

            if (!response.ok) {
              return [project.id, []] as const;
            }

            const data =
              (await response.json()) as ProjectMessage[];

            return [project.id, data] as const;
          })
        );
        setProjectUpdates(
          Object.fromEntries(updateEntries)
        );
        setProjectMessages(
          Object.fromEntries(messageEntries)
        );
        setAttachments(
          Object.fromEntries(attachmentEntries)
        );
      } catch {
        setError("Could not load your account.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomerData();
  }, [router]);
  async function uploadAttachment(projectId: string) {
    const file = selectedFiles[projectId];

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const token = localStorage.getItem(
      "elijah-cloud-platform-customer-token"
    );

    if (!token) {
      router.replace("/customer/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingProjectId(projectId);

    try {
      const response = await fetch(
        `${API_URL}/projects/${projectId}/attachments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Upload failed.");
        return;
      }

      setAttachments((current) => ({
        ...current,
        [projectId]: [
          data,
          ...(current[projectId] || []),
        ],
      }));

      setSelectedFiles((current) => ({
        ...current,
        [projectId]: null,
      }));

      alert("File uploaded successfully.");
    } catch {
      alert("Could not upload file.");
    } finally {
      setUploadingProjectId(null);
    }
  }


  async function deleteAttachment(
    projectId: string,
    attachmentId: string
  ) {
    const confirmed = window.confirm(
      "Delete this attachment?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem(
      "elijah-cloud-platform-customer-token"
    );

    if (!token) {
      router.replace("/customer/login");
      return;
    }

    const response = await fetch(
      `${API_URL}/projects/${projectId}/attachments/${attachmentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert("Could not delete attachment.");
      return;
    }
    setAttachments((current) => ({
      ...current,
      [projectId]:
        current[projectId]?.filter(
          (attachment) =>
            attachment.id !== attachmentId
        ) || [],
    }));

    alert("Attachment deleted.");
  }
  async function markNotificationAsRead(notificationId: string) {
    const token = localStorage.getItem(
      "elijah-cloud-platform-customer-token"
    );

    if (!token) {
      router.replace("/customer/login");
      return;
    }

    const response = await fetch(
      `${API_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert("Could not mark notification as read.");
      return;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }

  async function downloadAttachment(
    projectId: string,
    attachmentId: string,
    originalName: string
  ) {
    const token = localStorage.getItem(
      "elijah-cloud-platform-customer-token"
    );

    if (!token) {
      router.replace("/customer/login");
      return;
    }

    const response = await fetch(
      `${API_URL}/projects/${projectId}/attachments/${attachmentId}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert("Could not download file.");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = originalName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  }
  async function sendProjectMessage(projectId: string) {
    const message = messageDrafts[projectId]?.trim();

    if (!message) {
      alert("Please write a message.");
      return;
    }

    const token = localStorage.getItem(
      "elijah-cloud-platform-customer-token"
    );

    if (!token) {
      router.replace("/customer/login");
      return;
    }

    const response = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Could not send message.");
      return;
    }

    setProjectMessages((current) => ({
      ...current,
      [projectId]: [
        ...(current[projectId] || []),
        data,
      ],
    }));

    setMessageDrafts((current) => ({
      ...current,
      [projectId]: "",
    }));
  }
  function logout() {
    localStorage.removeItem(
      "elijah-cloud-platform-customer-token"
    );

    localStorage.removeItem(
      "elijah-cloud-platform-customer-user"
    );

    router.replace("/customer/login");
  }

  if (loading) {
    return (
      <main style={{ padding: 40 }}>
        Loading your account...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1>Customer Portal</h1>

            <p style={{ color: "#64748b" }}>
              View your account, projects and attachments.
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              padding: "10px 16px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Logout
          </button>
        </div>

        {error && (
          <p
            style={{
              color: "crimson",
              fontWeight: 700,
            }}
          >
            {error}
          </p>
        )}

        {!error && customer && (
          <>
            <section
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 24,
                marginTop: 24,
              }}
            >
              <h2>{customer.name}</h2>

              <p>
                <strong>Email:</strong> {customer.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {customer.phone || "Not provided"}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {customer.description || "No description"}
              </p>
            </section>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 16,
                marginTop: 24,
              }}
            >
              <div
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <p
                  style={{
                    color: "#64748b",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Total Projects
                </p>

                <h2 style={{ fontSize: 32, marginBottom: 0 }}>
                  {projects.length}
                </h2>
              </div>

              <div
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <p
                  style={{
                    color: "#64748b",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Active
                </p>

                <h2 style={{ fontSize: 32, marginBottom: 0 }}>
                  {
                    projects.filter(
                      (project) => project.status === "active"
                    ).length
                  }
                </h2>
              </div>

              <div
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <p
                  style={{
                    color: "#64748b",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Planned
                </p>

                <h2 style={{ fontSize: 32, marginBottom: 0 }}>
                  {
                    projects.filter(
                      (project) => project.status === "planned"
                    ).length
                  }
                </h2>
              </div>

              <div
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 20,
                }}
              >
                <p
                  style={{
                    color: "#64748b",
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  Completed
                </p>

                <h2 style={{ fontSize: 32, marginBottom: 0 }}>
                  {
                    projects.filter(
                      (project) => project.status === "done"
                    ).length
                  }
                </h2>
              </div>
            </div>
            {/* Notifications */}
            <section style={{ marginTop: 30 }}>
              <h2>
                Notifications{" "}
                {notifications.filter((notification) => !notification.isRead).length > 0 &&
                  `🔔 ${notifications.filter((notification) => !notification.isRead).length
                  }`}
              </h2>

              {notifications.filter(
                (notification) => !notification.isRead
              ).length === 0 ? (
                <p>No new notifications.</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: 12,
                  }}
                >
                  {notifications
                    .filter((notification) => !notification.isRead)
                    .map((notification) => (<article
                      key={notification.id}
                      style={{
                        background: notification.isRead ? "#ffffff" : "#eff6ff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <strong>{notification.title}</strong>

                      <p style={{ margin: "8px 0" }}>
                        {notification.message}
                      </p>

                      <small style={{ color: "#64748b" }}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </small>

                      {!notification.isRead && (
                        <div style={{ marginTop: 12 }}>
                          <button
                            type="button"
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                            style={{
                              padding: "8px 12px",
                              border: "none",
                              borderRadius: 8,
                              background: "#2563eb",
                              color: "#ffffff",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            Mark as read
                          </button>
                        </div>
                      )}
                    </article>
                    ))}
                </div>
              )}
            </section>

            <section style={{ marginTop: 30 }}>
              <h2>My Service Requests</h2>

              {serviceRequests.length === 0 ? (
                <p>No service requests found.</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: 16,
                  }}
                >
                  {serviceRequests.map((request) => (
                    <article
                      key={request.id}
                      style={{
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: 16,
                        padding: 20,
                      }}
                    >
                      <h3>{request.service}</h3>

                      <p>
                        <strong>Status:</strong>{" "}
                        {request.status.replaceAll("_", " ")}
                      </p>

                      <p>{request.message}</p>

                      <p>
                        <strong>Project:</strong>{" "}

                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 800,
                            background: request.converted
                              ? "#dcfce7"
                              : "#f1f5f9",
                            color: request.converted
                              ? "#166534"
                              : "#64748b",
                          }}
                        >
                          {request.converted
                            ? "✓ Converted to Project"
                            : "Not Converted Yet"}
                        </span>
                      </p>

                      <p>
                        <strong>Submitted:</strong>{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
            <section style={{ marginTop: 30 }}>
              <h2>My Projects</h2>

              {projects.length === 0 ? (
                <p>No projects found.</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: 16,
                  }}
                >
                  {projects.map((project) => {
                    const projectAttachments =
                      attachments[project.id] || [];

                    const messages =
                      projectMessages[project.id] || [];
                    return (
                      <article
                        key={project.id}
                        style={{
                          background: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: 16,
                          padding: 20,
                        }}
                      >
                        <h3>{project.title}</h3>

                        <p>
                          <strong>Status:</strong>{" "}

                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: 999,
                              fontSize: 13,
                              fontWeight: 800,
                              background:
                                project.status === "done"
                                  ? "#dcfce7"
                                  : project.status === "active"
                                    ? "#dbeafe"
                                    : project.status === "on_hold"
                                      ? "#fef3c7"
                                      : "#f1f5f9",
                              color:
                                project.status === "done"
                                  ? "#166534"
                                  : project.status === "active"
                                    ? "#1d4ed8"
                                    : project.status === "on_hold"
                                      ? "#92400e"
                                      : "#475569",
                            }}
                          >
                            {project.status === "done"
                              ? "Completed"
                              : project.status === "on_hold"
                                ? "On Hold"
                                : project.status.charAt(0).toUpperCase() +
                                project.status.slice(1)}
                          </span>
                        </p>

                        {/* Project Progress */}
                        <div
                          style={{
                            marginTop: 16,
                            marginBottom: 16,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                              fontWeight: 700,
                            }}
                          >
                            <span>Progress</span>
                            <span>{project.progress ?? 0}%</span>
                          </div>

                          <div
                            style={{
                              width: "100%",
                              height: 12,
                              background: "#e2e8f0",
                              borderRadius: 999,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${project.progress ?? 0}%`,
                                height: "100%",
                                background: "#2563eb",
                                borderRadius: 999,
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: 20,
                            paddingTop: 16,
                            borderTop: "1px solid #e2e8f0",
                          }}
                        >
                          <h3
                            style={{
                              marginBottom: 10,
                              fontSize: 16,
                            }}
                          >
                            Project Updates
                          </h3>
                          {/* Project Updates */}
                          {(projectUpdates[project.id] || []).length === 0 ? (
                            <p
                              style={{
                                margin: 0,
                                color: "#64748b",
                              }}
                            >
                              No updates yet.
                            </p>
                          ) : (
                            (projectUpdates[project.id] || []).map((update) => (
                              <div
                                key={update.id}
                                style={{
                                  marginBottom: 12,
                                  padding: 12,
                                  background: "#f8fafc",
                                  borderRadius: 8,
                                }}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                    marginBottom: 6,
                                  }}
                                >
                                  {update.message}
                                </p>

                                <small
                                  style={{
                                    color: "#64748b",
                                  }}
                                >
                                  {new Date(update.createdAt).toLocaleString()}
                                </small>
                              </div>
                            ))
                          )}
                          <div
                            style={{
                              marginTop: 20,
                              paddingTop: 16,
                              borderTop: "1px solid #e2e8f0",
                            }}
                          >
                            <h3
                              style={{
                                marginBottom: 10,
                                fontSize: 16,
                              }}
                            >
                              Messages
                            </h3>

                            {messages.length === 0 ? (
                              <p style={{ color: "#64748b" }}>
                                No messages yet.
                              </p>
                            ) : (
                              <div style={{ display: "grid", gap: 10 }}>
                                {messages.map((message) => (
                                  <div
                                    key={message.id}
                                    style={{
                                      padding: 12,
                                      borderRadius: 10,
                                      background:
                                        message.senderRole === "CUSTOMER"
                                          ? "#eff6ff"
                                          : "#f8fafc",
                                    }}
                                  >
                                    <strong>
                                      {message.senderRole === "CUSTOMER"
                                        ? "You"
                                        : "Admin"}
                                    </strong>

                                    <p style={{ margin: "6px 0" }}>
                                      {message.message}
                                    </p>

                                    <small style={{ color: "#64748b" }}>
                                      {new Date(message.createdAt).toLocaleString()}
                                    </small>
                                  </div>
                                ))}
                              </div>
                            )}

                            <textarea
                              value={messageDrafts[project.id] || ""}
                              onChange={(event) =>
                                setMessageDrafts((current) => ({
                                  ...current,
                                  [project.id]: event.target.value,
                                }))
                              }
                              placeholder="Write a message to Admin..."
                              rows={3}
                              style={{
                                width: "100%",
                                marginTop: 14,
                                padding: 12,
                                border: "1px solid #cbd5e1",
                                borderRadius: 10,
                                resize: "vertical",
                              }}
                            />

                            <button
                              type="button"
                              onClick={() => sendProjectMessage(project.id)}
                              style={{
                                marginTop: 10,
                                padding: "10px 16px",
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                            >
                              Send Message
                            </button>
                          </div>
                        </div>
                        <p>
                          {project.description ||
                            "No description"}
                        </p>

                        <p>
                          <strong>Start:</strong>{" "}
                          {project.startDate || "Not set"}
                        </p>

                        <hr
                          style={{
                            margin: "20px 0",
                            border: 0,
                            borderTop:
                              "1px solid #e2e8f0",
                          }}
                        />

                        <h4>Attachments</h4>

                        <p
                          style={{
                            color: "#64748b",
                            fontSize: 14,
                          }}
                        >
                          PDF, JPG, PNG or TXT. Maximum 5 MB
                          per file and 5 files per project.
                        </p>

                        <label
                          style={{
                            display: "block",
                            border: "2px dashed #93c5fd",
                            background: "#eff6ff",
                            borderRadius: 14,
                            padding: 24,
                            textAlign: "center",
                            cursor: "pointer",
                            marginTop: 12,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 30,
                              marginBottom: 8,
                            }}
                          >
                            📎
                          </div>

                          <div
                            style={{
                              fontWeight: 800,
                              color: "#1d4ed8",
                              marginBottom: 6,
                            }}
                          >
                            Click to choose a file
                          </div>

                          <div
                            style={{
                              color: "#64748b",
                              fontSize: 13,
                            }}
                          >
                            PDF, JPG, PNG or TXT • Max 5 MB
                          </div>

                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.txt"
                            style={{ display: "none" }}
                            onChange={(event) => {
                              const file =
                                event.target.files?.[0] ||
                                null;

                              setSelectedFiles(
                                (current) => ({
                                  ...current,
                                  [project.id]: file,
                                })
                              );
                            }}
                          />
                        </label>

                        {selectedFiles[project.id] && (
                          <div
                            style={{
                              marginTop: 12,
                              padding: "10px 12px",
                              background: "#f8fafc",
                              border:
                                "1px solid #e2e8f0",
                              borderRadius: 10,
                              fontSize: 14,
                            }}
                          >
                            <strong>Selected:</strong>{" "}
                            {selectedFiles[project.id]?.name}
                          </div>
                        )}

                        <button
                          onClick={() =>
                            uploadAttachment(project.id)
                          }
                          disabled={
                            uploadingProjectId === project.id
                          }
                          style={{
                            marginTop: 12,
                            padding: "10px 16px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: 10,
                            cursor:
                              uploadingProjectId === project.id
                                ? "not-allowed"
                                : "pointer",
                            fontWeight: 800,
                            opacity:
                              uploadingProjectId === project.id
                                ? 0.7
                                : 1,
                          }}
                        >
                          {uploadingProjectId === project.id
                            ? "Uploading..."
                            : "Upload File"}
                        </button>

                        <div style={{ marginTop: 18 }}>
                          <h4>Attachments</h4>

                          {projectAttachments.filter(
                            (attachment) => attachment.category === "attachment"
                          ).length === 0 ? (
                            <p>No attachments yet.</p>
                          ) : (
                            projectAttachments
                              .filter(
                                (attachment) => attachment.category === "attachment"
                              )
                              .map((attachment) => (
                                <div
                                  key={attachment.id}
                                  style={{
                                    padding: "10px 0",
                                    borderBottom: "1px solid #f1f5f9",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      gap: 12,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <div>
                                      <strong>
                                        📄 {attachment.originalName}
                                      </strong>

                                      <div
                                        style={{
                                          color: "#64748b",
                                          fontSize: 13,
                                          marginTop: 4,
                                        }}
                                      >
                                        {(attachment.size / 1024).toFixed(1)} KB
                                      </div>
                                    </div>

                                    <button
                                      onClick={() =>
                                        deleteAttachment(
                                          project.id,
                                          attachment.id
                                        )
                                      }
                                      style={{
                                        padding: "6px 10px",
                                        background: "#fff1f2",
                                        color: "#be123c",
                                        border: "1px solid #fecaca",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        fontSize: 12,
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))
                          )}

                          <h4 style={{ marginTop: 24 }}>
                            Deliverables
                          </h4>

                          {projectAttachments.filter(
                            (attachment) => attachment.category === "deliverable"
                          ).length === 0 ? (
                            <p>No deliverables yet.</p>
                          ) : (
                            projectAttachments
                              .filter(
                                (attachment) => attachment.category === "deliverable"
                              )
                              .map((attachment) => (
                                <div
                                  key={attachment.id}
                                  style={{
                                    padding: "10px 0",
                                    borderBottom: "1px solid #f1f5f9",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      gap: 12,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <div>
                                      <strong>
                                        📦 {attachment.originalName}
                                      </strong>

                                      <div
                                        style={{
                                          color: "#64748b",
                                          fontSize: 13,
                                          marginTop: 4,
                                        }}
                                      >
                                        {(attachment.size / 1024).toFixed(1)} KB
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        downloadAttachment(
                                          project.id,
                                          attachment.id,
                                          attachment.originalName
                                        )
                                      }
                                      style={{
                                        padding: "6px 10px",
                                        background: "#eff6ff",
                                        color: "#1d4ed8",
                                        border: "1px solid #bfdbfe",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        fontWeight: 700,
                                        fontSize: 12,
                                      }}
                                    >
                                      Download
                                    </button>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}