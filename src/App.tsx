import { Box, Button, css, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CheckboxSelect, DropdownSelect, FileSelect, MultiFileSelect, RadioSelect } from './components/form';
import { TextField } from '@/components/common';
import { Storage } from '@aws-amplify/storage';
import { Checkbox } from '@/components/common/Checkbox';
import { DatePicker } from '@/components/form/DatePicker';
import dayjs from 'dayjs';

const rootStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const tableLabelStyle = css`
  width: 200px;
  padding: 16px 32px;
`;

const tableColumnStyle = css`
  padding: 16px 32px;
`;

interface FormInput {
  name: string;
  age: number;
  email: string;
  birth: string;
  file: string;
  files: string[];
  sex: string;
  hobbies: string[];
  married: boolean;
  smoking: string;
  birth2: string;
}

const DEFAULT_VALUES: FormInput = {
  name: 'aaa',
  age: 12,
  email: 'aaa@example.com',
  birth: '2000-01-02',
  file: 'public/a.txt',
  files: ['public/a.txt', 'public/b.txt'],
  sex: '男',
  hobbies: ['ゲーム', 'アウトドア'],
  married: true,
  smoking: '吸わない',
  birth2: '2000-01-03'
};

const schema = yup.object({
  name: yup.string().required(),
  age: yup.string().required(),
  email: yup.string().email().required(),
  birth: yup.string().required(),
  file: yup.string().required(),
  files: yup.array().of(yup.string().required()).required().min(1),
  hobbies: yup.array().of(yup.string().required()).required().min(2),
  married: yup.boolean().required(),
  smoking: yup.string().required(),
  birth2: yup.date().required()
});

function App() {
  const form = useForm<FormInput>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: DEFAULT_VALUES
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = form;

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    console.log(data);
    console.log(form.getValues());
  };

  console.log('errors', errors);
  console.log('values', form.getValues());

  return (
    <Box css={rootStyle}>
      <Box maxWidth="md">
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>名前</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <TextField fullWidth form={form} name="name" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>年齢</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <TextField fullWidth type="number" form={form} name="age" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>Eメール</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <TextField fullWidth type="email" form={form} name="email" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>生年月日</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <TextField fullWidth type="date" form={form} name="birth" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>ファイル</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <FileSelect
                        form={form}
                        name="file"
                        upload={async (file) => {
                          const res = await Storage.put(file.name, file);
                          return res.key;
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>複数ファイル</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <MultiFileSelect
                        form={form}
                        name="files"
                        upload={async (file) => {
                          const res = await Storage.put(file.name, file);
                          return res.key;
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>性別</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <RadioSelect form={form} name="sex" choices={['男', '女']} freeFormatLabel="その他" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>趣味</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <CheckboxSelect form={form} name="hobbies" choices={['漫画', 'ゲーム', '旅行', 'アウトドア']} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>既婚</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <Checkbox form={form} name={'married'} label="既婚" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>タバコ</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <DropdownSelect form={form} name="smoking" choices={['吸う', '吸わない']} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>日付</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <DatePicker form={form} name="birth2" minDate={dayjs('2000-01-15')} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              disabled={!isValid || isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              送信
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
