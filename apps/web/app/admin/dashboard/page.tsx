import Link from "next/link";

const cardStyle = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

export default function AdminDashboard() {
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

      <hr style={{ margin: "24px 0" }} />

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
  href="/request"
  style={{ textDecoration: "none", color: "inherit" }}
>
  <div style={cardStyle}>
    <h2>Service Requests</h2>
    <p>Review incoming client requests.</p>
  </div>
</Link>
      </div>

    </main>
  );
}