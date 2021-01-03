import {forwardRef, useEffect, useRef, useState} from "react";
import {Item} from "./item/item";
import {EditTask} from "./item/editTask";
import {Networking} from "../../util";
import {getTasksUrl, getTaskUrl} from "../urls";
import {Virtuoso} from 'react-virtuoso/dist'
import {Fab, List} from "@material-ui/core";
import {Loading} from "../../components/loading";
import styled from 'styled-components'
import AddIcon from '@material-ui/icons/Add';

const StyledFab = styled(Fab)`
  position: fixed;
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

//todo move into urls as static methods
const [, add, update, del] = Networking.crudMethods(getTasksUrl, getTaskUrl);

export const Tasks = ({currentList, items, listItems}) => {

    const [editingTask, setEditingTask] = useState(null);

    const virtuosoRef = useRef();

    useEffect(() => {
        if (!currentList) return;
        listItems(currentList);

        // Prevent virtuoso from remembering the scroll position of the previously viewed list
        if (virtuosoRef.current) {
            virtuosoRef.current.scrollToIndex({align: 'top', behavior: 'smooth'})
        }
        // eslint-disable-next-line
    }, [currentList]);

    const createTask = (list, title, notes) => add({tasklist: list, title, notes}, list);

    const updateTask = (id, list, title, notes) => update({id, tasklist: list, title, notes}, id, list);

    const deleteTask = (id, list, prompt = true) => {
        if (prompt) {
            let decision = window.confirm('Delete item?');
            if (!decision) return;
        }
        return del(id, list)
            .then(() => listItems(currentList))
    };

    const closeEdit = () => void setEditingTask(null);

    const handleEditTask = (id, title, notes) => {
        setEditingTask({id, title, notes});
    };

    const handleCreateTask = () => void setEditingTask({
        id: null,
        title: '',
        notes: '',
    });


    const list = items.map(e => (
        <Item
            handleEditTask={() => handleEditTask(e.id, e.title, e.notes)}
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
            closeEdit={closeEdit}
            currentList={currentList}
            listItems={listItems}
            deleteTask={deleteTask}
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
                    </List>)
            }}/>
    </>
};