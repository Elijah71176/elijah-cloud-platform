"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  description?: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch(`${API_URL}/customers`);

        if (!response.ok) {
          throw new Error("Failed to load customers");
        }

        const data = await response.json();
        setCustomers(data);
      } catch {
        setError("Could not load customers.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();

  }, [API_URL]);

  async function deleteCustomer(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      let message = "Could not delete customer.";

      try {
        const data = await response.json();

        if (data?.message) {
          message = data.message;
        }
      } catch {
        // keep default message
      }

      alert(message);
      return;
    }

    setCustomers((currentCustomers) =>
      currentCustomers.filter((customer) => customer.id !== id)
    );
  }
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        background: "#f8fafc",
      }}
    >
      <h1>Customer Management</h1>
      <p>Manage all customers from this page.</p>

      <Link
        href="/admin/customers/new"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "12px 18px",
          background: "#2563eb",
          color: "white",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        + Add Customer
      </Link>

      {loading && <p style={{ marginTop: 24 }}>Loading customers...</p>}

      {error && (
        <p style={{ marginTop: 24, color: "crimson", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {!loading && !error && customers.length === 0 && (
        <p style={{ marginTop: 24 }}>No customers found.</p>
      )}

      <div
        style={{
          display: "grid",
          gap: 16,
          marginTop: 24,
        }}
      >
        {customers.map((customer) => (
          <article
            key={customer.id}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 18,
            }}
          >
            <h2 style={{ marginTop: 0 }}>{customer.name}</h2>
            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phone || "Not provided"}</p>
            <p>{customer.description || "No description"}</p>

            <Link
              href={`/admin/customers/edit?id=${customer.id}`}
              style={{
                display: "inline-block",
                marginTop: 12,
                color: "#2563eb",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Edit
            </Link>
            <button

              onClick={() => deleteCustomer(customer.id)}
              style={{
                marginLeft: 14,
                padding: "8px 12px",
                background: "#fff1f2",
                color: "#be123c",
                border: "1px solid #fecaca",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Delete
            </button>
          </article>


        ))}
      </div>
    </main>
  );
}