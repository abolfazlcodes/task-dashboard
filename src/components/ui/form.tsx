import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface IFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
  customClasses?: {
    fieldsetWrapper?: string;
  };
}

const Form: React.FC<IFormProps> = ({ children, customClasses, disabled, className, ...props }) => {
  return (
    <form
      {...props}
      className={twMerge(className, 'w-full')}
      data-testid="cy-form"
    >
      <fieldset
        disabled={disabled}
        className={twMerge('space-y-4', customClasses?.fieldsetWrapper)}
      >
        {children}
      </fieldset>
    </form>
  );
};

export default Form;
