"use client";

import { useState } from "react";

export default function SafeSection({ children }: { children: React.ReactNode }) {
  const [err, setErr] = useState<Error | null>(null);

  if (err) {
    return (
      <div style={{ color: "crimson" }}>
        A client error occurred in this section. If you use an ad-blocker, allow
        <code> apps.whop.com </code> and reload.
      </div>
    );
  }

  return (
    <ErrorBoundary onError={setErr}>
      {children}
    </ErrorBoundary>
  );
}

function ErrorBoundary({
  children,
  onError,
}: {
  children: React.ReactNode;
  onError: (e: Error) => void;
}) {
  return (
    <Boundary
      onError={onError}
      fallback={
        <div style={{ color: "crimson" }}>
          Something went wrong in this section.
        </div>
      }
    >
      {children}
    </Boundary>
  );
}

// Minimal boundary implementation
class Boundary extends (require("react").Component as any) {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    this.props.onError?.(error);
  }
  render() {
    if ((this.state as any).hasError) return this.props.fallback;
    return this.props.children;
  }
}
