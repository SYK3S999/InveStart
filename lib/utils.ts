// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add this function
export function calculateProgress(raised: number, goal: number): number {
  if (!goal || goal <= 0) return 0; // Avoid division by zero or negative goals
  const percentage = (raised / goal) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
}