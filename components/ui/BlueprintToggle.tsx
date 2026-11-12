"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Blueprint switch. Sets `data-blueprint` on <html>: the 3D engine reads it each
 * frame (ribbon becomes outlines), and CSS adds the grid. Remembered per browser.
 */
const KEY = "e2e-blueprint";
const EVENT = "e2e:blueprint";

function set(on: boolean) {
  document.documentElement.toggleAttribute("data-blueprint", on);
  try {
    localStorage.setItem(KEY, on ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
const getSnapshot = () => document.documentElement.hasAttribute("data-blueprint");
const getServerSnapshot = () => false;

export default function BlueprintToggle() {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    let saved = false;
    try {
      saved = localStorage.getItem(KEY) === "1";
    } catch {}
    if (saved) set(true);
  }, []);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => set(!on)}
      className="group flex min-h-11 items-center gap-2 text-cloud-muted transition-colors hover:text-cloud"
    >
      <span aria-hidden="true" className={`bp-switch ${on ? "is-on" : ""}`}>
        <span />
      </span>
      Blueprint
    </button>
  );
}
