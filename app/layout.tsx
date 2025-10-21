export const metadata = { title: "Viral Rewards", description: "Minimal skeleton for RBAC setup" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui, Arial" }}>{children}</body>
    </html>
  );
}