import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="w-full relative flex flex-col">
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={`
              flex h-11 w-full rounded-md border bg-zinc-950/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-500
              disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500' : 'border-zinc-800'}
              ${className || ''}
            `}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
