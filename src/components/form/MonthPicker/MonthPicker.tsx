import { Controller, FieldPath, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Box, FormHelperText } from '@mui/material';

type Props<R extends FieldValues> = MuiDatePickerProps<dayjs.Dayjs> & {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
};

export const MonthPicker = <R extends FieldValues>(props: Props<R>) => {
  const {
    form: { control, setValue },
    name,
    ...rest
  } = props;

  const handleChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setValue(name, value.format('YYYY-MM') as PathValue<R, Path<R>>);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = field.value;
        return (
          <Box>
            <MuiDatePicker
              value={value ? dayjs(value) : null}
              format={'YYYY/MM'}
              onChange={handleChange}
              views={['year', 'month']}
              {...rest}
            />
            <FormHelperText>{fieldState.error?.message as string}</FormHelperText>
          </Box>
        );
      }}
    />
  );
};
