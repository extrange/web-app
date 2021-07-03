import { List } from "@material-ui/core";
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { Virtuoso } from 'react-virtuoso/dist';
import styled from 'styled-components';
import { StyledListItem } from "../../shared/components/StyledListItem";
import {ItemSkeleton} from '../../shared/components/ItemSkeleton'
import { EditItem } from "./EditItem";
import { Item } from "./Item";
import { useGetItemsQuery } from "./listApi";
import { selectCurrentList } from "./listsSlice";
import { AddButton } from './../../shared/components/AddButton';

const StyledDiv = styled.div`
  max-width: 800px; 
  height: 100%; 
`;

export const ListItems = () => {

    const currentList = useSelector(selectCurrentList)
    const [editingItem, setEditingItem] = useState(null);
    const virtuosoRef = useRef();

    const { data: items, isFetching } = useGetItemsQuery(currentList?.id, { skip: !currentList })

    useEffect(() => {
        if (!currentList) return;

        // Prevent virtuoso from remembering the scroll position of the previously viewed list
        if (virtuosoRef.current) {
            virtuosoRef.current.scrollToIndex({ align: 'top', behavior: 'smooth' })
        }
        // eslint-disable-next-line
    }, [currentList]);

    if (isFetching) return <List
        disablePadding
        dense>
        {[...Array(3)].map(() => <StyledListItem>
            <ItemSkeleton />
        </StyledListItem>)}
    </List>

    const list = items.map(e => <Item
        setEditingItem={setEditingItem}
        key={e.id}
        item={e} />);

    return <>
        <AddButton
            onClick={() => setEditingItem({
                id: null,
                title: '',
                notes: '',
            })} />

        {editingItem && <EditItem
            editingItem={editingItem}
            closeEdit={() => void setEditingItem(null)} />}

        <StyledDiv>
            <Virtuoso
                ref={virtuosoRef}
                totalCount={items.length}
                itemContent={index => list[index]}
                components={{
                    List: forwardRef(({ children, ...props }, listRef) =>
                        <List
                            {...props}
                            disablePadding
                            dense
                            ref={listRef}>
                            {children}
                        </List>)
                }} />
        </StyledDiv>
    </>
};