import { Checkbox as MuiCheckbox, CheckboxProps, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import { Controller, FieldPath, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { ChangeEvent } from 'react';

type Props<R extends FieldValues> = Omit<CheckboxProps, 'form'> & {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  label: string;
};

export const Checkbox = <R extends FieldValues>(props: Props<R>) => {
  const { control, setValue } = props.form;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(props.name, event.target.checked as PathValue<R, Path<R>>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        return (
          <FormControl disabled={!!props.disabled} error={fieldState.invalid}>
            <FormControlLabel
              label={props.label}
              control={<MuiCheckbox checked={field.value} onChange={handleChange} />}
            />
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};
