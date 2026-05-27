"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  sleep_duration: string;
  bedtime: string;
  screen_time: string;
  stress_level: string;
  caffeine_intake: string;
}

export default function AnalyzePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    sleep_duration: "",
    bedtime: "",
    screen_time: "",
    stress_level: "Medium",
    caffeine_intake: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.sleep_duration || !form.bedtime || !form.screen_time || !form.caffeine_intake) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, stress_level: form.stress_level.toLowerCase() }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      sessionStorage.setItem("sleepsense_result", JSON.stringify(data));
      sessionStorage.setItem("sleepsense_input", JSON.stringify(form));
      router.push("/results");
    } catch {
      // client-side fallback
      const score = computeClientScore({ ...form, stress_level: form.stress_level.toLowerCase() });
      sessionStorage.setItem("sleepsense_result", JSON.stringify(score));
      sessionStorage.setItem("sleepsense_input", JSON.stringify(form));
      router.push("/results");
    } finally {
      setLoading(false);
    }
  };

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
          padding: "40px 36px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f3e8ff, #e0d4fe)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            🌙
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#1a1a2e", margin: 0 }}>
            SleepSense AI
          </h1>
        </div>
        <p style={{ textAlign: "center", color: "#888", fontSize: "14px", marginBottom: "32px" }}>
          AI-Powered Sleep Quality Prediction
        </p>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Sleep Duration */}
          <div>
            <label style={{ display: "block", fontWeight: "600", fontSize: "14px", color: "#1a1a2e", marginBottom: "8px" }}>
              Sleep Duration
            </label>
            <input
              className="sleep-input"
              type="number"
              placeholder="e.g. 7.5 hours"
              min={0}
              max={24}
              step={0.5}
              value={form.sleep_duration}
              onChange={set("sleep_duration")}
            />
          </div>

          {/* Bedtime */}
          <div>
            <label style={{ display: "block", fontWeight: "600", fontSize: "14px", color: "#1a1a2e", marginBottom: "8px" }}>
              Bedtime
            </label>
            <input
              className="sleep-input"
              type="time"
              value={form.bedtime}
              onChange={set("bedtime")}
            />
          </div>

          {/* Screen Time */}
          <div>
            <label style={{ display: "block", fontWeight: "600", fontSize: "14px", color: "#1a1a2e", marginBottom: "8px" }}>
              Screen Time Before Bed (minutes)
            </label>
            <input
              className="sleep-input"
              type="number"
              placeholder="e.g. 45 minutes"
              min={0}
              max={480}
              value={form.screen_time}
              onChange={set("screen_time")}
            />
          </div>

          {/* Stress Level */}
          <div>
            <label style={{ display: "block", fontWeight: "600", fontSize: "14px", color: "#1a1a2e", marginBottom: "8px" }}>
              Stress Level
            </label>
            <select className="sleep-input" value={form.stress_level} onChange={set("stress_level")}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* Caffeine */}
          <div>
            <label style={{ display: "block", fontWeight: "600", fontSize: "14px", color: "#1a1a2e", marginBottom: "8px" }}>
              Caffeine Intake (cups per day)
            </label>
            <input
              className="sleep-input"
              type="number"
              placeholder="e.g. 2 cups"
              min={0}
              max={20}
              value={form.caffeine_intake}
              onChange={set("caffeine_intake")}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "#e53e3e", fontSize: "13px", textAlign: "center" }}>{error}</p>
          )}

          {/* Button */}
          <button
            className="btn-gradient"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: "4px" }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Analyzing...
              </>
            ) : (
              "✨ Generate Insights"
            )}
          </button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      <p style={{ marginTop: "16px", color: "#bbb", fontSize: "12px" }}>
        <Link href="/" style={{ color: "#9333ea", textDecoration: "none" }}>← Back to home</Link>
      </p>
    </main>
  );
}

function computeClientScore(form: FormData) {
  let score = 100;
  const suggestions: string[] = [];

  const duration = parseFloat(form.sleep_duration || "7");
  if (duration < 5) { score -= 30; suggestions.push("🛏️ Severely sleep-deprived. Aim for at least 7–8 hours nightly."); }
  else if (duration < 6) { score -= 20; suggestions.push("🛏️ Less than 6 hours impacts your health. Try sleeping earlier."); }
  else if (duration < 7) { score -= 10; suggestions.push("🛏️ Add 30–60 more minutes of sleep for better recovery."); }

  const bedtime = form.bedtime || "22:00";
  const hour = parseInt(bedtime.split(":")[0]);
  if (hour === 0 || (hour >= 1 && hour <= 5)) { score -= 20; suggestions.push("🌙 Sleeping after midnight disrupts your circadian rhythm. Try before 11 PM."); }
  else if (hour >= 23) { score -= 10; suggestions.push("🌙 Try sleeping before 11 PM for deeper, restorative rest."); }

  const screen = parseInt(form.screen_time || "30");
  if (screen > 120) { score -= 20; suggestions.push("📱 Over 2 hours of screens before bed blocks melatonin. Stop 90 min before sleep."); }
  else if (screen > 60) { score -= 12; suggestions.push("📱 Reduce screen exposure — blue light keeps your brain awake."); }
  else if (screen > 30) { score -= 6; suggestions.push("📱 Try limiting screens to 30 minutes before bed."); }

  if (form.stress_level === "high") { score -= 20; suggestions.push("😓 High stress disrupts deep sleep. Try meditation or journaling before bed."); }
  else if (form.stress_level === "medium") { score -= 10; suggestions.push("😓 Moderate stress fragments sleep cycles. Deep breathing exercises help."); }

  const caffeine = parseInt(form.caffeine_intake || "1");
  if (caffeine > 5) { score -= 15; suggestions.push("☕ Over 5 cups drastically disrupts sleep architecture. Cut back significantly."); }
  else if (caffeine > 3) { score -= 10; suggestions.push("☕ Caffeine lingers for 5–6 hours. Avoid coffee after noon."); }
  else if (caffeine > 1) { score -= 3; suggestions.push("☕ Limit caffeine to mornings only for best results."); }

  score = Math.max(0, Math.min(100, score));
  if (!suggestions.length) suggestions.push("✅ Your sleep habits are excellent! Keep your consistent schedule.");
  suggestions.push("🌿 Keep a consistent sleep-wake schedule, even on weekends.");

  let risk_level = "Poor Sleep", risk_emoji = "🚨", risk_color = "red";
  if (score >= 80) { risk_level = "Excellent Sleep"; risk_emoji = "😴"; risk_color = "green"; }
  else if (score >= 55) { risk_level = "Moderate Sleep"; risk_emoji = "⚠️"; risk_color = "yellow"; }

  return { score, risk_level, risk_emoji, risk_color, suggestions, deductions: [] };
}
