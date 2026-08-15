"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { apiFetch } from "../../../utils/api";

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [textToSpeak, setTextToSpeak] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setIsRecording(false);
        };

        recognitionRef.current.onerror = () => {
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch {
          console.error("Speech recognition already started");
        }
      } else {
        alert("Your browser does not support Speech Recognition. Try Chrome or Edge.");
      }
    }
  };

  const handleTranscribeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("language", "en");
      formData.append("project_id", "");

      const data = await apiFetch("/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      setTranscript(data.text);
      setResult(`Transcribed: ${data.filename}`);
    } catch (err: any) {
      setError(err.message || "Transcription failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = () => {
    if (!textToSpeak.trim()) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
      setResult("Speaking...");
    } else {
      alert("Your browser does not support Text-to-Speech.");
    }
  };

  const handleTranslate = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    setError("");
    setTranslatedText("");

    try {
      const formData = new FormData();
      formData.append("text", transcript);
      formData.append("source_lang", "en");
      formData.append("target_lang", "ta");
      formData.append("project_id", "");

      const data = await apiFetch("/pdf-translate/translate", {
        method: "POST",
        body: formData,
      });

      setTranslatedText(data.translated_text);
      setResult("Translated to Tamil");
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
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎙️ Voice Workspace</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Transcribe audio, voice commands, and text-to-speech
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {result && <div style={{ color: "var(--success)", marginBottom: "1rem", textAlign: "center" }}>{result}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Voice Input Section */}
          <div style={{
            padding: "1.5rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "12px",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>🎤 Voice Input</h3>
            
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={toggleRecording}
                className={`mic-btn ${isRecording ? "recording" : ""}`}
                style={{
                  fontSize: "2rem",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: `2px solid ${isRecording ? "var(--error)" : "var(--primary)"}`
                }}
              >
                🎙️
              </button>

              <div style={{ flex: 1, minWidth: "200px" }}>
                <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>
                  Or upload audio file:
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleTranscribeFile}
                  style={{ color: "var(--text-main)" }}
                />
              </div>
            </div>

            {transcript && (
              <div style={{ marginTop: "1rem" }}>
                <label style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem", display: "block" }}>
                  Transcript:
                </label>
                <div style={{
                  padding: "1rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  minHeight: "60px"
                }}>
                  {transcript}
                </div>
                <button
                  type="button"
                  onClick={handleTranslate}
                  className="btn-primary"
                  style={{ marginTop: "1rem" }}
                  disabled={loading}
                >
                  {loading ? "Translating..." : "Translate to Tamil"}
                </button>
              </div>
            )}
          </div>

          {/* Text to Speech Section */}
          <div style={{
            padding: "1.5rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "12px",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>🔊 Text to Speech</h3>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <textarea
                className="input-field"
                value={textToSpeak}
                onChange={(e) => setTextToSpeak(e.target.value)}
                placeholder="Enter text to speak..."
                rows={3}
                style={{ flex: 1, resize: "vertical" }}
              />
              <button
                type="button"
                onClick={handleTextToSpeech}
                className="btn-primary"
                style={{ alignSelf: "flex-start" }}
                disabled={!textToSpeak.trim()}
              >
                Speak
              </button>
            </div>
          </div>

          {/* Translation Result */}
          {translatedText && (
            <div style={{
              padding: "1.5rem",
              background: "rgba(99, 102, 241, 0.1)",
              borderRadius: "12px",
              border: "1px solid rgba(99, 102, 241, 0.3)"
            }}>
              <h3 style={{ marginBottom: "0.5rem", fontSize: "1.1rem", color: "var(--primary)" }}>
                🇹🇭 Tamil Translation
              </h3>
              <div style={{
                padding: "1rem",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "8px",
                lineHeight: "1.7",
                fontSize: "1.1rem"
              }}>
                {translatedText}
              </div>
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
