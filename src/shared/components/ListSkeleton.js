import { ListItemText } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";


export const ListSkeleton = () => <ListItemText
  primary={<Skeleton animation={'wave'} width={'min(80%, 300px)'} />} />;
