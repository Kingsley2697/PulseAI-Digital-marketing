"use client";

import { useEffect } from "react";

/** Registers the root-scoped worker used for offline shell support and installability. */
export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error: unknown) => {
      if (process.env.NODE_ENV === "development") console.warn("PWA service worker registration failed", error);
    });
  }, []);

  return null;
}
