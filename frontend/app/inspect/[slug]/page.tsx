"use client";

import { use } from "react";
import { InspectorShell } from "@/components/inspector/InspectorShell";

export default function InspectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <InspectorShell slug={slug} />;
}