import Link from "next/link";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { color, shadow, rounded } from "@/lib/type";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center px-4 md:px-6 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 hover:ring-2 hover:ring-offset-2 ring-offset-background transition-all focus-visible:outline-none focus-visible:hidden focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      color: {
        default: "bg-default text-default-foreground hover:bg-default/90 hover:ring-default dark:disabled:bg-default-500",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90  hover:ring-primary",
        secondary: "bg-secondary text-secondary-foreground  hover:ring-secondary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:ring-destructive",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 hover:ring-warning",
        info: "bg-info text-info-foreground hover:bg-info/90 hover:ring-info",
        success: "bg-success text-success-foreground hover:bg-success/90 hover:ring-success",
      },
      variant: {
        default: "",
        outline: "border border-default text-default bg-transparent hover:bg-default hover:text-default-foreground hover:ring-0 hover:ring-transparent",
        soft: "text-default bg-default/10 hover:bg-default  hover:text-default-foreground",
        ghost: "text-default bg-transparent hover:bg-default  hover:text-default-foreground hover:ring-0 hover:ring-transparent hover:ring-offset-0",
        shadow: "shadow-md",
      },
      shadow: {
        sm: "shadow",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
      },
      rounded: {
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
      size: {
        default: "h-11 md:px-6 px-4",
        sm: "h-7 text-xs md:px-4 px-3",
        md: "h-9",
        lg: "h-12 px-8 text-base md:px-10 px-7",
        icon: "h-10 w-10 p-0 md:px-0 flex justify-center items-center",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  color?: color;
  shadow?: shadow;
  rounded?: rounded;
  fullWidth?: boolean;
  size?: "default" | "sm" | "md" | "lg" | "icon";
  href?: string; // Add link property
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, color, fullWidth, shadow, rounded, asChild = false, href, ...props }, ref) => {
    const Comp = asChild ? Slot : href ? Link : "button"; // Use Link if href is provided

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, rounded, color, shadow, className }))}
        ref={ref}
        {...(href ? { href } : {})} // Pass href if Link is used
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
