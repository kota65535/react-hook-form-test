import { Avatar, Card, CardHeader, IconButton, Link } from '@mui/material';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  url: string;
  name?: string;
  onDelete: (name: string) => void;
}

export const FileCard = (props: Props) => {
  let pathname;
  try {
    pathname = new URL(props.url).pathname;
  } catch (e) {
    pathname = props.url;
  }
  const filename = props.name || pathname.split('/').pop() || pathname;

  const onClick = () => {
    props.onDelete(filename);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <FileIcon />
          </Avatar>
        }
        action={
          <IconButton onClick={onClick}>
            <DeleteIcon />
          </IconButton>
        }
        title={
          <Link href={props.url} target="_blank">
            {filename}
          </Link>
        }
      />
    </Card>
  );
};
