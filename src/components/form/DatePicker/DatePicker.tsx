import { Controller, FieldPath, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps, PickersDay } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Box, FormHelperText } from '@mui/material';

type Props<R extends FieldValues> = MuiDatePickerProps<dayjs.Dayjs> & {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
};

export const DatePicker = <R extends FieldValues>(props: Props<R>) => {
  const {
    form: { control, setValue },
    name,
    ...rest
  } = props;

  const handleChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setValue(name, value.format('YYYY-MM-DD') as PathValue<R, Path<R>>);
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
              format={'YYYY/MM/DD'}
              onChange={handleChange}
              slots={{
                day: (props1) => {
                  const day = props1.day;
                  const weekNumber = day.format('d');
                  switch (weekNumber) {
                    case '0':
                      return <PickersDay {...props1} sx={{ color: 'red' }} />;
                    case '6':
                      return <PickersDay {...props1} sx={{ color: 'blue' }} />;
                    default:
                      return <PickersDay {...props1} />;
                  }
                }
              }}
              {...rest}
            />
            <FormHelperText>{fieldState.error?.message as string}</FormHelperText>
          </Box>
        );
      }}
    />
  );
};
