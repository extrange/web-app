import { ListItemText } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

/* A skeleton with one line, such as for items without notes */
export const ListSkeleton = () => <ListItemText
  primary={<Skeleton animation={'wave'} width={'min(80%, 300px)'} />} />;
