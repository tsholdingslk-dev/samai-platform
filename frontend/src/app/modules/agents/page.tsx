"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

type AgentInfo = {
  name: string;
  description: string;
  tools: string[];
};

type ExecutionResult = {
  task_id: string;
  status: string;
  result: string;
  agent_used: string;
  steps_completed: string[];
  execution_time: number;
  mode: string;
  plan?: string[];
};

export default function AgentsPage() {
  const [task, setTask] = useState("");
  const [context, setContext] = useState("");
  const [usePlanning, setUsePlanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState("");
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const loadAgents = async () => {
    try {
      const data = await apiFetch("/agents/available");
      const agentNames = data.agents || [];
      const descriptions: Record<string, string> = {
        "Planner": "Breaks down complex tasks into actionable steps",
        "Researcher": "Gathers and analyzes information from multiple sources",
        "Coder": "Generates, reviews, and fixes code in multiple languages",
        "Business Analyst": "Analyzes business problems and creates strategies",
        "Content Creator": "Creates articles, scripts, and marketing content"
      };
      const tools: Record<string, string[]> = {
        "Planner": ["analysis", "decomposition", "prioritization"],
        "Researcher": ["web_search", "document_analysis", "data_extraction"],
        "Coder": ["code_generation", "code_review", "debugging", "documentation"],
        "Business Analyst": ["market_analysis", "financial_calc", "report_generation"],
        "Content Creator": ["writing", "editing", "seo_optimization", "formatting"]
      };
      setAgents(agentNames.map((name: string) => ({
        name,
        description: descriptions[name] || "Autonomous AI agent",
        tools: tools[name] || []
      })));
    } catch {
      // ignore
    }
  };

  const loadHistory = async () => {
    try {
      const data = await apiFetch("/agents/history");
      setHistory(data.history || []);
    } catch {
      // ignore
    }
  };

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("task", task);
      formData.append("context", context);
      formData.append("use_planning", String(usePlanning));

      const data = await apiFetch("/agents/run", {
        method: "POST",
        body: formData,
      });

      setResult(data as ExecutionResult);
      setTask("");
      setContext("");
      loadHistory();
    } catch (err: any) {
      setError(err.message || "Agent execution failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "1000px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🤖 Autonomous AI Agents</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Give SAM AI a goal. It plans, executes, and delivers results.
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Agent Input */}
          <form onSubmit={handleRun}>
            <div className="input-group">
              <label>Goal / Task</label>
              <textarea
                className="input-field"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="e.g., Create a YouTube marketing plan for my AI app"
                rows={3}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="input-group">
              <label>Context (optional JSON)</label>
              <textarea
                className="input-field"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder='e.g., {"language": "python", "framework": "react"}'
                rows={2}
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={usePlanning}
                  onChange={(e) => setUsePlanning(e.target.checked)}
                />
                <span>Use Planner Agent</span>
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Running Agents..." : "Run Agent Task"}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div style={{
              padding: "1.5rem",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(16, 185, 129, 0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <span style={{ color: "var(--success)", fontWeight: "600" }}>Status: {result.status}</span>
                  <span style={{ color: "var(--text-muted)", marginLeft: "1rem" }}>Agent: {result.agent_used || "N/A"}</span>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {result.execution_time.toFixed(2)}s
                </span>
              </div>

              {result.plan && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>Plan</h4>
                  <ol style={{ paddingLeft: "1.5rem", lineHeight: "1.7" }}>
                    {result.plan.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {result.steps_completed && result.steps_completed.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>Steps Completed</h4>
                  <ul style={{ paddingLeft: "1.5rem", lineHeight: "1.7" }}>
                    {result.steps_completed.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>Result</h4>
                <div style={{
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7"
                }}>
                  {result.result}
                </div>
              </div>
            </div>
          )}

          {/* Available Agents */}
          <div>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Available Agents</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {agents.map((agent) => (
                <div key={agent.name} style={{
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)"
                }}>
                  <h4 style={{ marginBottom: "0.3rem", fontSize: "1rem" }}>{agent.name}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{agent.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {agent.tools.map((tool) => (
                      <span key={tool} style={{
                        padding: "0.2rem 0.5rem",
                        background: "var(--bg-chat-user)",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        color: "var(--primary)"
                      }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href="/modules" style={{ color: "var(--primary)", textDecoration: "none" }}>
            ← Back to Modules
          </Link>
        </div>
      </div>
    </div>
  );
}
