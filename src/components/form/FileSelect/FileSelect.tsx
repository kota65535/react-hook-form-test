import { Box, Button, FormHelperText, CircularProgress } from '@mui/material';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { FieldValues, UseFormReturn, FieldPath } from 'react-hook-form';
import { FileCard } from '@/components/common';
import { ChangeEvent, ReactNode, useState } from 'react';

interface Props<R extends FieldValues> {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  text?: string;
  icon?: ReactNode;
  accept?: string;
  baseUrl?: string;
  upload: (file: File) => Promise<string>;
}

export const FileSelect = <R extends FieldValues>(props: Props<R>) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = props.form;

  const formValue = watch(props.name);
  const [uploading, setUploading] = useState(false);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setUploading(true);
    let pathOrUrl = '';
    try {
      pathOrUrl = await props.upload(file);
    } finally {
      setUploading(false);
    }
    setValue(props.name, pathOrUrl as never, { shouldValidate: true });
  };
  const onDelete = () => {
    setValue(props.name, '' as never, { shouldValidate: true });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', height: '56px', alignItems: 'center' }}>
        <Button
          component="label"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} /> : props.icon ?? <FileIcon />}
        >
          {props.text ?? '選択'}
          <input onChange={onChange} accept={props.accept ?? '*/*'} type="file" hidden />
        </Button>
        <input {...register(props.name)} accept="*/*" hidden />
      </Box>
      {formValue && <FileCard url={props.baseUrl ? `${props.baseUrl}/${formValue}` : formValue} onClick={onDelete} />}
      <FormHelperText error={props.name in errors}>{errors[props.name]?.message as never}</FormHelperText>
    </Box>
  );
};
