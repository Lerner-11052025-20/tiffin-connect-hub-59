import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "input-premium",
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id || `floating-input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={type}
          id={inputId}
          placeholder=" "
          className={cn(
            "input-premium peer",
            error && "border-destructive/60 focus:ring-destructive/60",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",
              "transition-all duration-fast peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
              "peer-focus:top-2 peer-focus:-translate-y-full peer-focus:scale-75 peer-focus:text-primary",
              "peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:-translate-y-full peer-not-placeholder-shown:scale-75"
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-2 text-xs text-destructive font-medium">{error}</p>
        )}
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, icon, ...props }, ref) => (
    <div className="relative w-full">
      <input
        ref={ref}
        type="search"
        placeholder="Search..."
        className={cn(
          "input-premium pl-10",
          className
        )}
        {...props}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon || (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>
    </div>
  )
)
SearchInput.displayName = "SearchInput"

export { Input, FloatingInput, SearchInput }
