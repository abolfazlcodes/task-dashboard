import React from 'react';

export interface BaseSelectBoxProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: React.ReactNode;
}

const BaseSelectBox = React.forwardRef<HTMLSelectElement, BaseSelectBoxProps>(
  ({ error, className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full p-2 border rounded bg-[var(--color-bg-paper)] text-[var(--color-text-primary)] ${error ? 'border-red-500' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </select>
  )
);

BaseSelectBox.displayName = 'BaseSelectBox';

export default BaseSelectBox;
