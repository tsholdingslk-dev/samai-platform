import React from "react";
import ChatClient from "./ChatClient";

export async function generateStaticParams() {
  return [{ projectId: 'default' }, { projectId: 'main' }];
}

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = await params;
  return <ChatClient projectId={resolvedParams.projectId || "default"} />;
}
