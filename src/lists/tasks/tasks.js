import {forwardRef, useEffect, useRef, useState} from "react";
import {Item} from "./item/item";
import {EditTask} from "./item/editTask";
import {Networking} from "../../util";
import {getTasksUrl, getTaskUrl} from "../urls";
import {Virtuoso} from 'react-virtuoso/dist'
import {Fab, List} from "@material-ui/core";
import {Loading} from "../../components/loading";
import {useAsyncError} from "../../components/useAsyncError";
import styled from 'styled-components'
import AddIcon from '@material-ui/icons/Add';

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

//todo move into urls as static methods
const [get, add, update, del] = Networking.crudMethods(getTasksUrl, getTaskUrl);

export const Tasks = ({currentList, setLoading}) => {

    const [editingTask, setEditingTask] = useState(null);
    const [items, setItems] = useState([]);

    const virtuosoRef = useRef();
    const setError = useAsyncError();

    //todo use Abort controller to cancel requests
    const listItems = list => {
        setLoading(true);
        get(list).then(result => {
            setLoading(false);
            setItems(result);
        }).catch(e => setError(e));
    };

    useEffect(() => {
        if (!currentList) return;
        listItems(currentList);

        // Prevent virtuoso from remembering the scroll position of the previously viewed list
        if (virtuosoRef.current) {
            virtuosoRef.current.scrollToIndex({align: 'top', behavior: 'smooth'})
        }
        // eslint-disable-next-line
    }, [currentList]);

    const createTask = (list, title, notes) => {
        add({tasklist: list, title, notes}, list)
            .then(() => {
                // Close editing item dialog
                setEditingTask(null);
                listItems(list)
            })
    };

    const updateTask = (id, list, title, notes) => {
        update({id, tasklist: list, title, notes}, id, list)
            .then(result => {
                // Close editing item dialog
                setEditingTask(null);
                listItems(list)
            });
    };

    const deleteTask = (id, list) => {
        let decision = window.confirm('Delete item?');
        if (!decision) return;
        del(id, list)
            .then(result => listItems(list))
    };

    const onCancelEdit = () => {
        setEditingTask(null);
    };

    const handleEditTask = (id, list, title, notes) => {
        setEditingTask({id, list, title, notes});
    };

    const handleCreateTask = (list) => {
        setEditingTask({
            id: null,
            list: list,
            title: '',
            notes: '',
        });
    };

    const list = items.map(e => (
        <Item
            handleEditTask={() => handleEditTask(e.id, e.tasklist, e.title, e.notes)}
            deleteTask={() => deleteTask(e.id, e.tasklist)}
            key={e.id}
            task={e}/>
    ));


    if (!currentList) return <Loading
        fullscreen={false}
        showSpinner={false}
        message={'Select a tasklist'}/>;

    return <>
        <StyledFab color={'primary'} onClick={() => handleCreateTask(currentList)}>
            <AddIcon/>
        </StyledFab>
        {editingTask && <EditTask
            editingTask={editingTask}
            updateTask={updateTask}
            createTask={createTask}
            onCancelEdit={onCancelEdit}
        />}
        <Virtuoso
            ref={virtuosoRef}
            totalCount={list.length}
            itemContent={index => list[index]}
            components={{
                List: forwardRef(({children, ...props}, listRef) =>
                    <List
                        {...props}
                        disablePadding
                        dense
                        ref={listRef}>
                        {children}
                    </List>
                )
            }}
        />
    </>
};