import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      primary: "bg-zinc-100 text-zinc-900 hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] focus:ring-zinc-200",
      secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus:ring-zinc-700",
      outline: "border border-zinc-700 text-zinc-100 hover:bg-zinc-800 focus:ring-zinc-700",
      ghost: "text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50 focus:ring-zinc-700"
    };

    const sizes = {
      sm: "h-9 px-3",
      md: "h-11 px-6",
      lg: "h-12 px-8 text-base"
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`;

    return (
      <button
        className={classes}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
