import { css, Dialog } from '@mui/material';

interface Props {
  file: File;
  open: boolean;
  onClose: () => void;
}

const imgStyle = css`
  object-fit: contain;
  width: 100%;
  height: 100%;
`;

export const ImageDialog = (props: Props) => {
  const url = URL.createObjectURL(props.file);
  return (
    <Dialog open={props.open} onClick={props.onClose} onClose={props.onClose}>
      <img src={url} css={imgStyle} alt={props.file.name} />
    </Dialog>
  );
};
