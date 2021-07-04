import { ListItemText } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

/* A skeleton with a line for title and notes */
export const ItemSkeleton = () => <ListItemText
  primary={<Skeleton animation={'wave'} width={'min(80%, 300px)'} />}
  secondary={<Skeleton animation={'wave'} width={'min(60%, 240px)'} />} />;
