"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  description?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function EditCustomerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomer() {
      if (!id) {
        setError("Customer ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem(
          "elijah-cloud-platform-token"
        );

        if (!token) {
          setError("Admin session not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/customers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          setError("Your admin session is invalid or expired.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load customer");
        }

        const customer = (await response.json()) as Customer;

        setForm({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          description: customer.description || "",
        });
      } catch {
        setError("Could not load customer.");
      } finally {
        setLoading(false);
      }
    }

    loadCustomer();
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!id) return;

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem(
        "elijah-cloud-platform-token"
      );

      if (!token) {
        setError("Admin session not found. Please log in again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/customers/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (response.status === 401 || response.status === 403) {
        setError("Your admin session is invalid or expired.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      router.push("/admin/customers");
      router.refresh();
    } catch {
      setError("Could not update customer.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 40 }}>
        Loading customer...
      </main>
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
      <h1>Edit Customer</h1>

      {error && (
        <p
          style={{
            color: "crimson",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 500,
          marginTop: 24,
        }}
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Customer Name"
          style={inputStyle}
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          style={inputStyle}
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          style={inputStyle}
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          style={{
            ...inputStyle,
            height: 120,
            resize: "vertical",
          }}
        />

        <button
          type="submit"
          disabled={saving}
          style={buttonStyle}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        <Link href="/admin/customers">
          ← Back to Customers
        </Link>
      </div>
    </main>
  );
}

export default function EditCustomerPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: 40 }}>
          Loading...
        </main>
      }
    >
      <EditCustomerForm />
    </Suspense>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 16,
  borderRadius: 8,
  border: "1px solid #cbd5e1",
};

const buttonStyle = {
  padding: "12px 18px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
};