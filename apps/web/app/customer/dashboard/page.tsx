"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  description?: string | null;
};

type Project = {
  id: string;
  title: string;
  description?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  status: "planned" | "active" | "on_hold" | "done";
  customerId: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CustomerDashboardPage() {
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
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

        const [customerResponse, projectsResponse] =
          await Promise.all([
            fetch(`${API_URL}/customers/me`, {
              headers,
            }),
            fetch(`${API_URL}/projects/my`, {
              headers,
            }),
          ]);

        if (
          customerResponse.status === 401 ||
          customerResponse.status === 403 ||
          projectsResponse.status === 401 ||
          projectsResponse.status === 403
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

        if (!customerResponse.ok || !projectsResponse.ok) {
          throw new Error("Failed to load customer data");
        }

        const customerData =
          (await customerResponse.json()) as Customer;

        const projectsData =
          (await projectsResponse.json()) as Project[];

        setCustomer(customerData);
        setProjects(projectsData);
      } catch {
        setError("Could not load your account.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomerData();
  }, [router]);

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
              View your account and projects.
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
                  {projects.map((project) => (
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
                        {project.status.replaceAll("_", " ")}
                      </p>

                      <p>
                        {project.description ||
                          "No description"}
                      </p>

                      <p>
                        <strong>Start:</strong>{" "}
                        {project.startDate || "Not set"}
                      </p>

                      <p>
                        <strong>Due:</strong>{" "}
                        {project.dueDate || "Not set"}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}