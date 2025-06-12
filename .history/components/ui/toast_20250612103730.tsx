// components/ui/Toast.tsx
"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error"
  onClose: () => void
  className?: string
}

export function Toast({ message, type, onClose, className }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-md mx-auto ${
        type === "success"
          ? "bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300"
          : "bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300"
      } ${className}`}
    >
      {type === "success" ? (
        <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
      )}
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="إغلاق"
      >
        <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </button>
    </motion.div>
  )
}