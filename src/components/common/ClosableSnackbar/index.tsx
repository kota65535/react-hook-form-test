import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar, Alert as MuiAlert, AlertColor, AlertProps } from '@mui/material';
import { SnackbarCloseReason } from '@mui/material/Snackbar/Snackbar';

interface Props {
  message: string;
  severity?: AlertColor;
  duration?: number;
  onClose: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert ref={ref} {...props} />;
});

export const ClosableSnackbar = ({ severity = 'error', duration = 5000, ...props }: Props) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (props.message) {
      setOpen(true);
    }
    return () => {
      setOpen(false);
    };
  }, [props.message]);

  const onClose = (e?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.onClose();
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert
        severity={severity}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};
