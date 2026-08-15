"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

export default function AiIntelligencePage() {
  const [email, setEmail] = useState("sam@mail.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const url = `/ai-intelligence/scan-and-notify?recipient_email=${encodeURIComponent(email)}`;
      const data = await apiFetch(url, { method: "POST" });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to run AI Market Scanner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "900px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🛰️ 24/7 System Intelligence & Notifier</h1>
            <p style={{ color: "var(--text-muted)" }}>
              Continuous AI market monitoring, model release tracking, and automated admin digests
            </p>
          </div>
          <Link href="/modules" className="btn btn-secondary">
            ← Back to Modules
          </Link>
        </div>

        <div style={{ display: "grid", gap: "1.5rem", marginBottom: "2rem" }}>
          <div className="glass-panel" style={{ padding: "1.5rem", background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.3)" }}>
            <h3 style={{ color: "#f43f5e", marginBottom: "0.5rem" }}>⚡ Active Intelligence Scanners</h3>
            <ul style={{ color: "var(--text-muted)", lineHeight: "1.8", paddingLeft: "1.2rem" }}>
              <li><strong>Groq Llama 3.3 70B & DeepSeek R1</strong>: Inference latency monitored under 300ms.</li>
              <li><strong>Gemini 1.5 Pro Auto-Failover</strong>: Active fallback channel online.</li>
              <li><strong>OpenRouter Discovery Engine</strong>: Syncing newest free-tier LLM models.</li>
              <li><strong>cPanel WSGI Health Monitor</strong>: Pure Python Passenger WSGI status normal.</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleScan} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Admin Recipient Email Digest</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mail.com"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: "0.9rem" }}>
            {loading ? "Scanning AI Market & Generating Digest..." : "🛰️ Run AI Intelligence Scan & Send Digest"}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5" }}>
            ❌ {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "12px" }}>
            <h3 style={{ color: "#10b981", marginBottom: "0.5rem" }}>✅ Intelligence Scan Complete & Digest Sent!</h3>
            <pre style={{ background: "#030712", padding: "1rem", borderRadius: "8px", color: "#34d399", overflowX: "auto", fontSize: "0.9rem" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
