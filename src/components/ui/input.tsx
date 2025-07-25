import React from 'react';

export type TInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  errorText?: string;
};

const FormInput = React.forwardRef<HTMLInputElement, TInputProps>(
  ({ hasError, errorText, className, ...rest }, ref) => {
    return (
      <>
        <input
          ref={ref}
          className={`w-full p-2 border rounded text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] ${className || ''} ${hasError ? 'border-red-500' : ''}`}
          {...rest}
        />
        {errorText && <span className="text-red-500 text-xs mt-1 block">{errorText}</span>}
      </>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
