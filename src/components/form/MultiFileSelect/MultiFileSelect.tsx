import { Box, Button, CircularProgress, FormHelperText } from '@mui/material';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import { Controller, FieldPath, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
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

export const MultiFileSelect = <R extends FieldValues>(props: Props<R>) => {
  const { control, setValue } = props.form;
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (value: string[]) => async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[e.target.files?.length - 1];
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
    const newValue = value.concat(key);
    setValue(props.name, newValue as PathValue<R, Path<R>>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  const onDelete = (value: string[], i: number) => async () => {
    const newValue = [...value.slice(0, i), ...value.slice(i + 1)];
    setValue(props.name, newValue as PathValue<R, Path<R>>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    props.delete(value[i]);
  };

  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field, fieldState }) => {
        const value = field.value as string[];
        const urls = props.baseUrl ? value.map((v) => [props.baseUrl, v].join('/')) : value;
        return (
          <Box>
            <Button
              component="label"
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : props.icon ?? DEFAULT_ICON}
            >
              {props.text ?? DEFAULT_TEXT}
              <input
                type="file"
                accept={props.accept ?? DEFAULT_ACCEPT}
                ref={inputRef}
                onChange={onChange(value)}
                hidden
                multiple
              />
            </Button>
            {urls.map((v, i) => (
              <FileCard key={v} url={v} onDelete={onDelete(value, i)} />
            ))}
            <FormHelperText error={fieldState.invalid}>{fieldState.error?.message as string}</FormHelperText>
          </Box>
        );
      }}
    />
  );
};
