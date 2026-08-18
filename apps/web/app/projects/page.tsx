const projects = [
  {
    title: "Elijah Cloud Platform",
    status: "Deployed",
    description:
      "A cloud-based client service platform with request form, backend API, CI/CD and AWS deployment.",
    stack: ["Next.js", "NestJS", "PostgreSQL", "Docker", "AWS EC2", "AWS S3"],
    link: "/request",
    images: [
      "/images/projects/admin-dashboard.png",
      "/images/projects/projects.png",
      "/images/projects/request-workflow.png",
    ],


  },
  {
    title: "Backend API",
    status: "Completed",
    description:
      "NestJS backend running on EC2 with REST API endpoints for requests, customers and projects.",
    stack: ["NestJS", "Docker", "PostgreSQL", "EC2"],
    link: "http://localhost:3001/health",
  },
  {
    title: "Frontend Deployment",
    status: "Completed",
    description:
      "Next.js frontend exported as static files and deployed to AWS S3 using GitHub Actions.",
    stack: ["Next.js", "GitHub Actions", "AWS S3"],
    link: "#",
  },
];

export default function ProjectsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 24px" }}>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "#2563eb", fontWeight: 800 }}>Portfolio</p>
        <h1 style={{ fontSize: 40, margin: "8px 0" }}>Projects</h1>
        <p style={{ color: "#64748b", maxWidth: 720 }}>
          A public overview of my cloud development and DevOps projects.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
          marginTop: 30,
        }}>
          {projects.map((project, index) => (
            <article key={project.title} style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 18,
              padding: 22,
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",

              // Make Elijah Cloud Platform the featured project
              gridColumn: index === 0 ? "1 / -1" : "auto",
            }}
            >
              <span style={{
                display: "inline-block",
                background: "#dcfce7",
                color: "#166534",
                padding: "5px 11px",
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 12,
                marginBottom: 14,
              }}>
                {project.status}
              </span>

              <h2 style={{ margin: "0 0 10px", fontSize: 24 }}>{project.title}</h2>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>{project.description}</p>

              {project.images && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 10,
                    marginTop: 16,
                  }}
                >
                  {project.images.map((image) => (
                    <a
                      key={image}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        textDecoration: "none",
                      }}
                    >
                      <img
                        src={image}
                        alt={`${project.title} screenshot`}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                          borderRadius: 12,
                          border: "1px solid #e2e8f0",
                          background: "#f8fafc",
                          cursor: "pointer",
                        }}
                      />
                    </a>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                {project.stack.map((tech) => (
                  <span key={tech} style={{
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 700,
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              <a href={project.link} style={{
                display: "inline-block",
                marginTop: 18,
                color: "#2563eb",
                fontWeight: 800,
                textDecoration: "none",
              }}>
                View project →
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}