"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ChatClient from "./chat/ChatClient";
import ChatLayout from "./chat/layout";

function HomeChatContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project") || searchParams.get("id") || "default";

  return (
    <ChatLayout>
      <ChatClient projectId={projectId} />
    </ChatLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", color: "var(--text-muted)", textAlign: "center" }}>Loading SAM AI...</div>}>
      <HomeChatContent />
    </Suspense>
  );
}
