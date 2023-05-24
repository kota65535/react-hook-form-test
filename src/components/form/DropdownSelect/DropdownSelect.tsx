import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

type LabeledValue = {
  label: string;
  value: string;
};

interface Props<R extends FieldValues> {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  choices: string[] | LabeledValue[];
  label?: string;
  disabled?: boolean;
}

export const DropdownSelect = <R extends FieldValues>(props: Props<R>) => {
  const { control } = props.form;
  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const value = field.value || '';
        return (
          <FormControl disabled={!!props.disabled} fullWidth error={fieldState.invalid}>
            <InputLabel id={props.name}>{props.label}</InputLabel>
            <Select labelId={props.name} label={props.label} autoWidth {...field} value={value}>
              {props.choices.map((c) => {
                let value, label: string;
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
