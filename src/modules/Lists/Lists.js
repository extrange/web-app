import {useEffect} from "react";
import {ListItems} from "./ListItems";
import {CircularProgress, IconButton, List, Typography} from "@material-ui/core";
import SyncIcon from '@material-ui/icons/Sync';
import {useDeleteItemMutation, useGetItemsQuery, useGetListsQuery} from "./listApi";
import {CreateTasklist} from "./createTasklist";
import {Tasklist} from "./tasklist";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentList, setCurrentList} from "./listsSlice";
import {Loading} from "../../shared/components/loading";
import { useState } from "react";


export const Lists = ({setDrawerContent, setTitleContent}) => {

    const dispatch = useDispatch()

    // There is a chance the listId stored is invalid - useEffect below checks for this
    const currentList = useSelector(selectCurrentList)

    const {data: lists, isFetching: isFetchingLists} = useGetListsQuery()
    const {isFetching: isFetchingItems, refetch: refetchItems} = useGetItemsQuery(currentList?.id, {skip: !currentList})

    const [loading, setLoading] = useState(false)
    const allLoading = isFetchingLists || isFetchingItems || loading

    /*Show Lists in app-bar drawer*/

    useEffect(() => void setDrawerContent(<List disablePadding dense>
            {isFetchingLists ?
                'Loading...' :
                [
                    <CreateTasklist
                        key={0}
                        promptCreateTasklist={() => {
                            let title = prompt('Enter title:');
                            if (title) {
                                // createTasklist(title).then(() => setDrawerOpen(false));
                            }
                        }}
                    />,
                    lists?.map(e =>
                        (<Tasklist
                            key={e.id}
                            id={e.id}
                            value={e.title}
                            onClick={() => dispatch(setCurrentList(e))}
                            // handleDelete={() => deleteTasklist(e.id)}
                        />)
                    )
                ]}
        </List>),
        [dispatch, isFetchingLists, lists, setDrawerContent])

    /*Show app-bar loading and title*/
    useEffect(() => void setTitleContent(<>
        <Typography variant={"h6"} noWrap>{currentList?.title}</Typography>
        {allLoading ?
            <CircularProgress size={20} style={{margin: '12px'}}/> :
            (currentList && <IconButton onClick={refetchItems}><SyncIcon/></IconButton>)}
    </>), [currentList, allLoading, refetchItems, setTitleContent])

    if (!currentList) return <Loading
        fullscreen={false}
        showSpinner={false}
        message={'Select a list'}/>


    return <ListItems setLoading={setLoading}/>
}
;
