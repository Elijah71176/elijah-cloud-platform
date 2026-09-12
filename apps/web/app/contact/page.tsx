import Link from "next/link";

export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "56px 24px",
      }}
    >
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "#2563eb", fontWeight: 900 }}>Contact</p>

        <h1
          style={{
            fontSize: 44,
            margin: "10px 0",
            color: "#0f172a",
          }}
        >
          Let&apos;s Work Together
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#475569",
            lineHeight: 1.7,
            maxWidth: 750,
          }}
        >
          I am available for cloud and full-stack development opportunities,
          professional projects, collaboration, and service requests.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginTop: 36,
            alignItems: "start",
          }}
        >
          {/* Work / Collaboration */}
          <div
            style={{
              background: "#0f172a",
              color: "white",
              borderRadius: 18,
              padding: 28,
            }}
          >
            <p
              style={{
                color: "#93c5fd",
                fontWeight: 900,
                marginTop: 0,
              }}
            >
              OPEN TO OPPORTUNITIES
            </p>

            <h2 style={{ fontSize: 30, margin: "10px 0 16px" }}>
              Hire Me or Let&apos;s Collaborate
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              Looking for a developer for your team, project or digital idea?
              I&apos;m open to professional opportunities, freelance projects
              and collaborations where I can contribute with cloud, software
              development and DevOps skills.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <a
                href="mailto:elijah71176@gmail.com"
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "12px 18px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Contact Me
              </a>

              <Link
                href="/request"
                style={{
                  background: "white",
                  color: "#0f172a",
                  padding: "12px 18px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Request a Service
              </Link>
            </div>
          </div>

          {/* Contact Details */}
          <div
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 18,
              padding: 28,
              boxShadow: "0 10px 25px rgba(15,23,42,0.05)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: "#0f172a",
              }}
            >
              Contact Details
            </h2>

            <div style={detailStyle}>
              <strong>Email</strong>
              <a href="mailto:elijah71176@gmail.com" style={linkStyle}>
                elijah71176@gmail.com
              </a>
            </div>

            <div style={detailStyle}>
              <strong>Phone</strong>
              <a href="tel:+46737783622" style={linkStyle}>
                +46 73 778 36 22
              </a>
            </div>
            <div style={detailStyle}>
              <strong>WhatsApp</strong>
              <a
                href="https://wa.me/46737783622"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                Chat on WhatsApp
              </a>
            </div>
            <div style={detailStyle}>
              <strong>GitHub</strong>
              <a
                href="https://github.com/Elijah71176"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                github.com/Elijah71176
              </a>
            </div>

            <div style={detailStyle}>
              <strong>LinkedIn</strong>
              <a
                href="https://www.linkedin.com/in/elijah-bamidele/"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                View LinkedIn Profile
              </a>
            </div>

            <div style={detailStyle}>
              <strong>Location</strong>
              <span style={{ color: "#64748b" }}>Sweden</span>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <strong>Role</strong>
              <span style={{ color: "#64748b" }}>
                Cloud &amp; Full-Stack Developer
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 16,
            padding: "22px 24px",
          }}
        >
          <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>
            💡 Have an idea?
          </h3>

          <p
            style={{
              margin: 0,
              color: "#475569",
              lineHeight: 1.7,
            }}
          >
            Even if it&apos;s not fully figured out yet, feel free to reach out.
            I&apos;m always interested in discussing useful projects, cloud solutions,
            software ideas and opportunities to collaborate.
          </p>
        </div>
      </section>
    </main>
  );
}

const detailStyle = {
  display: "grid",
  gap: 6,
  paddingBottom: 16,
  marginBottom: 16,
  borderBottom: "1px solid #e2e8f0",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 700,
};