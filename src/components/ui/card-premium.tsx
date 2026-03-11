import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "relative rounded-2xl transition-all duration-base overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-card/50 backdrop-blur-md border border-border/40 shadow-card hover:shadow-card-hover hover:-translate-y-1",
        glass: "glass shadow-card hover:shadow-card-hover hover:-translate-y-1",
        gradient: "bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 shadow-card hover:shadow-card-hover hover:-translate-y-1",
        elevated: "bg-card border border-border shadow-elevated hover:shadow-hero hover:-translate-y-2",
        flat: "bg-card border border-border shadow-xs hover:shadow-sm",
        minimal: "bg-transparent border border-border/40 hover:border-border/60",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105",
      },
      hover: {
        true: "transition-all duration-base hover:shadow-card-hover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, hover, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-2xl font-bold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
