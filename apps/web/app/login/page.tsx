"use client";

import Link from "next/link";

export default function LoginChoicePage() {
    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
                padding: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <section
                style={{
                    width: "100%",
                    maxWidth: 520,
                    background: "white",
                    padding: 32,
                    borderRadius: 18,
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                }}
            >
                <h1>Sign In</h1>
                <p>Make sure you login according to your user type.</p>

                <p
                    style={{
                        color: "#64748b",
                        marginBottom: 28,
                    }}
                >
                    Choose how you want to access Elijah Cloud Platform.
                </p>

                <div
                    style={{
                        display: "grid",
                        gap: 16,
                    }}
                >
                    <Link
                        href="/customer/login"
                        style={{
                            display: "block",
                            padding: 16,
                            background: "#2563eb",
                            color: "white",
                            borderRadius: 10,
                            textDecoration: "none",
                            fontWeight: 800,
                        }}
                    >
                        Customer Login
                    </Link>

                    <Link
                        href="/admin/login"
                        style={{
                            display: "block",
                            padding: 16,
                            background: "#0f172a",
                            color: "white",
                            borderRadius: 10,
                            textDecoration: "none",
                            fontWeight: 800,
                        }}
                    >
                        Admin Login
                    </Link>
                </div>
            </section>
        </main>
    );
}