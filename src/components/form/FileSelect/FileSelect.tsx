import { Box, Button, FormHelperText, CircularProgress } from '@mui/material';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { FieldValues, UseFormReturn, FieldPath, Controller, PathValue, Path } from 'react-hook-form';
import { FileCard } from '@/components/common';
import { ChangeEvent, ReactNode, useRef, useState } from 'react';

const DEFAULT_TEXT = 'Select';
const DEFAULT_ICON = <FileIcon />;
const DEFAULT_ACCEPT = '*/*';

interface Props<R extends FieldValues> {
  form: UseFormReturn<R>;
  name: FieldPath<R>;
  text?: string;
  icon?: ReactNode;
  accept?: string;
  baseUrl?: string;
  upload: (file: File) => Promise<string>;
  delete: (key: string) => Promise<void>;
}

export const FileSelect = <R extends FieldValues>(props: Props<R>) => {
  const { control, setValue } = props.form;
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setUploading(true);
    let key = '';
    try {
      key = await props.upload(file);
    } finally {
      setUploading(false);
    }
    setValue(props.name, key as PathValue<R, Path<R>>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };
  const onDelete = (value: string) => () => {
    setValue(props.name, '' as PathValue<R, Path<R>>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    props.delete(value);
  };

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const value = field.value;
        const url = props.baseUrl ? [props.baseUrl, value].join('/') : value;
        return (
          <Box>
            {value ? ( //
              <FileCard url={url} onDelete={onDelete(value)} />
            ) : (
              <Button
                component="label"
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={20} /> : props.icon ?? DEFAULT_ICON}
              >
                {props.text ?? DEFAULT_TEXT}
                <input type="file" accept={props.accept ?? DEFAULT_ACCEPT} ref={inputRef} onChange={onChange} hidden />
              </Button>
            )}
            <FormHelperText error={fieldState.invalid}>{fieldState.error?.message as string}</FormHelperText>
          </Box>
        );
      }}
    />
  );
};
