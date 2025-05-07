"use client";

import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => {
  return (
    <input
      className={`w-full px-4 py-3 border border-primary-200 rounded-lg bg-white text-primary-900 placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";