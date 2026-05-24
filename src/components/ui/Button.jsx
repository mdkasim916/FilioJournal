import React from "react";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) {
  const variantClass =
    variant === "primary"
      ? "btn-primary"
      : variant === "outline"
        ? "btn-outline"
        : "btn-ghost";

  const sizeClass =
    size === "sm"
      ? "text-sm px-3 py-1"
      : size === "lg"
        ? "text-base px-6 py-3"
        : "text-sm px-4 py-2";

  // special large primary (action header) if explicitly requested
  const primaryLarge =
    variant === "primary" && rest.primaryLarge ? "btn-primary-large" : null;

  const classes = cx(primaryLarge, variantClass, "btn", sizeClass, className);

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export { Button };
