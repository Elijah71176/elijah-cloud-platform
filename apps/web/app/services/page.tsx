export default function ServicesPage() {
  const services = [
    {
      title: "Backend API Development",
      desc: "Build REST APIs using Spring Boot, NestJS and Node.js with database integration and clean backend architecture.",
    },
    {
      title: "Full-stack Web Applications",
      desc: "Develop complete web applications using Next.js, React, backend APIs and PostgreSQL.",
    },
    {
      title: "Cloud Deployment & AWS Solutions",
      desc: "Deploy and manage applications using AWS services such as EC2, S3, Elastic Beanstalk, IAM, CloudWatch and DynamoDB, with a focus on secure and production-ready setup.",
    },
    {
      title: "CI/CD & Deployment Automation",
      desc: "Build automated CI/CD workflows using GitHub Actions for testing, building and deploying applications to AWS and modern hosting platforms.",
    },
    {
      title: "Docker & DevOps",
      desc: "Containerize applications, manage development environments, and support reliable deployment workflows.",
    },
    {
      title: "Portfolio & Business Websites",
      desc: "Create modern websites for individuals, small businesses and professional service providers.",
    },
    {
      title: "Technical Support & Cloud Assistance",
      desc: "Provide technical troubleshooting, application support, deployment assistance and practical support for cloud-based systems and development environments.",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "56px 24px",
      }}
    >
      <section style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ color: "#2563eb", fontWeight: 900 }}>Services</p>

        <h1 style={{ fontSize: 44, margin: "10px 0", color: "#0f172a" }}>
          What I Offer
        </h1>

        <p style={{ fontSize: 18, color: "#475569", lineHeight: 1.7 }}>
          I provide practical cloud development, backend, full-stack and DevOps services for individuals, small businesses and growing digital projects.        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginTop: 30,
          }}
        >
          {services.map((s) => (
            <div
              key={s.title}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{s.title}</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}