import React from "react";
import { X } from "lucide-react";

export default function Tag({ children, onRemove }) {
  return (
    <span
      className="text-[11px] uppercase tracking-[1px] px-2 py-1 border flex items-center gap-1.5"
      style={{ borderColor: "var(--color-text)", background: "transparent" }}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}
