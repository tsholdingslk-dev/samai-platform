"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

type Feedback = {
  average_rating: number;
  total_feedback: number;
  categories: Record<string, number>;
};

type Preferences = {
  preferences: Record<string, string>;
  prompt_modifiers: Record<string, any>;
  feedback_stats: Feedback;
};

export default function LearningPage() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [messageId, setMessageId] = useState("");
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [category, setCategory] = useState("quality");

  const [knowledgeSource, setKnowledgeSource] = useState("");
  const [knowledgeContent, setKnowledgeContent] = useState("");
  const [knowledgeMeta, setKnowledgeMeta] = useState("");

  const loadPreferences = async () => {
    try {
      const data = await apiFetch("/learning/preferences");
      setPreferences(data as Preferences);
    } catch {
      // ignore
    }
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("message_id", messageId || `msg-${Date.now()}`);
      formData.append("rating", String(rating));
      formData.append("feedback_text", feedbackText);
      formData.append("category", category);

      await apiFetch("/learning/feedback", {
        method: "POST",
        body: formData,
      });

      setFeedbackText("");
      setMessageId("");
      setRating(5);
      await loadPreferences();
      alert("Feedback submitted! SAM AI will learn from this.");
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("source", knowledgeSource);
      formData.append("content", knowledgeContent);
      formData.append("metadata", knowledgeMeta);

      await apiFetch("/learning/knowledge", {
        method: "POST",
        body: formData,
      });

      setKnowledgeSource("");
      setKnowledgeContent("");
      setKnowledgeMeta("");
      alert("Knowledge added to your personal brain!");
    } catch (err: any) {
      setError(err.message || "Failed to add knowledge");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <div className="page-container">
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "1000px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧠 Self Learning AI</h1>
          <p style={{ color: "var(--text-muted)" }}>
            SAM AI learns from your feedback and adapts to your preferences
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Feedback Section */}
          <div style={{
            padding: "1.5rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "12px",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>📝 Submit Feedback</h3>
            <form onSubmit={handleFeedback}>
              <div className="input-group">
                <label>Message ID (optional)</label>
                <input
                  type="text"
                  className="input-field"
                  value={messageId}
                  onChange={(e) => setMessageId(e.target.value)}
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div className="input-group">
                <label>Rating: {rating} / 5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="input-group">
                <label>Category</label>
                <select
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ color: "var(--text-main)" }}
                >
                  <option value="quality">Quality</option>
                  <option value="speed">Speed</option>
                  <option value="accuracy">Accuracy</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>

              <div className="input-group">
                <label>Feedback Text</label>
                <textarea
                  className="input-field"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell SAM AI what to improve..."
                  rows={2}
                  style={{ resize: "vertical" }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>

          {/* Knowledge Section */}
          <div style={{
            padding: "1.5rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "12px",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>📚 Add Knowledge</h3>
            <form onSubmit={handleAddKnowledge}>
              <div className="input-group">
                <label>Source</label>
                <input
                  type="text"
                  className="input-field"
                  value={knowledgeSource}
                  onChange={(e) => setKnowledgeSource(e.target.value)}
                  placeholder="e.g., user_document, conversation, approved_data"
                  required
                />
              </div>

              <div className="input-group">
                <label>Content</label>
                <textarea
                  className="input-field"
                  value={knowledgeContent}
                  onChange={(e) => setKnowledgeContent(e.target.value)}
                  placeholder="Paste or type the knowledge content..."
                  rows={4}
                  required
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="input-group">
                <label>Metadata (optional JSON)</label>
                <input
                  type="text"
                  className="input-field"
                  value={knowledgeMeta}
                  onChange={(e) => setKnowledgeMeta(e.target.value)}
                  placeholder='e.g., {"type": "pdf", "project": "xyz"}'
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
                {loading ? "Adding..." : "Add to Knowledge Base"}
              </button>
            </form>
          </div>

          {/* Stats Section */}
          {preferences && (
            <div style={{
              padding: "1.5rem",
              background: "rgba(99, 102, 241, 0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(99, 102, 241, 0.3)"
            }}>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>📊 Learning Stats</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Average Rating</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--primary)" }}>
                    {preferences.feedback_stats.average_rating || 0} / 5
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Feedback</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--primary)" }}>
                    {preferences.feedback_stats.total_feedback || 0}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Learned Preferences</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "600", color: "var(--primary)" }}>
                    {Object.keys(preferences.preferences).length}
                  </p>
                </div>
              </div>

              {Object.keys(preferences.preferences).length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h4 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>Active Preferences</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {Object.entries(preferences.preferences).map(([key, value]) => (
                      <span key={key} style={{
                        padding: "0.4rem 0.8rem",
                        background: "var(--bg-chat-user)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        border: "1px solid var(--border)"
                      }}>
                        <strong>{key}:</strong> {String(value)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
