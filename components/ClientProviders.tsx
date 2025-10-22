"use client";
import { ReactNode } from "react";
import { WhopIframeSdkProvider } from "@whop/react";

export default function ClientProviders({ children }: { children: ReactNode }) {
  // Minimal wrapper around Whop iframe SDK context
  return <WhopIframeSdkProvider>{children}</WhopIframeSdkProvider>;
}
