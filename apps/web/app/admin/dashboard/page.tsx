"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
  customers: number;
  projects: number;
  pendingRequests: number;
  convertedRequests: number;

  recentRequests: {
    id: string;
    name: string;
    email: string;
    service: string;
    status: string;
    converted: boolean;
    createdAt: string;
  }[];

  recentCustomers: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    description?: string | null;
  }[];
};

const cardStyle = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    projects: 0,
    pendingRequests: 0,
    convertedRequests: 0,
    recentRequests: [],
    recentCustomers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch(`${API_URL}/dashboard/stats`);

        if (!response.ok) {
          throw new Error("Failed to load dashboard statistics");
        }

        const data = (await response.json()) as DashboardStats;
        setStats(data);
      } catch {
        setError("Could not load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [API_URL]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        background: "#eaf0f5",
      }}
    >
      <h1>Admin Dashboard</h1>

      <p>Welcome to Elijah Cloud Platform Admin Panel.</p>
      <p> Only authorized personnel can access this page.</p>

      <hr style={{ margin: "24px 0" }} />

      {loading && <p>Loading dashboard...</p>}

      {error && (
        <p style={{ color: "crimson", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 20,
              marginTop: 30,
            }}
          >
            <div style={cardStyle}>
              <p style={{ color: "#64748b", fontWeight: "bold" }}>
                Total Customers
              </p>
              <h2 style={{ fontSize: 36 }}>{stats.customers}</h2>
            </div>

            <div style={cardStyle}>
              <p style={{ color: "#64748b", fontWeight: "bold" }}>
                Total Projects
              </p>
              <h2 style={{ fontSize: 36 }}>{stats.projects}</h2>
            </div>

            <div style={cardStyle}>
              <p style={{ color: "#64748b", fontWeight: "bold" }}>
                Pending Requests
              </p>
              <h2 style={{ fontSize: 36 }}>{stats.pendingRequests}</h2>
            </div>

            <div style={cardStyle}>
              <p style={{ color: "#64748b", fontWeight: "bold" }}>
                Converted Requests
              </p>
              <h2 style={{ fontSize: 36 }}>{stats.convertedRequests}</h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              marginTop: 30,
            }}
          >
            <Link
              href="/admin/customers"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={cardStyle}>
                <h2>Customers</h2>
                <p>Manage customer information.</p>
              </div>
            </Link>

            <Link
              href="/admin/projects"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={cardStyle}>
                <h2>Projects</h2>
                <p>Create and manage projects.</p>
              </div>
            </Link>

            <Link
              href="/admin/requests"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={cardStyle}>
                <h2>Service Requests</h2>
                <p>Review incoming client requests.</p>
              </div>
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 20,
              marginTop: 30,
            }}
          >
            <div style={cardStyle}>
              <h2>Recent Requests</h2>

              {stats.recentRequests.length === 0 ? (
                <p>No recent requests.</p>
              ) : (
                stats.recentRequests.map((request) => (
                  <div
                    key={request.id}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <strong>{request.name}</strong>
                    <p style={{ margin: "4px 0" }}>
                      Service: {request.service}
                    </p>
                    <p style={{ margin: "4px 0", color: "#64748b" }}>
                      Status: {request.status.replaceAll("_", " ")}
                    </p>
                  </div>
                ))
              )}

              <Link
                href="/admin/requests"
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  textDecoration: "none",
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
              >
                View all requests →
              </Link>
            </div>

            <div style={cardStyle}>
              <h2>Recent Customers</h2>

              {stats.recentCustomers.length === 0 ? (
                <p>No recent customers.</p>
              ) : (
                stats.recentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <strong>{customer.name}</strong>

                    <p style={{ margin: "4px 0" }}>
                      {customer.email}
                    </p>

                    <p style={{ margin: "4px 0", color: "#64748b" }}>
                      {customer.phone || "No phone provided"}
                    </p>
                  </div>
                ))
              )}

              <Link
                href="/admin/customers"
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  textDecoration: "none",
                  fontWeight: "bold",
                  color: "#2563eb",
                }}
              >
                View all customers →
              </Link>
            </div>
          </div>
        </>


      )}
    </main>
  );
}