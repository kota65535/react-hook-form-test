import {
  Box,
  Button,
  css,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ja from 'yup-locale-ja';
import {
  CheckboxSelect,
  DropdownSelect,
  FileSelect,
  MultiFileSelect,
  RadioSelect,
  TextField
} from './components/form';
import { Storage } from '@aws-amplify/storage';
import { Checkbox } from 'src/components/form/Checkbox';
import { DatePicker } from '@/components/form/DatePicker';
import { MonthPicker } from '@/components/form/MonthPicker';
import { ComboboxSelect } from 'src/components/form/ComboboxSelect';

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
  description?: string;
  age: number;
  email: string;
  birth: string;
  birth2?: string;
  file: string;
  files: string[];
  sex?: string;
  hobbies: string[];
  married: boolean;
  smoking: string;
}

const DEFAULT_VALUES: FormInput = {
  name: 'aaa',
  description: 'this is description',
  age: 12,
  email: 'aaa@example.com',
  birth: '2000-01-02',
  file: 'public/a.txt',
  files: ['public/a.txt', 'public/b.txt'],
  sex: '',
  hobbies: ['ゲーム', 'アウトドア'],
  married: true,
  smoking: '吸わない'
};

yup.addMethod<yup.NumberSchema>(yup.number, 'required', function () {
  return this.transform((value, original) => (original === '' ? undefined : value)).notOneOf(
    [undefined],
    yup.defaultLocale.mixed?.required
  );
});

yup.setLocale(ja.suggestive);

const schema = yup.object({
  name: yup.string().required(),
  age: yup.number().required(),
  description: yup.string(),
  email: yup.string().email().required(),
  birth: yup.string().required(),
  birth2: yup.string(),
  file: yup.string().required(),
  files: yup.array().of(yup.string().required()).required().min(1),
  sex: yup.string(),
  hobbies: yup.array().of(yup.string().required()).required().min(2),
  married: yup.boolean().required(),
  smoking: yup.string().required()
});

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
  {
    label: 'The Lord of the Rings: The Return of the King',
    year: 2003
  },
  { label: 'The Good, the Bad and the Ugly', year: 1966 },
  { label: 'Fight Club', year: 1999 },
  {
    label: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001
  },
  {
    label: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980
  },
  { label: 'Forrest Gump', year: 1994 },
  { label: 'Inception', year: 2010 },
  {
    label: 'The Lord of the Rings: The Two Towers',
    year: 2002
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: 'Goodfellas', year: 1990 },
  { label: 'The Matrix', year: 1999 },
  { label: 'Seven Samurai', year: 1954 },
  {
    label: 'Star Wars: Episode IV - A New Hope',
    year: 1977
  },
  { label: 'City of God', year: 2002 },
  { label: 'Se7en', year: 1995 },
  { label: 'The Silence of the Lambs', year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: 'Life Is Beautiful', year: 1997 },
  { label: 'The Usual Suspects', year: 1995 },
  { label: 'Léon: The Professional', year: 1994 },
  { label: 'Spirited Away', year: 2001 },
  { label: 'Saving Private Ryan', year: 1998 },
  { label: 'Once Upon a Time in the West', year: 1968 },
  { label: 'American History X', year: 1998 },
  { label: 'Interstellar', year: 2014 },
  { label: 'Casablanca', year: 1942 },
  { label: 'City Lights', year: 1931 },
  { label: 'Psycho', year: 1960 },
  { label: 'The Green Mile', year: 1999 },
  { label: 'The Intouchables', year: 2011 },
  { label: 'Modern Times', year: 1936 },
  { label: 'Raiders of the Lost Ark', year: 1981 },
  { label: 'Rear Window', year: 1954 },
  { label: 'The Pianist', year: 2002 },
  { label: 'The Departed', year: 2006 },
  { label: 'Terminator 2: Judgment Day', year: 1991 },
  { label: 'Back to the Future', year: 1985 },
  { label: 'Whiplash', year: 2014 },
  { label: 'Gladiator', year: 2000 },
  { label: 'Memento', year: 2000 },
  { label: 'The Prestige', year: 2006 },
  { label: 'The Lion King', year: 1994 },
  { label: 'Apocalypse Now', year: 1979 },
  { label: 'Alien', year: 1979 },
  { label: 'Sunset Boulevard', year: 1950 },
  {
    label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964
  },
  { label: 'The Great Dictator', year: 1940 },
  { label: 'Cinema Paradiso', year: 1988 },
  { label: 'The Lives of Others', year: 2006 },
  { label: 'Grave of the Fireflies', year: 1988 },
  { label: 'Paths of Glory', year: 1957 },
  { label: 'Django Unchained', year: 2012 },
  { label: 'The Shining', year: 1980 },
  { label: 'WALL·E', year: 2008 },
  { label: 'American Beauty', year: 1999 },
  { label: 'The Dark Knight Rises', year: 2012 },
  { label: 'Princess Mononoke', year: 1997 },
  { label: 'Aliens', year: 1986 },
  { label: 'Oldboy', year: 2003 },
  { label: 'Once Upon a Time in America', year: 1984 },
  { label: 'Witness for the Prosecution', year: 1957 },
  { label: 'Das Boot', year: 1981 },
  { label: 'Citizen Kane', year: 1941 },
  { label: 'North by Northwest', year: 1959 },
  { label: 'Vertigo', year: 1958 },
  {
    label: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983
  },
  { label: 'Reservoir Dogs', year: 1992 },
  { label: 'Braveheart', year: 1995 },
  { label: 'M', year: 1931 },
  { label: 'Requiem for a Dream', year: 2000 },
  { label: 'Amélie', year: 2001 },
  { label: 'A Clockwork Orange', year: 1971 },
  { label: 'Like Stars on Earth', year: 2007 },
  { label: 'Taxi Driver', year: 1976 },
  { label: 'Lawrence of Arabia', year: 1962 },
  { label: 'Double Indemnity', year: 1944 },
  {
    label: 'Eternal Sunshine of the Spotless Mind',
    year: 2004
  },
  { label: 'Amadeus', year: 1984 },
  { label: 'To Kill a Mockingbird', year: 1962 },
  { label: 'Toy Story 3', year: 2010 },
  { label: 'Logan', year: 2017 },
  { label: 'Full Metal Jacket', year: 1987 },
  { label: 'Dangal', year: 2016 },
  { label: 'The Sting', year: 1973 },
  { label: '2001: A Space Odyssey', year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: 'Toy Story', year: 1995 },
  { label: 'Bicycle Thieves', year: 1948 },
  { label: 'The Kid', year: 1921 },
  { label: 'Inglourious Basterds', year: 2009 },
  { label: 'Snatch', year: 2000 },
  { label: '3 Idiots', year: 2009 },
  { label: 'Monty Python and the Holy Grail', year: 1975 }
];

