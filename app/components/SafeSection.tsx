"use client";

import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class SafeSection extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Keep logs out of prod noise but useful during debugging
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("SafeSection caught error:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "crimson" }}>
          A client error occurred in this section. If you use an ad-blocker,
          allow <code>apps.whop.com</code> and reload.
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
