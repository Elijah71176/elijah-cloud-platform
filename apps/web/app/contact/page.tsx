export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "56px 24px",
      }}
    >
      <section style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ color: "#2563eb", fontWeight: 900 }}>Contact</p>

        <h1 style={{ fontSize: 44, margin: "10px 0", color: "#0f172a" }}>
          Let’s connect
        </h1>

        <p style={{ fontSize: 18, color: "#475569", lineHeight: 1.7 }}>
          I am available for junior cloud developer opportunities, portfolio
          projects, collaboration, and service requests.
        </p>

        <div style={{ marginTop: 30, display: "grid", gap: 18 }}>
          {/* Email */}
          <div style={cardStyle}>
            <strong>Email</strong>
            <p style={textStyle}>
              <a
                href="mailto:elijah71176@gmail.com"
                style={{
                  textDecoration: "none",
                  color: "#2563eb",
                  fontWeight: 700,
                }}
              >
                elijah71176@gmail.com
              </a>
            </p>
          </div>
          {/* Phone */}
          <div style={cardStyle}>
            <strong>Phone</strong>
            <p style={textStyle}>
              <a
                href="tel:+46737783622"
                style={{
                  textDecoration: "none",
                  color: "#2563eb",
                  fontWeight: 700,
                }}
              >
                +46 73 778 36 22
              </a>
            </p>
          </div>

          {/* GitHub */}
          <div style={cardStyle}>
            <strong>GitHub</strong>
            <p style={textStyle}>
              <a
                href="https://github.com/Elijah71176"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                github.com/Elijah71176
              </a>
            </p>
          </div>

          {/* LinkedIn */}
          <div style={cardStyle}>
            <strong>LinkedIn</strong>
            <p style={textStyle}>
              <a
                href="https://www.linkedin.com/in/elijah-bamidele-b8943175/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                View LinkedIn Profile
              </a>
            </p>
          </div>

          {/* Location */}
          <div style={cardStyle}>
            <strong>Location</strong>
            <p style={textStyle}>Sweden</p>
          </div>

          {/* Role */}
          <div style={cardStyle}>
            <strong>Role</strong>
            <p style={textStyle}>
              Junior AWS Cloud Developer / Full-Stack Developer
            </p>

          </div>
        </div>
        <div style={{ marginTop: 28 }}>
          <a
            href="/request"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              background: "#2563eb",
              color: "white",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Request a Service
          </a>
        </div>
      </section>
    </main>
  );
}

const cardStyle = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 20,
};

const textStyle = {
  color: "#64748b",
  marginBottom: 0,
};
