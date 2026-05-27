"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        {/* Icon + Title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f3e8ff, #e0d4fe)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
            }}
          >
            🌙
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a2e", margin: 0 }}>
            SleepSense AI
          </h1>
        </div>

        <p style={{ color: "#888", fontSize: "15px", marginBottom: "40px" }}>
          AI-Powered Sleep Quality Prediction
        </p>

        {/* Feature highlights */}
        {[
          { icon: "😴", label: "Sleep Duration" },
          { icon: "🌙", label: "Bedtime" },
          { icon: "📱", label: "Screen Time Before Bed" },
          { icon: "😓", label: "Stress Level" },
          { icon: "☕", label: "Caffeine Intake" },
        ].map((f) => (
          <div
            key={f.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              border: "1.5px solid #f0f0f8",
              borderRadius: "12px",
              marginBottom: "10px",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "20px" }}>{f.icon}</span>
            <span style={{ fontSize: "15px", color: "#444", fontWeight: "500" }}>{f.label}</span>
          </div>
        ))}

        <div style={{ marginTop: "28px" }}>
          <Link href="/analyze" style={{ textDecoration: "none" }}>
            <button className="btn-gradient">
              ✨ Analyze My Sleep
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
