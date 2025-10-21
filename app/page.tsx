"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        textAlign: "center",
        padding: 24,
      }}
    >
      <h1 style={{ fontSize: 48, fontWeight: 700 }}>Viral Rewards</h1>
      <Link
        href="/dashboard"
        style={{
          padding: "12px 20px",
          borderRadius: 8,
          border: "1px solid #333",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Dashboard
      </Link>
      <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>
        Minimal skeleton — RBAC comes next.
      </p>
    </main>
  );
}