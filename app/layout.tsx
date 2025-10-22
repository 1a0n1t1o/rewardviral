import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WhopProvider } from "@whop/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViralRewards",
  description: "Minimal Whop app skeleton with RBAC-ready shell",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Whop iframe SDK provider */}
        <WhopProvider appId={process.env.NEXT_PUBLIC_WHOP_APP_ID!}>
          {children}
        </WhopProvider>
      </body>
    </html>
  );
}