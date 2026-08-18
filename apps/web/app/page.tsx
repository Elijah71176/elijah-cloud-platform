import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "56px 24px",
      }}
    >
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 40,
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ color: "#2563eb", fontWeight: 900 }}>
              Elijah Cloud Platform
            </p>

            <p
              style={{
                color: "#64748b",
                fontWeight: 700,
                margin: "6px 0 0",
              }}
            >
              Docker, AWS, and CI/CD practices.            </p>

            <h1
              style={{
                fontSize: 52,
                lineHeight: 1.05,
                margin: "10px 0 18px",
                color: "#0f172a",
              }}
            >
              Junior AWS Cloud Developer building practical full-stack cloud solutions.
            </h1>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.7,
                color: "#475569",
                maxWidth: 640,
              }}
            >
              I build cloud-based applications using Next.js, NestJS, PostgreSQL,
              Docker, AWS and CI/CD practices. Elijah Cloud Platform is my main
              full-stack project, combining a public portfolio, service requests,
              customer management and project tracking.
            </p>

            <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
              <Link
                href="/request"
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "13px 18px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontWeight: 900,
                }}
              >
                Request a Service
              </Link>

              <Link
                href="/projects"
                style={{
                  background: "white",
                  color: "#0f172a",
                  padding: "13px 18px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontWeight: 900,
                  border: "1px solid #e2e8f0",
                }}
              >
                View Projects
              </Link>
              <Link
                href="/about"
                style={{
                  background: "white",
                  color: "#2563eb",
                  padding: "13px 18px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontWeight: 900,
                  border: "1px solid #2563eb",
                }}
              >
                About Me
              </Link>

            </div>
          </div>

          <div
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 24,
              padding: 28,
              boxShadow: "0 20px 50px rgba(15,23,42,0.10)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Platform Features</h2>

            {[
              "Public portfolio project page",
              "Service request form connected to backend",
              "Admin project dashboard with CRUD",
              "CI/CD deployment using GitHub Actions",
              "Frontend hosted on AWS S3",
              "Backend running on AWS EC2 with Docker",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #f1f5f9",
                  color: "#334155",
                  fontWeight: 700,
                }}
              >
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
            marginTop: 50,
          }}
        >
          {[
            ["Frontend", "Next.js static export deployed to AWS S3"],
            ["Backend", "NestJS API running in Docker on AWS EC2"],
            ["Database", "PostgreSQL for requests, customers and projects"],
            ["DevOps", "GitHub Actions pipeline for CI/CD deployment"],
          ].map(([title, text]) => (
            <article
              key={title}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 22,
              }}
            >
              <h3 style={{ marginTop: 0 }}>{title}</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}