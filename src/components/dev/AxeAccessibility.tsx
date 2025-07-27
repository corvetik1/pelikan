"use client";

import { useEffect } from "react";

export default function AxeAccessibility() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Dynamically import to avoid bundling in prod
    Promise.all([
      import("react"),
      import("react-dom"),
      import("@axe-core/react"),
    ]).then(([React, ReactDOM, axe]) => {
      axe.default(React, ReactDOM, 1000);
    });
  }, []);

  return null;
}
