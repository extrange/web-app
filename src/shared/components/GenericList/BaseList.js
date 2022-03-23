import { List } from "@material-ui/core";
import { forwardRef } from "react";
import { Virtuoso } from "react-virtuoso/dist";
import styled from "styled-components";
import { BaseListItem } from "./BaseListItem";

const StyledDiv = styled.div`
  max-width: 800px;
  height: 100%;
`;

const DefaultItem = BaseListItem({
  primaryTextKey: "name",
  secondaryTextKey: "notes",
});

export const BaseList =
  ({ Item = DefaultItem } = {}) =>
  ({
    context,
    deleteItemMutation,
    items,
    itemIdField,
    isSkeleton,
    loading,
    setEditingItem,
    sortBy,
  }) => {
    if (loading)
      return (
        <List disablePadding dense>
          {[...Array(3)].map((_, idx) => (
            <Item
              context={context}
              deleteItemMutation={deleteItemMutation}
              itemIdField={itemIdField}
              key={idx}
              isSkeleton={() => true}
              setEditingItem={setEditingItem}
            />
          ))}
        </List>
      );

    const itemsArray = [...items]
      .sort(sortBy)
      .map((e) => (
        <Item
          context={context}
          deleteItemMutation={deleteItemMutation}
          itemIdField={itemIdField}
          key={e[itemIdField]}
          isSkeleton={isSkeleton}
          item={e}
          setEditingItem={setEditingItem}
        />
      ));

    return (
      <StyledDiv>
        <Virtuoso
          totalCount={items.length}
          itemContent={(idx) => itemsArray[idx]}
          components={{
            List: forwardRef(({ children, ...props }, ref) => (
              <List disablePadding dense ref={ref} {...props}>
                {children}
              </List>
            )),
          }}
        />
      </StyledDiv>
    );
  };
