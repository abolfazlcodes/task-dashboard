import type { Control, Path, FieldValues, RegisterOptions } from 'react-hook-form';
import { Controller, get } from 'react-hook-form';
import FormInput, { TInputProps } from '../ui/input';

interface IInputControllerProps<T extends FieldValues>
  extends Omit<TInputProps, 'value' | 'onChange'> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

const InputController = <T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: IInputControllerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, formState: { errors } }) => {
        const error = get(errors, name) as { message?: string };
        return (
          <FormInput
            {...field}
            {...props}
            disabled={props.disabled}
            hasError={!!error?.message || !!props?.errorText}
            errorText={error?.message ?? props?.errorText ?? ''}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
            }}
          />
        );
      }}
    />
  );
};

export default InputController;
