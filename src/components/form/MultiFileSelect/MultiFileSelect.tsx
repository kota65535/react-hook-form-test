import { Box, Button, CircularProgress, FormHelperText } from '@mui/material';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import _ from 'lodash';
import { ChangeEvent, ReactNode, useState } from 'react';
import { FileCard } from '@/components/common';

interface Props<R extends FieldValues> {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  text?: string;
  icon?: ReactNode;
  accept?: string;
  baseUrl?: string;
  upload: (file: File) => Promise<string>;
}

const isError = (errors: any, name: string) => {
  if (name in errors) {
    return true;
  }
  const [a, i, b] = name.split('.');
  return !!(a && i && b && errors[a]?.[parseInt(i)]?.[b]);
};

const getErrorMessage = (errors: any, name: string) => {
  const ret = errors[name]?.message;
  if (ret) {
    return ret;
  }

  const [a, i, b] = name.split('.');
  return a && i && b && errors[a]?.[parseInt(i)]?.[b]?.message;
};

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
          startIcon={uploading ? <CircularProgress size={20} /> : props.icon ?? <FileIcon />}
        >
          {props.text ?? '追加'}
          <input onChange={onChange} accept={props.accept ?? '*/*'} type="file" hidden multiple />
        </Button>
        <input {...register(`${props.name}` as never)} accept="*/*" hidden />
      </Box>
      {formValue.map((v, i) => (
        <FileCard key={v} url={props.baseUrl ? `${props.baseUrl}/${v}` : v} onClick={onDelete(i)} />
      ))}
      <FormHelperText error={isError(errors, props.name)}>
        {getErrorMessage(errors, props.name) as never}
      </FormHelperText>
    </Box>
  );
};
