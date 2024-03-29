import { Checkbox, FormControl, FormControlLabel, FormHelperText, Stack } from '@mui/material';
import { Controller, FieldValues, UseFormReturn, FieldPath, PathValue, Path } from 'react-hook-form';
import { ChangeEvent } from 'react';

type LabeledValue = {
  label: string;
  value: string;
};

type Props<R extends FieldValues> = {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  options: string[] | LabeledValue[];
  disabled?: boolean;
};

export const CheckboxSelect = <R extends FieldValues>(props: Props<R>) => {
  const { control, setValue } = props.form;

  return (
    <Controller
      control={control}
      name={props.name}
      defaultValue={[] as PathValue<R, Path<R>>}
      render={({ field, fieldState }) => {
        const formValue = (field.value || []) as string[];

        const onChange = (label: string) => (e: ChangeEvent<HTMLInputElement>) => {
          let newValue;
          if (e.target.checked) {
            newValue = [...formValue, label];
          } else {
            newValue = formValue.filter((v) => v !== label);
          }
          setValue(props.name, newValue as PathValue<R, Path<R>>, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
        };

        return (
          <FormControl disabled={!!props.disabled} error={fieldState.invalid}>
            <Stack direction="row">
              {props.options.map((c) => {
                let value, label: string;
                if (c.constructor.name === 'String') {
                  value = label = c as string;
                } else {
                  value = (c as LabeledValue).value;
                  label = (c as LabeledValue).label;
                }
                return (
                  <FormControlLabel
                    key={value}
                    label={label}
                    control={<Checkbox {...field} onChange={onChange(value)} checked={formValue.includes(value)} />}
                  />
                );
              })}
            </Stack>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};
