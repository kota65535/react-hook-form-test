import { ChangeEvent, useState, useRef, useEffect, FocusEvent } from 'react';
import { Box, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField } from '@mui/material';
import { Controller, FieldValues, FieldPath, UseFormReturn, PathValue, Path } from 'react-hook-form';

type LabeledValue = {
  label: string;
  value: string;
};

type Props<R extends FieldValues> = {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  options: string[] | LabeledValue[];
  disabled?: boolean;
  row?: boolean;
  freeFormatLabel?: string;
};

export const RadioSelect = <R extends FieldValues>(props: Props<R>) => {
  const { control, resetField, setValue } = props.form;
  const [enableFreeFormat, setEnableFreeFormat] = useState(false);
  const [enableError, setEnableError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    if (value === props.freeFormatLabel) {
      resetField(props.name);
      setEnableFreeFormat(true);
    } else {
      setValue(props.name, value as PathValue<R, Path<R>>);
      setEnableFreeFormat(false);
    }
    setEnableError(false);
  };

  useEffect(() => {
    if (enableFreeFormat) {
      inputRef.current?.focus();
    }
  }, [enableFreeFormat]);

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const value = field.value;
        const isFreeFormatValue = value
          ? !props.options.some((c) => (c as string) === value || (c as LabeledValue).value === value)
          : false;
        const handleTextFieldBlur = (e: FocusEvent<HTMLInputElement>) => {
          const relatedTarget = e.nativeEvent.relatedTarget;
          let enableError = true;
          if (
            (relatedTarget as HTMLInputElement)?.name === props.name ||
            ((relatedTarget as HTMLLabelElement)?.control as HTMLInputElement)?.name === props.name
          ) {
            enableError = false;
          }
          setEnableError(enableError);
          setValue(props.name, value, { shouldValidate: true });
        };
        return (
          <FormControl disabled={!!props.disabled} fullWidth error={enableError && fieldState.invalid}>
            <RadioGroup row={props.row} value={value} onChange={handleChange}>
              {props.options.map((c) => {
                if (c.constructor.name === 'String') {
                  c = c as string;
                  return <FormControlLabel key={c} {...field} value={c} control={<Radio />} label={c} tabIndex={0} />;
                }
                c = c as LabeledValue;
                return (
                  <FormControlLabel
                    key={c.value}
                    {...field}
                    value={c.value}
                    control={<Radio />}
                    label={c.label}
                    tabIndex={0}
                  />
                );
              })}
              {props.freeFormatLabel && (
                <Box display="flex">
                  <FormControlLabel
                    key={props.freeFormatLabel}
                    {...field}
                    control={<Radio checked={enableFreeFormat || isFreeFormatValue} />}
                    value={props.freeFormatLabel}
                    label={props.freeFormatLabel}
                  />
                  <TextField
                    {...field}
                    value={isFreeFormatValue ? field.value : ''}
                    inputRef={inputRef}
                    onBlur={handleTextFieldBlur}
                    error={enableError && !!fieldState.error}
                    disabled={!(enableFreeFormat || isFreeFormatValue)}
                  />
                </Box>
              )}
            </RadioGroup>
            <FormHelperText>{enableError && fieldState.error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};
