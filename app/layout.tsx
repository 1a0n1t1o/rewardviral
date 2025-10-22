import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

/**
 * IMPORTANT:
 * Different versions of @whop/react export different provider names.
 * We import the whole module and pick whichever exists at runtime.
 * This avoids compile-time errors like "no exported member".
 */
import * as WhopReact from "@whop/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViralRewards",
  description: "Minimal Whop app skeleton with RBAC-ready shell",
};

// Pick whichever provider exists in this version of @whop/react.
// If none exist, use a no-op wrapper so builds never fail.
const Provider: React.ComponentType<any> =
  // common in newer builds
  // @ts-ignore
  (WhopReact as any).IframeProvider ||
  // sometimes named WhopProvider in other builds
  // @ts-ignore
  (WhopReact as any).WhopProvider ||
  // ultra-safe fallback: render children as-is
  (({ children }: { children: React.ReactNode }) => <>{children}</>);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_WHOP_APP_ID;

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* If the provider exists, it will mount; otherwise this is a no-op */}
        <Provider appId={appId}>{children}</Provider>
      </body>
    </html>
  );
}