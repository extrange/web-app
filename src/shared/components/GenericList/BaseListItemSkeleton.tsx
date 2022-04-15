import { nanoid } from "@reduxjs/toolkit";

/* Generates a skeleton, used by BaseListItem 
Has to be a function, or the id will not be unique*/
export const BaseListItemSkeleton = () => ({ isSkeleton: true, id: nanoid() });
