import { Checkbox as MuiCheckbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { ChangeEvent } from 'react';

interface Props<R extends FieldValues> {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  label: string;
  disabled?: boolean;
}

export const Checkbox = <R extends FieldValues>(props: Props<R>) => {
  const {
    watch,
    setValue,
    formState: { errors }
  } = props.form;
  const value = watch(props.name);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(props.name, event.target.checked as any);
  };

  return (
    <FormControl disabled={!!props.disabled} fullWidth error={props.name in errors}>
      <FormControlLabel label={props.label} control={<MuiCheckbox checked={value} onChange={handleChange} />} />
      <FormHelperText>{errors[props.name]?.message as string}</FormHelperText>
    </FormControl>
  );
};
