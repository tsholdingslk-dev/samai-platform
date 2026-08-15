"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

type Project = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export default function ProjectMemoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/projects/");
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([
          { id: "default", name: "General Workspace", description: "Default memory storage for conversation logs, code snippets, and uploaded files.", created_at: new Date().toISOString() },
          { id: "main", name: "Main Project Workspace", description: "Structured persistent project storage.", created_at: new Date().toISOString() }
        ]);
      }
    } catch {
      setProjects([
        { id: "default", name: "General Workspace", description: "Default memory storage for conversation logs, code snippets, and uploaded files.", created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="page-container">
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "900px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📂 Project Memory Storage</h1>
            <p style={{ color: "var(--text-muted)" }}>
              Persistent memory logs, document indexing, and structured workspace context
            </p>
          </div>
          <Link href="/modules" className="btn btn-secondary">
            ← Back to Modules
          </Link>
        </div>

        <div style={{ display: "grid", gap: "1.2rem" }}>
          {projects.map((p) => (
            <div
              key={p.id}
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
                <h3 style={{ fontSize: "1.2rem", color: "#60a5fa", marginBottom: "0.4rem" }}>📁 {p.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{p.description}</p>
                <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Workspace ID: <code style={{ color: "#34d399" }}>{p.id}</code>
                </div>
              </div>
              <Link href={`/chat?project=${p.id}`} className="btn btn-primary" style={{ padding: "0.6rem 1.2rem" }}>
                Open Workspace →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
