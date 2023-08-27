import { Autocomplete, TextField } from '@mui/material';
import { Controller, FieldPath, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { AutocompleteProps } from '@mui/material/Autocomplete';

type LabeledValue = {
  label: string;
  value: string;
};

type Props<R extends FieldValues> = Omit<AutocompleteProps<string | LabeledValue, true, true, true>, 'renderInput'> & {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  label?: string;
};

export const ComboboxSelect = <R extends FieldValues>(props: Props<R>) => {
  const {
    form: { control, setValue },
    name,
    label,
    ...rest
  } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <Autocomplete
            {...rest}
            renderInput={(params) => (
              <TextField
                {...field}
                {...params}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                label={label}
              />
            )}
            onChange={(event, value) => {
              setValue(name, value as PathValue<R, Path<R>>);
            }}
          />
        );
      }}
    />
  );
};
