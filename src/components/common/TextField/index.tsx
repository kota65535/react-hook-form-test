import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

type Props<R extends FieldValues> = {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
} & TextFieldProps;

export const TextField = <R extends FieldValues>(props: Props<R>) => {
  const {
    register,
    formState: { errors }
  } = props.form;
  return (
    <MuiTextField
      {...register(props.name)}
      error={props.name in errors}
      helperText={errors[props.name]?.message as string}
      {...props}
    />
  );
};
