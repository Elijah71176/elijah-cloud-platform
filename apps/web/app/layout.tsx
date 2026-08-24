import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elijah Cloud Platform",
  description: "Cloud Developer Portfolio & Service Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0 }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            padding: "16px 24px",
            borderBottom: "1px solid #e2e8f0",
            background: "white",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Link
            href="/"
            style={{
              fontWeight: 900,
              fontSize: 18,
              textDecoration: "none",
              color: "#0f172a",
            }}
          >
            Elijah Cloud Platform
          </Link>

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link href="/" style={linkStyle}>
              Home
            </Link>

            <Link href="/about" style={linkStyle}>
              About
            </Link>

            <Link href="/projects" style={linkStyle}>
              Projects
            </Link>

            <Link href="/services" style={linkStyle}>
              Services
            </Link>

            <Link href="/request" style={linkStyle}>
              Request
            </Link>

            <Link href="/contact" style={linkStyle}>
              Contact
            </Link>

            <Link
              href="/login"
              style={{
                ...linkStyle,
                color: "#2563eb",
              }}
            >
              Login
            </Link>
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}

const linkStyle = {
  textDecoration: "none",
  fontWeight: 700,
  color: "#334155",
};