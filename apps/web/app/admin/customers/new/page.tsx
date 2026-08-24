"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const token = localStorage.getItem(
      "elijah-cloud-platform-token"
    );

    if (!token) {
      alert("Admin session not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.message || "Failed to create customer"
        );
      }

      alert("Customer created successfully!");

      router.push("/admin/customers");
      router.refresh();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong.");
      }
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        background: "#edf0f3",
      }}
    >
      <h1>Add Customer</h1>

      <p>
        Create a new customer for Elijah Cloud Platform.
      </p>

      <hr style={{ margin: "24px 0" }} />

      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <input
          name="name"
          type="text"
          placeholder="Customer Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          name="phone"
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="description"
          placeholder="Short description about the customer..."
          value={form.description}
          onChange={handleChange}
          style={{
            ...inputStyle,
            height: 120,
            resize: "vertical",
          }}
        />

        <button type="submit" style={buttonStyle}>
          Save Customer
        </button>
      </form>
    </main>
  );
}