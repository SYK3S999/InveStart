"use client";

import * as React from "react";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => {
  return (
    <textarea
      className={`w-full px-4 py-3 border border-primary-200 rounded-lg bg-white text-primary-900 placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-y ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";