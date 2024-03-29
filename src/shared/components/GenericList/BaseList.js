import { List } from "@material-ui/core";
import { forwardRef, useEffect, useState } from "react";
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

export const BaseList = ({ Item = DefaultItem } = {}) =>
  function GeneratedList({
    context,
    refreshOnFocus,
    updateItemMutation,
    deleteItemMutation,
    filterBy,
    items,
    itemIdField,
    itemProps,
    isSkeleton,
    loading,
    setEditingItem,
    sortBy,
  }) {
    const [, setUpdate] = useState(0);

    useEffect(() => {
      const refreshFn = () => setUpdate((e) => e + 1);
      if (refreshOnFocus) {
        window.addEventListener("focus", refreshFn);
        return () => window.removeEventListener("focus", refreshFn);
      }
    }, [setUpdate, refreshOnFocus]);

    if (loading)
      return (
        <List disablePadding dense>
          {[...Array(3)].map((_, idx) => (
            <Item
              context={context}
              updateItemMutation={updateItemMutation}
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
      .filter(filterBy)
      .sort(sortBy)
      .map((e) => (
        <Item
          context={context}
          deleteItemMutation={deleteItemMutation}
          updateItemMutation={updateItemMutation}
          itemIdField={itemIdField}
          key={e[itemIdField]}
          isSkeleton={isSkeleton}
          item={e}
          setEditingItem={setEditingItem}
          {...itemProps}
        />
      ));

    return (
      <StyledDiv>
        <Virtuoso
          totalCount={itemsArray.length}
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
