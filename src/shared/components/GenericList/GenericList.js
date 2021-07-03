import { ListItem } from '@material-ui/core';
import { useState } from 'react';
import styled from 'styled-components';
import { theme } from './../../../app/theme';
import { AddButton } from './../AddButton';
import { BACKGROUND_COLOR } from './../backgroundScreen';
import { BaseItemEdit } from './BaseItemEdit';
import { BaseList } from './BaseList';


export const StyledListItem = styled(ListItem)`
  ::before {
    margin-left: -16px;
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    ${({ $hideBackground }) => $hideBackground ? '' : BACKGROUND_COLOR};
  }

  ${theme.breakpoints.up('md')} {
    ${({ $reserveSpace }) => $reserveSpace ? 'padding-right: 48px' : 'padding-right: 16px'};
  }
  
  .MuiListItem-container:hover & {
    padding-right: 48px;
    
    // Highlight entire item even when secondary action is hovered
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

/* Can't be passed as a default option, otherwise it will continuously trigger re-renders */
const DefaultItemEdit = BaseItemEdit({ name: '', notes: '' })

/**
 * Note: assumes API endpoints take objects as arguments
 * 
 * context: argument passed (via spread) to all query/mutation requests
 * defaultItemValues: Object containing all fields and their default values.
 * Used by BaseItemEdit to determine how many fields to render.
 * 
 * List: renderer for list and items.
 * ItemEdit: renderer for editing items. 
 * isItemEmpty: used by BaseItemEdit's useAutosave to determine if item should be deleted on close
 * itemIdField: field used by objects and api submission for id
 * isSkeleton: whether temporary object returned by api should be marked as a skeleton.
 * Passed to List 
 * 
 * 
 * */
export const GenericList = ({
  getItemsQuery,
  createItemMutation,
  updateItemMutation,
  deleteItemMutation,

  defaultItemValues,
  context,

  List = BaseList,
  ItemEdit = DefaultItemEdit,
  isItemEmpty = e => !e.name && !e.notes,
  itemIdField = 'id',
  isSkeleton = e => !!e.isSkeleton,
}) => {

  const { data: items, isFetching } = getItemsQuery(context)
  const [editingItem, setEditingItem] = useState(null)
  const loading = isFetching || !items

  return <>
    {!loading && <AddButton
      onClick={() => setEditingItem(defaultItemValues)} />}

    {editingItem && <ItemEdit
      editingItem={editingItem}
      closeEdit={() => void setEditingItem(null)}
      context={context}
      isItemEmpty={isItemEmpty}
      itemIdField={itemIdField}
      createItemMutation={createItemMutation}
      updateItemMutation={updateItemMutation}
      deleteItemMutation={deleteItemMutation} />}

    <List
      context={context}
      updateItemMutation={updateItemMutation}
      deleteItemMutation={deleteItemMutation}
      items={items}
      itemIdField={itemIdField}
      isSkeleton={isSkeleton}
      loading={loading}
      setEditingItem={setEditingItem}/>
  </>
}