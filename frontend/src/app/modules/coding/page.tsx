"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

type Tab = "generate" | "explain" | "fix" | "api" | "deploy";

export default function CodingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // Generate state
  const [genPrompt, setGenPrompt] = useState("");
  const [genLanguage, setGenLanguage] = useState("javascript");
  const [genFramework, setGenFramework] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // Explain state
  const [explainCode, setExplainCode] = useState("");
  const [explainLanguage, setExplainLanguage] = useState("javascript");
  const [explanation, setExplanation] = useState("");

  // Fix state
  const [fixCode, setFixCode] = useState("");
  const [fixError, setFixError] = useState("");
  const [fixLanguage, setFixLanguage] = useState("javascript");
  const [fixedCode, setFixedCode] = useState("");

  // API Connect state
  const [apiDesc, setApiDesc] = useState("");
  const [apiLanguage, setApiLanguage] = useState("javascript");
  const [apiGuide, setApiGuide] = useState("");

  // Deploy state
  const [deployType, setDeployType] = useState("react");
  const [deployPlatform, setDeployPlatform] = useState("vercel");
  const [deployGuide, setDeployGuide] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("prompt", genPrompt);
      formData.append("language", genLanguage);
      formData.append("framework", genFramework || "");
      formData.append("project_id", "");

      const data = await apiFetch("/coding/generate", {
        method: "POST",
        body: formData,
      });

      setGeneratedCode(data.code);
      setResult(`Generated ${data.language} code using ${data.provider}`);
    } catch (err: any) {
      setError(err.message || "Code generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("code", explainCode);
      formData.append("language", explainLanguage);
      formData.append("project_id", "");

      const data = await apiFetch("/coding/explain", {
        method: "POST",
        body: formData,
      });

      setExplanation(data.explanation);
      setResult(`Explained ${data.language} code using ${data.provider}`);
    } catch (err: any) {
      setError(err.message || "Code explanation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFix = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("code", fixCode);
      formData.append("error", fixError || "");
      formData.append("language", fixLanguage);
      formData.append("project_id", "");

      const data = await apiFetch("/coding/fix", {
        method: "POST",
        body: formData,
      });

      setFixedCode(data.fixed_code);
      setResult(`Fixed ${data.language} code using ${data.provider}`);
    } catch (err: any) {
      setError(err.message || "Code fix failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApiConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("description", apiDesc);
      formData.append("language", apiLanguage);
      formData.append("project_id", "");

      const data = await apiFetch("/coding/api-connect", {
        method: "POST",
        body: formData,
      });

      setApiGuide(data.guide);
      setResult(`Generated API guide using ${data.provider}`);
    } catch (err: any) {
      setError(err.message || "API guide generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("project_type", deployType);
      formData.append("platform", deployPlatform);
      formData.append("project_id", "");

      const data = await apiFetch("/coding/deploy", {
        method: "POST",
        body: formData,
      });

      setDeployGuide(data.guide);
      setResult(`Generated deploy guide using ${data.provider}`);
    } catch (err: any) {
      setError(err.message || "Deploy guide generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setResult("Copied to clipboard!");
  };

  return (
    <div className="page-container">
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "1000px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💻 Coding Assistant</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Generate, explain, fix code, and get deployment guides
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { key: "generate", label: "Generate" },
            { key: "explain", label: "Explain" },
            { key: "fix", label: "Fix" },
            { key: "api", label: "API Connect" },
            { key: "deploy", label: "Deploy" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className="btn-primary"
              style={{
                background: activeTab === tab.key ? "var(--primary)" : "transparent",
                border: `2px solid var(--primary)`,
                color: activeTab === tab.key ? "white" : "var(--primary)",
                padding: "0.5rem 1rem",
                fontSize: "0.9rem"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}
        {result && <div style={{ color: "var(--success)", marginBottom: "1rem", textAlign: "center" }}>{result}</div>}

        {activeTab === "generate" && (
          <form onSubmit={handleGenerate}>
            <div className="input-group">
              <label>What do you want to build?</label>
              <textarea
                className="input-field"
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder="e.g., A React component that fetches data from an API and displays it in a table..."
                rows={4}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Language</label>
                <select
                  className="input-field"
                  value={genLanguage}
                  onChange={(e) => setGenLanguage(e.target.value)}
                  style={{ color: "var(--text-main)" }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="php">PHP</option>
                  <option value="react">React</option>
                  <option value="nodejs">Node.js</option>
                </select>
              </div>

              <div className="input-group" style={{ flex: 1 }}>
                <label>Framework (optional)</label>
                <input
                  type="text"
                  className="input-field"
                  value={genFramework}
                  onChange={(e) => setGenFramework(e.target.value)}
                  placeholder="e.g., Next.js, Laravel"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Generating..." : "Generate Code"}
            </button>

            {generatedCode && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Generated Code:</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedCode)}
                    className="btn-primary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Copy
                  </button>
                </div>
                <pre style={{
                  padding: "1rem",
                  background: "#1e1e1e",
                  borderRadius: "8px",
                  overflowX: "auto",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: "#d4d4d4"
                }}>
                  {generatedCode}
                </pre>
              </div>
            )}
          </form>
        )}

        {activeTab === "explain" && (
          <form onSubmit={handleExplain}>
            <div className="input-group">
              <label>Paste your code</label>
              <textarea
                className="input-field"
                value={explainCode}
                onChange={(e) => setExplainCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={8}
                required
                style={{ resize: "vertical", fontFamily: "monospace" }}
              />
            </div>

            <div className="input-group">
              <label>Language</label>
              <select
                className="input-field"
                value={explainLanguage}
                onChange={(e) => setExplainLanguage(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="php">PHP</option>
                <option value="react">React</option>
                <option value="nodejs">Node.js</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Explaining..." : "Explain Code"}
            </button>

            {explanation && (
              <div style={{ marginTop: "2rem" }}>
                <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>
                  Explanation:
                </label>
                <div style={{
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7"
                }}>
                  {explanation}
                </div>
              </div>
            )}
          </form>
        )}

        {activeTab === "fix" && (
          <form onSubmit={handleFix}>
            <div className="input-group">
              <label>Paste your broken code</label>
              <textarea
                className="input-field"
                value={fixCode}
                onChange={(e) => setFixCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={8}
                required
                style={{ resize: "vertical", fontFamily: "monospace" }}
              />
            </div>

            <div className="input-group">
              <label>Error message (optional)</label>
              <input
                type="text"
                className="input-field"
                value={fixError}
                onChange={(e) => setFixError(e.target.value)}
                placeholder="Paste the error message you're seeing..."
              />
            </div>

            <div className="input-group">
              <label>Language</label>
              <select
                className="input-field"
                value={fixLanguage}
                onChange={(e) => setFixLanguage(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="php">PHP</option>
                <option value="react">React</option>
                <option value="nodejs">Node.js</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Fixing..." : "Fix Code"}
            </button>

            {fixedCode && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Fixed Code:</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(fixedCode)}
                    className="btn-primary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Copy
                  </button>
                </div>
                <pre style={{
                  padding: "1rem",
                  background: "#1e1e1e",
                  borderRadius: "8px",
                  overflowX: "auto",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: "#d4d4d4"
                }}>
                  {fixedCode}
                </pre>
              </div>
            )}
          </form>
        )}

        {activeTab === "api" && (
          <form onSubmit={handleApiConnect}>
            <div className="input-group">
              <label>Describe what API you want to connect</label>
              <textarea
                className="input-field"
                value={apiDesc}
                onChange={(e) => setApiDesc(e.target.value)}
                placeholder="e.g., Connect to a weather API and fetch temperature data..."
                rows={4}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="input-group">
              <label>Language</label>
              <select
                className="input-field"
                value={apiLanguage}
                onChange={(e) => setApiLanguage(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="php">PHP</option>
                <option value="react">React</option>
                <option value="nodejs">Node.js</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Generating Guide..." : "Get API Connect Guide"}
            </button>

            {apiGuide && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>API Guide:</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(apiGuide)}
                    className="btn-primary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Copy
                  </button>
                </div>
                <pre style={{
                  padding: "1rem",
                  background: "#1e1e1e",
                  borderRadius: "8px",
                  overflowX: "auto",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: "#d4d4d4",
                  whiteSpace: "pre-wrap"
                }}>
                  {apiGuide}
                </pre>
              </div>
            )}
          </form>
        )}

        {activeTab === "deploy" && (
          <form onSubmit={handleDeploy}>
            <div className="input-group">
              <label>Project Type</label>
              <select
                className="input-field"
                value={deployType}
                onChange={(e) => setDeployType(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="react">React</option>
                <option value="nextjs">Next.js</option>
                <option value="php">PHP</option>
                <option value="python">Python</option>
                <option value="nodejs">Node.js</option>
                <option value="html">HTML/CSS/JS</option>
              </select>
            </div>

            <div className="input-group">
              <label>Deploy To</label>
              <select
                className="input-field"
                value={deployPlatform}
                onChange={(e) => setDeployPlatform(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="vercel">Vercel</option>
                <option value="netlify">Netlify</option>
                <option value="heroku">Heroku</option>
                <option value="aws">AWS</option>
                <option value="local">Localhost</option>
                <option value="shared">Shared Hosting</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Generating Guide..." : "Get Deploy Guide"}
            </button>

            {deployGuide && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Deployment Guide:</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(deployGuide)}
                    className="btn-primary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Copy
                  </button>
                </div>
                <pre style={{
                  padding: "1rem",
                  background: "#1e1e1e",
                  borderRadius: "8px",
                  overflowX: "auto",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: "#d4d4d4",
                  whiteSpace: "pre-wrap"
                }}>
                  {deployGuide}
                </pre>
              </div>
            )}
          </form>
        )}

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href="/modules" style={{ color: "var(--primary)", textDecoration: "none" }}>
            ← Back to Modules
          </Link>
        </div>
      </div>
    </div>
  );
}
