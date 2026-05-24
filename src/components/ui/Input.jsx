import React from "react";

export default function Input({ type = "text", className = "", ...rest }) {
  return (
    <input
      type={type}
      className={
        "px-3 py-2 border border-[var(--color-text)] bg-transparent text-[var(--color-text)] " +
        className
      }
      {...rest}
    />
  );
}

export { Input };
