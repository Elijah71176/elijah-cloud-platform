"use client";

import { useEffect, useState } from "react";

type RequestStatus =
  | "pending"
  | "converted"
  | "temporarily_closed"
  | "closed";

type ServiceRequest = {
  id: string;
  name: string;
  email: string;
  service: string;
  telephone?: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
};

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    async function loadRequests() {
      try {
        const response = await fetch(`${API_URL}/request`);

        if (!response.ok) {
          throw new Error("Failed to load service requests");
        }

        const data = (await response.json()) as ServiceRequest[];
        setRequests(data);
      } catch {
        setError("Could not load service requests.");
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [API_URL]);

  async function updateRequestStatus(
    id: string,
    status: RequestStatus
  ): Promise<boolean> {
    const response = await fetch(`${API_URL}/request/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      alert("Could not update request status.");
      return false;
    }

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );

    return true;
  }

  async function convertToCustomer(request: ServiceRequest) {
    if (request.status !== "pending") return;

    const customerResponse = await fetch(`${API_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: request.name,
        email: request.email,
        phone: request.telephone || "",
        description: `${request.service}: ${request.message}`,
      }),
    });

    if (!customerResponse.ok) {
      alert("Could not create customer.");
      return;
    }

    const updated = await updateRequestStatus(request.id, "converted");

    if (updated) {
      alert("Request converted to customer.");
    }
  }

  async function temporarilyCloseRequest(id: string) {
    await updateRequestStatus(id, "temporarily_closed");
  }

  async function reopenRequest(id: string) {
    await updateRequestStatus(id, "pending");
  }

  async function permanentlyCloseRequest(id: string) {
    const confirmed = window.confirm(
      "Permanently close this request? It cannot be reopened from this page."
    );

    if (!confirmed) return;

    await updateRequestStatus(id, "closed");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        background: "#f8fafc",
      }}
    >
      <h1>Service Request Management</h1>

      <p>Review requests submitted from the public website.</p>
      <p>
        Convert requests to customers, pause them temporarily, reopen them, or
        close them permanently.
      </p>

      {loading && <p>Loading requests...</p>}

      {error && (
        <p style={{ color: "crimson", fontWeight: "bold" }}>{error}</p>
      )}

      {!loading && !error && requests.length === 0 && (
        <p>No service requests found.</p>
      )}

      <div
        style={{
          display: "grid",
          gap: 16,
          marginTop: 24,
        }}
      >
        {requests.map((request) => (
          <article
            key={request.id}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 18,
            }}
          >
            <h2 style={{ marginTop: 0 }}>{request.name}</h2>

            <p>
              <strong>Email:</strong> {request.email}
            </p>

            <p>
              <strong>Telephone:</strong>{" "}
              {request.telephone || "Not provided"}
            </p>

            <p>
              <strong>Service:</strong> {request.service}
            </p>

            <p>
              <strong>Message:</strong> {request.message}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {request.status.replaceAll("_", " ")}
            </p>

            <p style={{ color: "#64748b" }}>
              Submitted: {new Date(request.createdAt).toLocaleString()}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              {request.status === "pending" && (
                <>
                  <button
                    onClick={() => convertToCustomer(request)}
                    style={{
                      padding: "10px 14px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Convert to Customer
                  </button>

                  <button
                    onClick={() => temporarilyCloseRequest(request.id)}
                    style={{
                      padding: "10px 14px",
                      background: "#d97706",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Temporarily Close
                  </button>
                </>
              )}

              {request.status === "converted" && (
                <>
                  <button
                    disabled
                    style={{
                      padding: "10px 14px",
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "not-allowed",
                      fontWeight: "bold",
                    }}
                  >
                    Converted
                  </button>

                  <button
                    onClick={() => temporarilyCloseRequest(request.id)}
                    style={{
                      padding: "10px 14px",
                      background: "#d97706",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Temporarily Close
                  </button>
                </>
              )}

              {request.status === "temporarily_closed" && (
                <>
                  <button
                    onClick={() => reopenRequest(request.id)}
                    style={{
                      padding: "10px 14px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Reopen Request
                  </button>

                  <button
                    onClick={() => permanentlyCloseRequest(request.id)}
                    style={{
                      padding: "10px 14px",
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Close Permanently
                  </button>
                </>
              )}

              {request.status === "closed" && (
                <button
                  disabled
                  style={{
                    padding: "10px 14px",
                    background: "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "not-allowed",
                    fontWeight: "bold",
                  }}
                >
                  Permanently Closed
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}