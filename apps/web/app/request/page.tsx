"use client";

import { useState } from "react";

export default function RequestPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    telephone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e: any) => {
  e.preventDefault();
  setLoading(true);
  setStatus("");

  try {
     
     const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const res = await fetch(`${API_URL}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("✅ Request sent successfully!");
      setForm({
        name: "",
        email: "",
        service: "",
        telephone: "",
        message: "",
      });
    } else {
      setStatus("❌ Failed to send request");
    }
  } catch (error) {
    console.error(error);
    setStatus("❌ Server error");
  }

  setLoading(false);
};

  return (
    <main
      style={{
        padding: 24,
        backgroundColor: "#0f172a",
        color: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#4da3ff" }}>Request a Service</h1>

      <p>This page will allow clients to request my services.</p>

      <h2 style={{ marginTop: 20 }}>Support my growth with small projects</h2>

      <p>
        I am a junior cloud developer with an educational background, and I am
        available to work in a team and gain real-world experience.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 24, maxWidth: 500 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="service"
          placeholder="Service needed"
          value={form.service}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="telephone"
          placeholder="Telephone"
          value={form.telephone}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          style={{ ...inputStyle, height: 120 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 18px",
            backgroundColor: "#4da3ff",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Sending..." : "Send Request"}
        </button>
      </form>

      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #334155",
  backgroundColor: "#f8fafc",
  color: "#0f172a",
};