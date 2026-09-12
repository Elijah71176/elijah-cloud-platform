import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "72px 24px",
      }}
    >
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
              Cloud Development • Full-Stack Development • DevOps           </p>

            <h1 className="hero-title">
              Cloud & Full-Stack Developer Building Practical Solutions for the Real World.
            </h1>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.7,
                color: "#475569",
                maxWidth: 640,
              }}
            >
              I build practical cloud and software solutions across backend development,
              web applications, REST APIs, databases, cloud infrastructure and DevOps.
              My experience includes Java and Spring Boot, modern JavaScript technologies,
              AWS services, Docker, CI/CD and database development, with a focus on building
              secure, scalable and reliable applications.
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
                Work With Me
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

            {
              [
                "Public portfolio and professional profile",
                "Customer service request system",
                "Secure Admin and Customer portals",
                "Project progress, updates and milestones",
                "Customer and Admin messaging",
                "Project documents and deliverables",
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
          {
            [
              ["Cloud Development", "Building and deploying applications using AWS cloud services and modern cloud practices"],
              ["Software Development", "Backend, frontend and REST API development using modern technologies and frameworks"],
              ["Data & Databases", "Working with relational databases, application data and secure data management"],
              ["DevOps & CI/CD", "Docker, Git, GitHub Actions and automated build and deployment workflows"],
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