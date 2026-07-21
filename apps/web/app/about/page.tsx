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
        <p style={{ color: "#2563eb", fontWeight: 900 }}>About</p>

        <h1 style={{ fontSize: 44, margin: "10px 0", color: "#0f172a" }}>
          About Me
        </h1>

        <p style={text}>
          I am an AWS Cloud Developer student with hands-on experience in building
          full-stack applications using modern technologies. I focus on developing
          scalable backend systems, deploying cloud infrastructure, and implementing
          CI/CD pipelines.
        </p>

        <p style={text}>
          Through my projects, I have worked with both Java Spring Boot and Node.js
          (NestJS), as well as frontend development using Next.js. I enjoy combining
          development and DevOps practices to deliver complete, real-world solutions.
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
              ["Tools", "Git, Linux (WSL), VS Code, intellij idea"],
            ].map(([title, value]) => (
              <div key={title} style={card}>
                <strong>{title}</strong>
                <p style={textSmall}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Experience</h2>

          <div style={card}>
            <strong>Full-stack Cloud Projects</strong>
            <p style={textSmall}>
              Built and deployed cloud-based applications including Mini-DPS Client
              Portal with frontend (Next.js), backend (NestJS), PostgreSQL database,
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
              I am currently seeking opportunities as a Junior Cloud Developer or
              Full-stack Developer where I can contribute to real-world systems,
              continue learning, and grow in cloud technologies and DevOps practices.
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