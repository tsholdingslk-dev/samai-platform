"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

type Tab = "social" | "image" | "video" | "resize";

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<Tab>("social");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // Social prompt state
  const [socialPlatform, setSocialPlatform] = useState("facebook");
  const [socialContentType, setSocialContentType] = useState("post");
  const [socialTopic, setSocialTopic] = useState("");
  const [socialTone, setSocialTone] = useState("professional");
  const [socialContent, setSocialContent] = useState("");

  // Image prompt state
  const [imageDesc, setImageDesc] = useState("");
  const [imageStyle, setImageStyle] = useState("photorealistic");
  const [imagePrompt, setImagePrompt] = useState("");

  // Video prompt state
  const [videoDesc, setVideoDesc] = useState("");
  const [videoDuration, setVideoDuration] = useState("30s");
  const [videoStyle, setVideoStyle] = useState("cinematic");
  const [videoPrompt, setVideoPrompt] = useState("");

  // Resize state
  const [resizeOriginal, setResizeOriginal] = useState("16:9");
  const [resizeTarget, setResizeTarget] = useState("9:16");
  const [resizePlatform, setResizePlatform] = useState("youtube");
  const [resizeGuide, setResizeGuide] = useState("");

  const handleSocialPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("platform", socialPlatform);
      formData.append("content_type", socialContentType);
      formData.append("topic", socialTopic);
      formData.append("tone", socialTone);
      formData.append("project_id", "");

      const data = await apiFetch("/media/social-prompt", {
        method: "POST",
        body: formData,
      });

      setSocialContent(data.content);
      setResult(`Generated ${data.platform} ${data.content_type} using ${data.provider}`);
    } catch (err: any) {
      setError(err.message || "Social prompt generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("description", imageDesc);
      formData.append("style", imageStyle);
      formData.append("project_id", "");

      const data = await apiFetch("/media/image-prompt", {
        method: "POST",
        body: formData,
      });

      setImagePrompt(data.prompt);
      setResult(`Generated image prompt using ${data.provider}`);
    } catch (err: any) {
      setError(err.message || "Image prompt generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("description", videoDesc);
      formData.append("duration", videoDuration);
      formData.append("style", videoStyle);
      formData.append("project_id", "");

      const data = await apiFetch("/media/video-prompt", {
        method: "POST",
        body: formData,
      });

      setVideoPrompt(data.prompt);
      setResult(`Generated video prompt using ${data.provider}`);
    } catch (err: any) {
      setError(err.message || "Video prompt generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResizeGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("original_format", resizeOriginal);
      formData.append("target_format", resizeTarget);
      formData.append("platform", resizePlatform);
      formData.append("project_id", "");

      const data = await apiFetch("/media/resize-guide", {
        method: "POST",
        body: formData,
      });

      setResizeGuide(data.guide);
      setResult(`Generated resize guide using ${data.provider}`);
    } catch (err: any) {
      setError(err.message || "Resize guide generation failed");
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
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎬 Media & Content</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Social media prompts, image/video generation, and media guides
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { key: "social", label: "Social Prompt" },
            { key: "image", label: "Image Prompt" },
            { key: "video", label: "Video Prompt" },
            { key: "resize", label: "Resize Guide" },
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

        {activeTab === "social" && (
          <form onSubmit={handleSocialPrompt}>
            <div className="input-group">
              <label>Platform</label>
              <select
                className="input-field"
                value={socialPlatform}
                onChange={(e) => setSocialPlatform(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter / X</option>
              </select>
            </div>

            <div className="input-group">
              <label>Content Type</label>
              <select
                className="input-field"
                value={socialContentType}
                onChange={(e) => setSocialContentType(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="post">Post</option>
                <option value="reel">Reel / Short</option>
                <option value="story">Story</option>
                <option value="thumbnail">Thumbnail</option>
              </select>
            </div>

            <div className="input-group">
              <label>Topic / Description</label>
              <textarea
                className="input-field"
                value={socialTopic}
                onChange={(e) => setSocialTopic(e.target.value)}
                placeholder="What do you want to post about?"
                rows={3}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="input-group">
              <label>Tone</label>
              <select
                className="input-field"
                value={socialTone}
                onChange={(e) => setSocialTone(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="funny">Funny</option>
                <option value="inspirational">Inspirational</option>
                <option value="promotional">Promotional</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Generating..." : "Generate Social Content"}
            </button>

            {socialContent && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Generated Content:</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(socialContent)}
                    className="btn-primary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Copy
                  </button>
                </div>
                <div style={{
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7"
                }}>
                  {socialContent}
                </div>
              </div>
            )}
          </form>
        )}

        {activeTab === "image" && (
          <form onSubmit={handleImagePrompt}>
            <div className="input-group">
              <label>Image Description</label>
              <textarea
                className="input-field"
                value={imageDesc}
                onChange={(e) => setImageDesc(e.target.value)}
                placeholder="Describe the image you want to generate..."
                rows={4}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="input-group">
              <label>Style</label>
              <select
                className="input-field"
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="photorealistic">Photorealistic</option>
                <option value="digital-art">Digital Art</option>
                <option value="anime">Anime</option>
                <option value="3d-render">3D Render</option>
                <option value="painting">Painting</option>
                <option value="cartoon">Cartoon</option>
                <option value="cyberpunk">Cyberpunk</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Generating..." : "Generate Image Prompt"}
            </button>

            {imagePrompt && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Image Prompt:</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(imagePrompt)}
                    className="btn-primary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Copy
                  </button>
                </div>
                <div style={{
                  padding: "1rem",
                  background: "#1e1e1e",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                  fontSize: "0.95rem"
                }}>
                  {imagePrompt}
                </div>
              </div>
            )}
          </form>
        )}

        {activeTab === "video" && (
          <form onSubmit={handleVideoPrompt}>
            <div className="input-group">
              <label>Video Description</label>
              <textarea
                className="input-field"
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                placeholder="Describe the video scene you want to generate..."
                rows={4}
                required
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Duration</label>
                <select
                  className="input-field"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  style={{ color: "var(--text-main)" }}
                >
                  <option value="15s">15 seconds</option>
                  <option value="30s">30 seconds</option>
                  <option value="60s">1 minute</option>
                  <option value="5min">5 minutes</option>
                </select>
              </div>

              <div className="input-group" style={{ flex: 1 }}>
                <label>Style</label>
                <select
                  className="input-field"
                  value={videoStyle}
                  onChange={(e) => setVideoStyle(e.target.value)}
                  style={{ color: "var(--text-main)" }}
                >
                  <option value="cinematic">Cinematic</option>
                  <option value="documentary">Documentary</option>
                  <option value="animation">Animation</option>
                  <option value="vlog">Vlog</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Generating..." : "Generate Video Prompt"}
            </button>

            {videoPrompt && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Video Prompt:</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(videoPrompt)}
                    className="btn-primary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Copy
                  </button>
                </div>
                <div style={{
                  padding: "1rem",
                  background: "#1e1e1e",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                  fontSize: "0.95rem"
                }}>
                  {videoPrompt}
                </div>
              </div>
            )}
          </form>
        )}

        {activeTab === "resize" && (
          <form onSubmit={handleResizeGuide}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Original Format</label>
                <select
                  className="input-field"
                  value={resizeOriginal}
                  onChange={(e) => setResizeOriginal(e.target.value)}
                  style={{ color: "var(--text-main)" }}
                >
                  <option value="16:9">16:9 (YouTube)</option>
                  <option value="9:16">9:16 (Shorts/Reels)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Instagram Feed)</option>
                </select>
              </div>

              <div className="input-group" style={{ flex: 1 }}>
                <label>Target Format</label>
                <select
                  className="input-field"
                  value={resizeTarget}
                  onChange={(e) => setResizeTarget(e.target.value)}
                  style={{ color: "var(--text-main)" }}
                >
                  <option value="16:9">16:9 (YouTube)</option>
                  <option value="9:16">9:16 (Shorts/Reels)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Instagram Feed)</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Platform</label>
              <select
                className="input-field"
                value={resizePlatform}
                onChange={(e) => setResizePlatform(e.target.value)}
                style={{ color: "var(--text-main)" }}
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">Twitter / X</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? "Generating..." : "Get Resize Guide"}
            </button>

            {resizeGuide && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Resize Guide:</label>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(resizeGuide)}
                    className="btn-primary"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Copy
                  </button>
                </div>
                <div style={{
                  padding: "1rem",
                  background: "#1e1e1e",
                  borderRadius: "8px",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.7",
                  fontSize: "0.95rem"
                }}>
                  {resizeGuide}
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
