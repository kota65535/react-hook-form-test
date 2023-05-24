import { Box, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField } from '@mui/material';
import { Controller, FieldValues, FieldPath, UseFormReturn } from 'react-hook-form';
import { ChangeEvent, useState } from 'react';

type LabeledValue = {
  label: string;
  value: string;
};

interface Props<R extends FieldValues> {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  choices: string[] | LabeledValue[];
  disabled?: boolean;
  row?: boolean;
  freeFormatLabel?: string;
}

export const RadioSelect = <R extends FieldValues>(props: Props<R>) => {
  const { control, setValue } = props.form;
  const [enableFreeFormat, setEnableFreeFormat] = useState(false);
  const handleClick = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    if (value === props.freeFormatLabel) {
      setEnableFreeFormat(true);
      setValue(props.name, '' as never, { shouldValidate: true });
    } else {
      setEnableFreeFormat(false);
    }
  };

  return (
    <Controller
      control={control}
      name={props.name}
      defaultValue={'' as never}
      render={({ field, fieldState }) => {
        const value = field.value;
        const isFreeFormValue = value
          ? !props.choices.some((c) => (c as string) === value || (c as LabeledValue).value === value)
          : false;
        return (
          <FormControl disabled={!!props.disabled} fullWidth error={fieldState.invalid}>
            <RadioGroup row={props.row} value={value} onChange={handleClick}>
              {props.choices.map((c) => {
                if (c.constructor.name === 'String') {
                  c = c as string;
                  return <FormControlLabel key={c} {...field} value={c} control={<Radio />} label={c} />;
                }
                c = c as LabeledValue;
                return (
                  <FormControlLabel key={c.value} {...field} value={c.value} control={<Radio />} label={c.label} />
                );
              })}
              {props.freeFormatLabel && (
                <Box display="flex">
                  <FormControlLabel
                    key={props.freeFormatLabel}
                    {...field}
                    control={<Radio checked={enableFreeFormat || isFreeFormValue} />}
                    value={props.freeFormatLabel}
                    label={props.freeFormatLabel}
                  />
                  <TextField
                    {...field}
                    value={value}
                    error={!!fieldState.error}
                    sx={{ opacity: enableFreeFormat || isFreeFormValue ? 1 : 0 }}
                  />
                </Box>
              )}
            </RadioGroup>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};
