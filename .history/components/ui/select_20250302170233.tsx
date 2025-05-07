"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

export const Select = SelectPrimitive.Root;

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectPrimitive.SelectTriggerProps
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={`w-full px-4 py-3 border border-primary-200 rounded-lg bg-white text-primary-900 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 text-primary-500" />
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = SelectPrimitive.Value;

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectContentProps
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Content
    ref={ref}
    className={`bg-white border border-primary-200 rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto z-50 ${className}`}
    position="popper"
    {...props}
  >
    {children}
  </SelectPrimitive.Content>
));
SelectContent.displayName = "SelectContent";

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps
>(({ className = "", children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={`px-4 py-2 text-primary-900 hover:bg-primary-50 rounded-md cursor-pointer focus:outline-none focus:bg-primary-100 transition-colors duration-200 ${className}`}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";