import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

export interface IInputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  name?: string;
  hasError?: boolean;
  isOptional?: boolean;
}

const InputLabel = React.forwardRef<HTMLLabelElement, PropsWithChildren<IInputLabelProps>>(
  ({ className, children, name, isOptional, hasError, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={classNames(
          'font-normal text-m-body1 lg:text-d-body1',
          hasError ? 'text-[var(--color-error-main)]' : 'text-[var(--color-text-primary)]',
          className
        )}
        htmlFor={name}
        {...props}
      >
        {children}
        {isOptional && <span className="text-[var(--color-text-secondary)]"> (optional)</span>}
      </label>
    );
  }
);

InputLabel.displayName = 'InputLabel';

export default InputLabel;
