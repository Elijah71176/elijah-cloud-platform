"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname.startsWith("/admin/login");


  useEffect(() => {
    if (isLoginPage) {
      setAuthorized(true);
      setCheckingAuth(false);
      return;
    }

    const isAdmin = localStorage.getItem(
      "elijah-cloud-platform-admin"
    );

    if (isAdmin === "true") {
      setAuthorized(true);
      setCheckingAuth(false);
      return;
    }

    setAuthorized(false);
    setCheckingAuth(false);

    router.replace("/admin/login");
  }, [isLoginPage, pathname, router]);

  function handleLogout() {
    localStorage.removeItem(
      "elijah-cloud-platform-admin"
    );

    setAuthorized(false);

    router.replace("/admin/login");
  }

  // Login page must always be visible
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 40,
          background: "#f8fafc",
        }}
      >
        Checking admin access...
      </main>
    );
  }

  if (!authorized) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: 40,
          background: "#f8fafc",
        }}
      >
        Redirecting to login...
      </main>
    );
  }
  function navLinkStyle(path: string) {
    const active = pathname.startsWith(path);

    return {
      color: "white",
      textDecoration: "none",
      fontWeight: 700,
      padding: "8px 12px",
      borderRadius: 8,
      background: active ? "#2563eb" : "transparent",
    };
  }

  return (
    <>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "16px 24px",
          background: "#0f172a",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/admin/dashboard"
          style={navLinkStyle("/admin/dashboard")}
        >
          Dashboard
        </Link>

        <Link
          href="/admin/customers"
          style={navLinkStyle("/admin/customers")}
        >
          Customers
        </Link>

        <Link href="/admin/projects" style={navLinkStyle("/admin/projects")}>
          Projects
        </Link>

        <Link
          href="/admin/requests"
          style={navLinkStyle("/admin/requests")}
        >
          Service Requests
        </Link>

        <button
          onClick={handleLogout}
          style={{
            marginLeft: "auto",
            padding: "8px 14px",
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
      </nav>

      {children}
    </>
  );
}

