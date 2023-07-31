import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

interface Props {
  title: string;
  body: string;
  open: boolean;
  onOK: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = (props: Props) => {
  const { open, title, body, onOK, onCancel } = props;
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          キャンセル
        </Button>
        <Button onClick={onOK} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
