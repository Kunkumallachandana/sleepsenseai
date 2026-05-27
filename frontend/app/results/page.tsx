"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SleepResult {
  score: number;
  risk_level: string;
  risk_emoji: string;
  risk_color: string;
  suggestions: string[];
}

interface SleepInput {
  sleep_duration: string;
  bedtime: string;
  screen_time: string;
  stress_level: string;
  caffeine_intake: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<SleepResult | null>(null);
  const [input, setInput] = useState<SleepInput | null>(null);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("sleepsense_result");
    const inp = sessionStorage.getItem("sleepsense_input");
    if (!stored) { router.push("/analyze"); return; }
    setResult(JSON.parse(stored));
    if (inp) setInput(JSON.parse(inp));
    setTimeout(() => {
      const r = JSON.parse(stored);
      setBarWidth(r.score);
    }, 300);
  }, [router]);

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #e0d4fe", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const riskColors: Record<string, { bg: string; text: string; border: string; bar: string }> = {
    green: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", bar: "#22c55e" },
    yellow: { bg: "#fffbeb", text: "#d97706", border: "#fde68a", bar: "#f59e0b" },
    red: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", bar: "#ef4444" },
  };
  const rc = riskColors[result.risk_color] || riskColors.red;

  const tagline =
    result.score >= 80
      ? "Great habits! Your sleep quality is excellent."
      : result.score >= 55
      ? "Your sleep is decent but there's room to improve."
      : "Your sleep needs attention. Start with these tips.";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "32px 16px",
      }}
    >
      {/* ── Score Card ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "24px",
          padding: "36px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          marginBottom: "16px",
          textAlign: "center",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "4px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg,#f3e8ff,#e0d4fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🌙</div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: 0 }}>SleepSense AI</h1>
        </div>
        <p style={{ color: "#888", fontSize: "13px", marginBottom: "28px" }}>AI-Powered Sleep Quality Prediction</p>

        {/* Big score number */}
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontSize: "72px", fontWeight: "800", color: rc.bar, lineHeight: 1 }}>{result.score}</span>
          <span style={{ fontSize: "24px", color: "#ccc", fontWeight: "400" }}>/100</span>
        </div>

        <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>{tagline}</p>

        {/* Risk badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: rc.bg, border: `1px solid ${rc.border}`, borderRadius: "20px", padding: "6px 18px", marginBottom: "20px" }}>
          <span style={{ fontSize: "16px" }}>{result.risk_emoji}</span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: rc.text }}>{result.risk_level}</span>
        </div>

        {/* Progress bar */}
        <div style={{ background: "#f0f0f8", borderRadius: "99px", height: "10px", overflow: "hidden", marginBottom: "6px" }}>
          <div
            style={{
              height: "100%",
              width: `${barWidth}%`,
              background: rc.bar,
              borderRadius: "99px",
              transition: "width 1.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          />
        </div>
        <p style={{ color: "#bbb", fontSize: "11px" }}>Sleep Quality Score</p>
      </div>

      {/* ── Input Summary ── */}
      {input && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            width: "100%",
            maxWidth: "480px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e", marginBottom: "14px" }}>📊 Your Inputs</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { icon: "⏱️", label: "Sleep", value: `${input.sleep_duration} hrs` },
              { icon: "🌙", label: "Bedtime", value: input.bedtime },
              { icon: "📱", label: "Screens", value: `${input.screen_time} min` },
              { icon: "😓", label: "Stress", value: input.stress_level },
              { icon: "☕", label: "Caffeine", value: `${input.caffeine_intake} cups` },
            ].map((s) => (
              <div key={s.label} style={{ background: "#f8f8fc", borderRadius: "12px", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "11px", color: "#999" }}>{s.icon} {s.label}</span>
                <span style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a2e" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Suggestions ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#1a1a2e", marginBottom: "4px" }}>✨ AI-Generated Suggestions</h2>
        <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "16px" }}>Personalized based on your sleep profile</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {result.suggestions.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                background: "#f8f8fc",
                borderRadius: "12px",
                padding: "12px 14px",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#9333ea", minWidth: "20px", marginTop: "1px" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "13px", color: "#444", lineHeight: 1.55 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div style={{ width: "100%", maxWidth: "480px", display: "flex", gap: "12px" }}>
        <Link href="/analyze" style={{ flex: 1, textDecoration: "none" }}>
          <button className="btn-gradient">🔄 Analyze Again</button>
        </Link>
        <Link href="/" style={{ flex: 1, textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              background: "#f8f8fc",
              border: "1.5px solid #e8e8f0",
              borderRadius: "14px",
              padding: "16px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#555",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            🏠 Home
          </button>
        </Link>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </main>
  );
}
