"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

type Tab = "extract" | "translate";

export default function PDFTranslatePage() {
  const [activeTab, setActiveTab] = useState<Tab>("extract");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // Extract state
  const [extractFile, setExtractFile] = useState<File | null>(null);
  const [extractText, setExtractText] = useState("");

  // Translate state
  const [translateText, setTranslateText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("ta");
  const [translatedText, setTranslatedText] = useState("");

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractFile) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("file", extractFile);
      formData.append("project_id", "");

      const data = await apiFetch("/pdf-translate/extract-text", {
        method: "POST",
        body: formData,
      });

      setExtractText(data.text);
      setResult(`Extracted ${data.text.length} characters from ${data.filename}`);
    } catch (err: any) {
      setError(err.message || "Extraction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translateText.trim()) return;

    setLoading(true);
    setError("");
    setTranslatedText("");

    try {
      const formData = new FormData();
      formData.append("text", translateText);
      formData.append("source_lang", sourceLang);
      formData.append("target_lang", targetLang);
      formData.append("project_id", "");

      const data = await apiFetch("/pdf-translate/translate", {
        method: "POST",
        body: formData,
      });

      setTranslatedText(data.translated_text);
      setResult(`Translated from ${data.source_lang} to ${data.target_lang}`);
    } catch (err: any) {
      setError(err.message || "Translation failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="page-container">
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "900px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄 PDF & Translation</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Extract text from documents and translate between languages
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center" }}>
          <button
            onClick={() => setActiveTab("extract")}
            className="btn-primary"
            style={{
              background: activeTab === "extract" ? "var(--primary)" : "transparent",
              border: `2px solid var(--primary)`,
              color: activeTab === "extract" ? "white" : "var(--primary)"
            }}
          >
            Extract Text
          </button>
          <button
            onClick={() => setActiveTab("translate")}
            className="btn-primary"
            style={{
              background: activeTab === "translate" ? "var(--primary)" : "transparent",
              border: `2px solid var(--primary)`,
              color: activeTab === "translate" ? "white" : "var(--primary)"
            }}
          >
            Translate
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {result && <div style={{ color: "var(--success)", marginBottom: "1rem", textAlign: "center" }}>{result}</div>}

        {activeTab === "extract" && (
          <form onSubmit={handleExtract}>
            <div className="input-group">
              <label>Upload Document</label>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={(e) => setExtractFile(e.target.files?.[0] || null)}
                style={{ color: "var(--text-main)" }}
                required
              />
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                Supported: PDF, DOCX, TXT
              </p>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Extracting..." : "Extract Text"}
            </button>

            {extractText && (
              <div style={{ marginTop: "2rem" }}>
                <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>
                  Extracted Text:
                </label>
                <div style={{
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  maxHeight: "300px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  fontSize: "0.95rem",
                  lineHeight: "1.6"
                }}>
                  {extractText}
                </div>
              </div>
            )}
          </form>
        )}

        {activeTab === "translate" && (
          <form onSubmit={handleTranslate}>
            <div className="input-group">
              <label>Text to Translate</label>
              <textarea
                className="input-field"
                value={translateText}
                onChange={(e) => setTranslateText(e.target.value)}
                placeholder="Enter text to translate..."
                rows={4}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>From</label>
                <select
                  className="input-field"
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  style={{ color: "var(--text-main)" }}
                >
                  <option value="auto">Auto Detect</option>
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                  <option value="si">Sinhala</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <div className="input-group" style={{ flex: 1 }}>
                <label>To</label>
                <select
                  className="input-field"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  style={{ color: "var(--text-main)" }}
                >
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                  <option value="si">Sinhala</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Translating..." : "Translate"}
            </button>

            {translatedText && (
              <div style={{ marginTop: "2rem" }}>
                <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>
                  Translation:
                </label>
                <div style={{
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  whiteSpace: "pre-wrap",
                  fontSize: "1rem",
                  lineHeight: "1.6"
                }}>
                  {translatedText}
                </div>
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
