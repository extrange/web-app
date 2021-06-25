import {forwardRef, useEffect, useRef, useState} from "react";
import {Item} from "./item";
import {Virtuoso} from 'react-virtuoso/dist'
import {Fab, List} from "@material-ui/core";
import styled from 'styled-components'
import {useSelector} from "react-redux";
import {selectCurrentList} from "./listsSlice";
import {useGetItemsQuery} from "./listApi";
import AddIcon from "@material-ui/icons/Add";
import {EditItem} from "./EditItem";

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

const StyledDiv = styled.div`
  max-width: 800px;
  height: 100%;
`;

export const ListItems = ({setLoading}) => {

    const currentList = useSelector(selectCurrentList)
    const [editingItem, setEditingItem] = useState(null);
    const virtuosoRef = useRef();

    const {data: items} = useGetItemsQuery(currentList?.id, {skip: !currentList})

    useEffect(() => {
        if (!currentList) return;

        // Prevent virtuoso from remembering the scroll position of the previously viewed list
        if (virtuosoRef.current) {
            virtuosoRef.current.scrollToIndex({align: 'top', behavior: 'smooth'})
        }
        // eslint-disable-next-line
    }, [currentList]);

    if (!items) return null

    const list = items.map(e => <Item
        setEditingItem={setEditingItem}
        key={e.id}
        item={e}/>);

    return <>
        <StyledFab
            color={'primary'}
            onClick={() => setEditingItem({
                id: null,
                title: '',
                notes: '',
            })}>
            <AddIcon/>
        </StyledFab>

        {editingItem && <EditItem
            editingItem={editingItem}
            setLoading={setLoading}
            closeEdit={() => void setEditingItem(null)}/>}

        <StyledDiv>
            <Virtuoso
                ref={virtuosoRef}
                totalCount={items.length}
                itemContent={index => list[index]}
                components={{
                    List: forwardRef(({children, ...props}, listRef) =>
                        <List
                            {...props}
                            disablePadding
                            dense
                            ref={listRef}>
                            {children}
                        </List>)
                }}/>
        </StyledDiv>
    </>
};