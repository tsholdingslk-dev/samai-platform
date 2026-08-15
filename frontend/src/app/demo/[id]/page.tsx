import React from "react";
import DemoClient from "./DemoClient";

export async function generateStaticParams() {
  return [{ id: 'demo1' }, { id: 'default' }];
}

export default function Page() {
  return <DemoClient />;
}
