"use client";

import dynamic from "next/dynamic";

const DocsContent = dynamic(() => import("./docs-content"), {
  ssr: false,
  loading: () => (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "3px solid var(--border)",
        borderTopColor: "var(--primary)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading documentation...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function DocsPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <DocsContent />
    </div>
  );
}