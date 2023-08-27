import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

type Props<R extends FieldValues> = TextFieldProps & {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
};

export const TextField = <R extends FieldValues>(props: Props<R>) => {
  const { form, name, ...rest } = props;
  const {
    register,
    formState: { errors }
  } = form;

  return (
    <MuiTextField {...register(name)} error={name in errors} helperText={errors[name]?.message as string} {...rest} />
  );
};
