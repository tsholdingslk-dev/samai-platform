"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

export default function AutoIntegratorPage() {
  const [providerName, setProviderName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [modelName, setModelName] = useState("");
  const [priority, setPriority] = useState("1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleIntegrate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName || !apiKey || !modelName) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const url = `/auto-integrator/integrate?provider_name=${encodeURIComponent(providerName)}&api_key=${encodeURIComponent(apiKey)}&model_name=${encodeURIComponent(modelName)}&priority=${priority}`;
      const data = await apiFetch(url, { method: "POST" });
      setResult(data);
      setProviderName("");
      setApiKey("");
      setModelName("");
    } catch (err: any) {
      setError(err.message || "Failed to integrate new API provider");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "900px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡ Auto API Integrator Engine</h1>
            <p style={{ color: "var(--text-muted)" }}>
              Dynamically test, register, and activate new AI API Keys without modifying code
            </p>
          </div>
          <Link href="/modules" className="btn btn-secondary">
            ← Back to Modules
          </Link>
        </div>

        <form onSubmit={handleIntegrate} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Provider Name (e.g. Groq, OpenRouter, Gemini, InferX)</label>
            <input
              type="text"
              className="input"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="e.g. Groq"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>API Secret Key</label>
            <input
              type="password"
              className="input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>AI Model Identifier</label>
            <input
              type="text"
              className="input"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g. llama-3.3-70b-versatile"
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Failover Priority Level</label>
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="1">Priority 1 (Primary AI Provider)</option>
              <option value="2">Priority 2 (Secondary Failover)</option>
              <option value="3">Priority 3 (Tertiary Reserve)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: "0.9rem" }}>
            {loading ? "Testing & Connecting API Key..." : "🚀 Test & Register API Provider Now"}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(239, 68, 68, 0.2)", border: "1px solid #ef4444", borderRadius: "8px", color: "#fca5a5" }}>
            ❌ {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "12px" }}>
            <h3 style={{ color: "#10b981", marginBottom: "0.5rem" }}>✅ API Provider Integrated Successfully!</h3>
            <pre style={{ background: "#030712", padding: "1rem", borderRadius: "8px", color: "#34d399", overflowX: "auto", fontSize: "0.9rem" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
