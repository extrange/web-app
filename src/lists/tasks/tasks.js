import React, {useEffect, useState} from "react";
import {Task} from "./task/task";
import {CreateTask} from "./task/createTask";
import {EditTask} from "./task/editTask";
import {Search} from './search'
import {Networking} from "../../util";
import {getTasksUrl, getTaskUrl} from "../urls";
import {Virtuoso} from 'react-virtuoso/dist'
import {matchSorter} from 'match-sorter'


export const Tasks = ({currentTasklist}) => {

    const [editingTask, setEditingTask] = useState(null);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [tasks, setTasks] = useState([]);


    const filterTasks = term => {
        if (!term) {
            setFilteredTasks(tasks);
        } else {
            let result = matchSorter(tasks, term, {keys: ['title', 'notes']});
            setFilteredTasks(result);
        }
    };

    //todo move into urls as static methods
    const [get, add, update, del] = Networking.crudMethods(getTasksUrl, getTaskUrl);

    //todo use Abort controller to cancel requests
    const listTasks = tasklist => {
        get(tasklist)
            .then(result => {
                //in slow networks, older requests may complete after newer ones.
                //This prevents the interface from reloading if that happens (effectively discarding the response)
                if (currentTasklist === tasklist) {
                    setTasks(result);
                    setFilteredTasks(result);
                }
            });
    };

    // eslint-disable-next-line
    useEffect(() => currentTasklist ? listTasks(currentTasklist) : undefined, [currentTasklist]);

    const createTask = (tasklist, title, notes) => {
        add({tasklist, title, notes}, tasklist)
            .then(result => {
                // Close editing task dialog
                setEditingTask(null);
                listTasks(tasklist)
            })
    };

    const updateTask = (id, tasklist, title, notes) => {
        update({id, tasklist, title, notes}, id, tasklist)
            .then(result => {
                // Close editing task dialog
                setEditingTask(null);
                listTasks(tasklist)
            });
    };

    const deleteTask = (id, tasklist) => {
        let decision = window.confirm('Delete task?');
        if (!decision) return;
        del(id, tasklist)
            .then(result => listTasks(tasklist))
    };

    const onCancelEdit = () => {
        setEditingTask(null);
        listTasks(currentTasklist);
    };

    const handleEditTask = (id, tasklist, title, notes) => {
        setEditingTask({id, tasklist, title, notes});
    };

    const handleCreateTask = (tasklist) => {
        setEditingTask({
            id: null,
            tasklist: tasklist,
            title: '',
            notes: '',
        });
    };

    let content;

    // User has not selected a tasklist/tasklists are loading
    if (currentTasklist === null) {
        content = <Task task={{title: 'Select a tasklist'}}/>;

    } else if (editingTask) {
        // User is either editing/creating a task (relevant parameters in editingTask)
        content = <EditTask
            editingTask={editingTask}
            updateTask={updateTask}
            createTask={createTask}
            onCancelEdit={onCancelEdit}
        />

    } else if (tasks) { //only render if lists have been loaded

        let createTask = <CreateTask
            key={0}
            createTask={() => handleCreateTask(currentTasklist)}
        />;

        let search = <Search
            key={1}
            filter={term => filterTasks(term)}
        />;

        let taskslist = filteredTasks.map(e => (
            <Task
                handleEditTask={() => handleEditTask(e.id, e.tasklist, e.title, e.notes)}
                deleteTask={() => deleteTask(e.id, e.tasklist)}
                key={e.id}
                task={e}/>
        ));

        let items = [createTask, search, ...taskslist];

        content = <Virtuoso
            totalCount={items.length}
            itemContent={index => items[index]}
        />

    }
    return content;

};
