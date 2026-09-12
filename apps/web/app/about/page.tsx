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
            Cloud Development • Full-Stack Development • DevOps
          </p>
        </div>

        <div
          className="about-profile"
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
          I am a Cloud & Full-Stack Developer with hands-on experience in software
          development, cloud technologies, and DevOps practices. I enjoy turning ideas
          into practical solutions by connecting frontend applications, backend
          services, databases, and cloud infrastructure into complete working systems.
        </p>

        <p style={text}>
          My experience spans Java and Spring Boot, modern JavaScript technologies,
          cloud development, databases, Docker, CI/CD, and DevOps practices. I have
          applied these skills while building practical projects and working with REST
          APIs, cloud infrastructure, deployment, automation, and modern development
          workflows. I am also open to learning and adopting new technologies based on
          the needs of each project and solution.
        </p>

        <div style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>My Journey</h2>

          <div style={card}>
            <p style={textSmall}>
              My professional journey began with a background in Nautical Science and
              later included entrepreneurship and practical work experience. Over time,
              my interest in creativity, problem-solving, and technology led me into
              software and cloud development.
            </p>

            <p style={textSmall}>
              I continued this transition through professional education in AWS Cloud
              Development in Sweden, while building practical experience with software
              development, cloud technologies, databases, DevOps, and IT support. This
              combination of different experiences has shaped how I approach technology:
              with curiosity, adaptability, and a focus on practical solutions.
            </p>
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Technical Skills</h2>

          <div style={grid}>
            {[
              [
                "Backend Development",
                "Java, Spring Boot, Node.js, NestJS, Express.js, REST APIs",
              ],
              [
                "Frontend Development",
                "JavaScript, TypeScript, Next.js, React, HTML5, CSS3, Bootstrap",
              ],
              [
                "Databases",
                "PostgreSQL, MySQL, MongoDB, SQL, NoSQL, ORM & Database Migration",
              ],
              [
                "Cloud & AWS",
                "EC2, S3, RDS, IAM, Lambda, Elastic Beanstalk, CodePipeline, CloudFormation",
              ],
              [
                "DevOps & Automation",
                "Docker, Docker Compose, CI/CD, GitHub Actions, Maven",
              ],
              [
                "Development & API Tools",
                "Git, GitHub, Linux, API Integration, JWT Authentication, Testing, Troubleshooting",
              ],
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
              <strong>Cloud Developer – AWS</strong>
              <p style={textSmall}>
                Higher Vocational Education Diploma — JENSEN yrkeshögskola,
                Sweden. SeQF Level 5 / EQF Level 5.
              </p>
            </div>

            <div style={card}>
              <strong>Diploma in Nautical Science</strong>
              <p style={textSmall}>
                Federal College of Fisheries and Marine Technology, Lagos, Nigeria.
                2004–2006.
              </p>
            </div>

            <div style={card}>
              <strong>Docker Basics for DevOps</strong>
              <p style={textSmall}>KodeKloud • August 2025</p>
            </div>

            <div style={card}>
              <strong>Operating Systems and You: Becoming a Power User</strong>
              <p style={textSmall}>Google • Coursera • February 2026</p>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Experience</h2>

          <div style={card}>
            <strong>Elijah Cloud Platform</strong>
            <p style={textSmall}>
              Building a full-stack platform with Next.js, NestJS, PostgreSQL, REST APIs,
              authentication, Admin and Customer portals, project management, messaging,
              notifications, milestones, documents, and service request functionality.
            </p>
          </div>

          <div style={card}>
            <strong>Cloud & DevOps</strong>
            <p style={textSmall}>
              Worked with AWS cloud services, Docker, CI/CD pipelines, GitHub Actions,
              AWS CodePipeline, deployment workflows, and cloud infrastructure while
              building and deploying applications across different development projects.
            </p>
          </div>

          <div style={card}>
            <strong>Backend & API Development</strong>
            <p style={textSmall}>
              Built backend applications and REST APIs using Java, Spring Boot, Node.js,
              NestJS, and Express, with experience in database integration,
              authentication and authorization, application logic, and structured
              backend architecture.
            </p>
          </div>
        </div>

        {/* Goals */}
        <div style={{ marginTop: 40 }}>
          <h2 style={sectionTitle}>Career Goal</h2>

          <div style={card}>
            <p style={textSmall}>
              I am looking for opportunities where I can contribute to meaningful
              software, cloud, and technology projects while continuing to grow as a
              developer. I am interested in working with teams and clients where I can
              apply my current skills, solve practical problems, learn new technologies,
              and contribute to secure, reliable, and scalable solutions. My long-term
              goal is to continue developing as a well-rounded technology professional
              while creating solutions that deliver real value.
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