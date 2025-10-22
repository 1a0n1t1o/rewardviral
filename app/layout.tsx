import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { IframeSDKProvider } from "@whop/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ViralRewards",
  description: "Minimal Whop app skeleton with RBAC-ready shell",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <IframeSDKProvider>
          {children}
        </IframeSDKProvider>
      </body>
    </html>
  );
}