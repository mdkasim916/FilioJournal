import React from "react";

export default function Tag({ children }) {
  return (
    <span
      className="text-[11px] uppercase tracking-[1px] px-2 py-1 border"
      style={{ borderColor: "var(--color-text)", background: "transparent" }}
    >
      {children}
    </span>
  );
}
