import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm";
    const errorStyles =
      "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500";
    const disabledStyles = "bg-gray-50 text-gray-500 cursor-not-allowed";

    const inputClasses = `
      ${baseStyles}
      ${error ? errorStyles : ""}
      ${disabled ? disabledStyles : ""}
      ${leftIcon ? "pl-10" : ""}
      ${rightIcon ? "pr-10" : ""}
      ${className}
    `;

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperTextId = helperText ? `${inputId}-helper` : undefined;
    const describedBy =
      [errorId, helperTextId].filter(Boolean).join(" ") || undefined;

    const inputProps = {
      ref,
      id: inputId,
      className: inputClasses,
      disabled,
      "aria-describedby": describedBy,
      ...props,
    };

    if (error) {
      inputProps["aria-invalid"] = "true";
    }

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          <input {...inputProps} />
          {rightIcon && (
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div
            className="mt-1 flex items-center text-sm text-red-600"
            id={errorId}
          >
            <AlertCircle className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500" id={helperTextId}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
