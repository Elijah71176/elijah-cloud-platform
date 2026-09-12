"use client";

import Link from "next/link";
import { useState } from "react";
import SessionLink from "./SessionLink";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        Elijah Cloud Platform
      </Link>

      <button
        className="navbar-toggle"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link href="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>

        <Link href="/projects" onClick={() => setMenuOpen(false)}>
          Projects
        </Link>

        <Link href="/services" onClick={() => setMenuOpen(false)}>
          Services
        </Link>

        <Link href="/request" onClick={() => setMenuOpen(false)}>
          Request
        </Link>

        <Link href="/contact" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>

        <SessionLink />
      </div>
    </nav>
  );
}