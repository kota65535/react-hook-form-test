import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps, PickersDay } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FormHelperText } from '@mui/material';

type Props<R extends FieldValues> = {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  holidays?: Set<string>;
} & MuiDatePickerProps<dayjs.Dayjs>;

export const DatePicker = <R extends FieldValues>(props: Props<R>) => {
  const {
    form: {
      watch,
      setValue,
      formState: { errors }
    },
    name,
    holidays,
    ...rest
  } = props;
  const value = watch(props.name);

  const handleChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setValue(name, value.format('YYYY-MM-DD') as any);
    }
  };

  return (
    <>
      <MuiDatePicker
        value={dayjs(value)}
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
        shouldDisableDate={(day) => {
          const weekNumber = day.format('d');
          const isWeekend = () => weekNumber === '0' || weekNumber === '6';
          const isHoliday = () => (holidays ? holidays.has(day.format('YYYY-MM-DD')) : false);
          return isWeekend() || isHoliday();
        }}
        {...rest}
      />
      <FormHelperText>{errors[name]?.message as string}</FormHelperText>
    </>
  );
};
