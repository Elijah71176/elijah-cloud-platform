

import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav
        style={{
          display: "flex",
          gap: 20,
          padding: "16px 24px",
          background: "#0f172a",
        }}
      >
        <Link href="/admin/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        <Link href="/admin/customers" style={linkStyle}>
          Customers
        </Link>

        <Link href="/admin/projects" style={linkStyle}>
          Projects
        </Link>

        <Link href="/admin/requests" style={linkStyle}>
          Service Requests
        </Link>

        <Link href="/admin/settings" style={linkStyle}>
            Settings
            </Link>
      </nav>

      {children}
    </>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: 700,
};