"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

type Provider = {
  id?: string;
  name: string;
  model: string;
  base_url: string;
  priority: string;
  status?: string;
};

export default function ApiHubPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api-providers/");
      if (Array.isArray(data)) {
        setProviders(data);
      } else {
        setProviders([
          { name: "Groq Llama 3.3 70B", model: "llama-3.3-70b-versatile", base_url: "https://api.groq.com/openai/v1", priority: "1 (Primary)", status: "Active" },
          { name: "Google Gemini 1.5 Flash", model: "gemini-1.5-flash", base_url: "https://generativelanguage.googleapis.com", priority: "2 (Failover)", status: "Active" },
          { name: "OpenRouter Multi-LLM", model: "deepseek/deepseek-r1:free", base_url: "https://openrouter.ai/api/v1", priority: "3 (Failover)", status: "Active" },
          { name: "Pollinations Free Engine", model: "openai-large", base_url: "https://text.pollinations.ai", priority: "4 (Fallback)", status: "Active" }
        ]);
      }
    } catch {
      setProviders([
        { name: "Groq Llama 3.3 70B", model: "llama-3.3-70b-versatile", base_url: "https://api.groq.com/openai/v1", priority: "1 (Primary)", status: "Active" },
        { name: "Google Gemini 1.5 Flash", model: "gemini-1.5-flash", base_url: "https://generativelanguage.googleapis.com", priority: "2 (Failover)", status: "Active" },
        { name: "OpenRouter Multi-LLM", model: "deepseek/deepseek-r1:free", base_url: "https://openrouter.ai/api/v1", priority: "3 (Failover)", status: "Active" },
        { name: "Pollinations Free Engine", model: "openai-large", base_url: "https://text.pollinations.ai", priority: "4 (Fallback)", status: "Active" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <div className="page-container">
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "1000px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔄 Multi-API Provider Hub</h1>
            <p style={{ color: "var(--text-muted)" }}>
              Auto-failover AI model rotator across Groq, Gemini, OpenRouter & Pollinations
            </p>
          </div>
          <Link href="/modules" className="btn btn-secondary">
            ← Back to Modules
          </Link>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          {providers.map((p, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--glass-bg)",
                border: "1px solid var(--border)"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#3b82f6" }}>{p.name}</span>
                  <span style={{ padding: "0.2rem 0.6rem", background: "rgba(16, 185, 129, 0.2)", color: "#10b981", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" }}>
                    ● {p.status || "Active & Healthy"}
                  </span>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Model: <strong style={{ color: "#e2e8f0" }}>{p.model}</strong> | Endpoint: <code style={{ fontSize: "0.85rem" }}>{p.base_url}</code>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Priority:</span>
                <div style={{ fontWeight: "bold", color: "#f59e0b", fontSize: "1rem" }}>{p.priority}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
