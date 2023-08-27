import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { ReactElement } from 'react';
import { SelectProps } from '@mui/material/Select/Select';

type LabeledValue = {
  label: string | ReactElement;
  value: string;
};

interface Props<R extends FieldValues> extends SelectProps {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  options: string[] | LabeledValue[];
  label?: string;
  disabled?: boolean;
}

export const DropdownSelect = <R extends FieldValues>(props: Props<R>) => {
  const { form, name, options, label, disabled, ...rest } = props;
  const { control } = form;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = field.value || '';
        return (
          <FormControl disabled={!!disabled} error={fieldState.invalid} fullWidth>
            <InputLabel id={name}>{label}</InputLabel>
            <Select labelId={name} label={label} {...field} value={value} {...rest}>
              {options.map((c) => {
                let value, label;
                if (c.constructor.name === 'String') {
                  value = label = c as string;
                } else {
                  value = (c as LabeledValue).value;
                  label = (c as LabeledValue).label;
                }
                return (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};
