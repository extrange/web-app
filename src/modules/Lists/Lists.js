import { Button, CircularProgress, IconButton, List as MuiList, Typography } from "@material-ui/core";
import SyncIcon from '@material-ui/icons/Sync';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Loading } from "../../shared/components/Loading";
import { List } from "./List";
import { useCreateListMutation, useGetItemsQuery, useGetListsQuery } from "./listApi";
import { ListItems } from "./ListItems";
import { selectCurrentList, setCurrentList } from "./listsSlice";

const StyledButton = styled(Button)({
    margin: '10px',
});

export const Lists = ({ setDrawerContent, setTitleContent }) => {

    const dispatch = useDispatch()

    // There is a chance the listId stored is invalid - useEffect below checks for this
    const currentList = useSelector(selectCurrentList)

    const { data: lists, isFetching: isLoadingLists, refetch: refetchLists } = useGetListsQuery()
    const { isFetching: isFetchingGetItems, refetch: refetchItems } = useGetItemsQuery(currentList?.id, { skip: !currentList })
    const [createList] = useCreateListMutation()

    /*Show Lists in app-bar drawer*/

    useEffect(() => void setDrawerContent(<MuiList disablePadding dense>
        {isLoadingLists ?
            <div style={{ display: 'flex', 'justifyContent': 'center' }}>
                <CircularProgress size={20} />
            </div> :
            [
                <StyledButton
                    key={'CREATE_LIST'}
                    variant={'contained'}
                    color={'secondary'}
                    onClick={() => {
                        let title = prompt('Enter title:');
                        if (title) {
                            createList({ title })
                        }
                    }}>
                    Create new Tasklist
                </StyledButton>,

                lists?.map(list => <List
                    key={list.id}
                    list={list}
                    onClick={() => dispatch(setCurrentList(list))} />)
            ]}
    </MuiList>),
        [createList, dispatch, isLoadingLists, lists, setDrawerContent])

    useEffect(() => void setTitleContent(<>
        <Typography variant={"h6"} noWrap>
            {currentList?.title}
        </Typography>
        <IconButton
            onClick={() => {
                refetchLists()
                refetchItems()
            }}
            disabled={isFetchingGetItems}>
            <SyncIcon />
        </IconButton>
    </>), [currentList, isFetchingGetItems, refetchItems, refetchLists, setTitleContent])

    if (!currentList) return <Loading
        fullscreen={false}
        showSpinner={false}
        message={'Select a list'} />


    return <ListItems />
}
    ;
