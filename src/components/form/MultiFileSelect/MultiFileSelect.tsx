import { Box, Button, CircularProgress, FormHelperText } from '@mui/material';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import _ from 'lodash';
import { ChangeEvent, useState } from 'react';
import { FileCard } from '@/components/common';

interface Props<R extends FieldValues> {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  upload: (file: File) => Promise<string>;
}

export const MultiFileSelect = <R extends FieldValues>(props: Props<R>) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = props.form;

  const formValue = (watch(props.name) || []) as string[];
  const [uploading, setUploading] = useState(false);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) {
      return;
    }
    setUploading(true);
    const files = _.range(fileList.length).map((i) => fileList[i]);
    let urls = [];
    try {
      urls = await Promise.all(files.map((f) => props.upload(f)));
    } finally {
      setUploading(false);
    }
    setValue(props.name, [...formValue, ...urls] as never, { shouldValidate: true });
  };

  const onDelete = (i: number) => () => {
    const newValue = [...formValue.slice(0, i), ...formValue.slice(i + 1)];
    setValue(props.name, newValue as never, { shouldValidate: true });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', height: '56px', alignItems: 'center' }}>
        <Button
          component="label"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : <FileIcon />}
        >
          Add
          <input onChange={onChange} accept="*/*" type="file" hidden multiple />
        </Button>
        <input {...register(`${props.name}` as never)} accept="*/*" hidden />
      </Box>
      {formValue.map((v, i) => (
        <FileCard key={v} url={v} onClick={onDelete(i)} />
      ))}
      <FormHelperText error={props.name in errors}>{errors[props.name]?.message as never}</FormHelperText>
    </Box>
  );
};