function App() {
  const form = useForm<FormInput>({
    mode: 'onBlur',
    resolver: yupResolver<FormInput>(schema),
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
      <Box maxWidth="md" sx={{ mb: 8 }}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>テキストフィールド</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <Typography variant={'hoge'}>おおおお</Typography>
                      <TextField form={form} name="name" fullWidth />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>テキストフィールド(複数行)</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <TextField form={form} name="description" fullWidth multiline rows={4} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>テキストフィールド(Number)</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <TextField fullWidth type="number" form={form} name="age" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>テキストフィールド(Email)</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <TextField fullWidth type="email" form={form} name="email" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>テキストフィールド(Date)</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <TextField type="date" form={form} name="birth" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>Date Picker</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <DatePicker form={form} name="birth2" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>Date Picker</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <MonthPicker form={form} name="birth2" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>ファイル</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <Box width={300}>
                        <FileSelect
                          form={form}
                          name="file"
                          baseUrl={'https://order-contents-01.dev.musvi.jp/public'}
                          upload={async (file) => {
                            const res = await Storage.put(file.name, file);
                            return res.key;
                          }}
                          delete={async (key) => {
                            await Storage.remove(key);
                          }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>複数ファイル</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <MultiFileSelect
                        form={form}
                        name="files"
                        baseUrl={'https://order-contents-01.dev.musvi.jp/public'}
                        upload={async (file) => {
                          const res = await Storage.put(file.name, file);
                          return res.key;
                        }}
                        delete={async (key) => {
                          await Storage.remove(key);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>性別</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <RadioSelect form={form} name="sex" options={['男', '女']} freeFormatLabel="その他" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>趣味</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <CheckboxSelect form={form} name="hobbies" options={['漫画', 'ゲーム', '旅行', 'アウトドア']} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>既婚</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <Stack direction="row">
                        <Checkbox form={form} name={'married'} label="既婚" disabled />
                        <Checkbox form={form} name={'married'} label="既婚" />
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>タバコ</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <DropdownSelect form={form} name="smoking" label="喫煙" options={['吸う', '吸わない']} />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>タバコ</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <ComboboxSelect
                        form={form}
                        name="hobbies"
                        label="趣味"
                        options={['漫画', 'ゲーム', '旅行', 'アウトドア']}
                        multiple
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell css={tableLabelStyle}>タバコ</TableCell>
                    <TableCell css={tableColumnStyle}>
                      <ComboboxSelect form={form} name="smoking" options={['吸う', '吸わない']} freeSolo />
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
