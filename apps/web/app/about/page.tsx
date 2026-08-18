export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fbfcf8",
        padding: "56px 24px",
      }}
    >
      <section style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div
          style={{
            minHeight: 300,
            borderRadius: 24,
            padding: "48px 32px",
            backgroundImage:
              "linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url('/images/cloud-background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <p
            style={{
              color: "#93c5fd",
              fontWeight: 900,
              margin: 0,
            }}
          >
            About
          </p>

          <h1
            style={{
              fontSize: 44,
              margin: "10px 0",
              color: "white",
            }}
          >
            About Me
          </h1>

          <p
            style={{
              color: "#e2e8f0",
              fontSize: 18,
              margin: 0,
              fontWeight: 600,
            }}
          >
            Cloud Developer • Full-Stack • DevOps
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            flexWrap: "wrap",
            margin: "24px 0 32px",
          }}
        >
          <img
            src="/images/profile.jpg"
            alt="Professional profile"
            style={{
              width: 180,
              height: 180,
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: 20,
              border: "4px solid white",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
            }}
          />

          <div>
            <a
              href="/cv/Elijah_awsCv_2026.pdf" download
              style={{
                display: "inline-block",
                marginTop: 12,
                padding: "10px 16px",
                background: "#2563eb",
                color: "white",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Download CV
            </a>
          </div>
        </div>
        <p style={text}>
          I am a Junior AWS Cloud Developer with hands-on experience in full-stack
          development, cloud infrastructure, and DevOps practices. I enjoy building
          practical applications that connect frontend, backend, databases, and cloud
          services into complete working solutions.
        </p>

        <p style={text}>
          My experience includes Java and Spring Boot, Node.js and NestJS, Next.js,
          PostgreSQL, Docker, GitHub Actions, and AWS services such as EC2 and S3.
          Through academic and personal projects, I have developed and deployed
          cloud-based applications while working with CI/CD, REST APIs, databases,
          containerization, and modern development workflows.
        </p>

        {/* Skills */}
        <div style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Technical Skills</h2>

          <div style={grid}>
            {[
              ["Backend", "Spring Boot, NestJS, Node.js"],
              ["Frontend", "Next.js, React"],
              ["Database", "PostgreSQL"],
              ["Cloud", "AWS (EC2, S3)"],
              ["DevOps", "Docker, GitHub Actions, CI/CD"],
              ["Tools", "Git, Linux (WSL), VS Code, IntelliJ IDEA"],
            ].map(([title, value]) => (
              <div key={title} style={card}>
                <strong>{title}</strong>
                <p style={textSmall}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Qualifications & Certifications */}
        <div style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Qualifications & Certifications</h2>

          <div style={grid}>
            <div style={card}>
              <strong>AWS Cloud Developer</strong>
              <p style={textSmall}>
                Higher Vocational Education Diploma — JENSEN yrkeshögskola,
                Sweden. SeQF Level 5 / EQF Level 5.
              </p>
            </div>

            <div style={card}>
              <strong>Docker Basics for DevOps</strong>
              <p style={textSmall}>
                KodeKloud • Coursera
              </p>
            </div>

            <div style={card}>
              <strong>
                Operating Systems and You: Becoming a Power User
              </strong>
              <p style={textSmall}>
                Google • Coursera
              </p>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Experience</h2>

          <div style={card}>
            <strong>Full-stack Cloud Projects</strong>
            <p style={textSmall}>
              Built and deployed cloud-based applications including Elijah Cloud Platform with frontend (Next.js), backend (NestJS), PostgreSQL database,
              and AWS infrastructure (EC2 & S3).
            </p>
          </div>

          <div style={card}>
            <strong>Java Backend Development</strong>
            <p style={textSmall}>
              Developed backend systems using Spring Boot, including REST APIs,
              database integration, and structured application architecture.
            </p>
          </div>

          <div style={card}>
            <strong>DevOps & Cloud Deployment</strong>
            <p style={textSmall}>
              Set up CI/CD pipelines using GitHub Actions, containerized applications
              with Docker, and deployed services on AWS.
            </p>
          </div>
        </div>

        {/* Goals */}
        <div style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Career Goal</h2>

          <div style={card}>
            <p style={textSmall}>
              I am looking for an opportunity to begin my career as a Junior Cloud Developer,
              Backend Developer, or Full-Stack Developer. With hands-on experience in cloud-native development, AWS, Java, Spring Boot, Node.js, Next.js, Next.js, and DevOps practices, I am eager to contribute to real-world projects, collaborate with talented teams, and continue growing as a software engineer.
              I am passionate about building scalable solutions and making a positive impact through technology.

            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const text = {
  fontSize: 18,
  color: "#475569",
  lineHeight: 1.7,
};

const textSmall = {
  color: "#64748b",
  marginTop: 6,
};

const sectionTitle = {
  fontSize: 26,
  marginBottom: 16,
  color: "#0f172a",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const card = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 20,
};