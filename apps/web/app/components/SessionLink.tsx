"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SessionLink() {
  const pathname = usePathname();

  const [href, setHref] = useState("/login");
  const [label, setLabel] = useState("Login");

  useEffect(() => {
    const customerToken = localStorage.getItem(
      "elijah-cloud-platform-customer-token"
    );

    const adminToken = localStorage.getItem(
      "elijah-cloud-platform-token"
    );

    if (customerToken) {
      setHref("/customer/dashboard");
      setLabel("Customer Portal");
      return;
    }

    if (adminToken) {
      setHref("/admin/dashboard");
      setLabel("Admin Dashboard");
      return;
    }

    setHref("/login");
    setLabel("Login");
  }, [pathname]);

  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        fontWeight: 700,
        color: "#2563eb",
      }}
    >
      {label}
    </Link>
  );
}