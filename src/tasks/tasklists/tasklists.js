import React from "react";
import {CreateTasklist} from "./tasklist/createTasklist";
import {Tasklist} from "./tasklist/tasklist";
import './tasklists.css'
import {Networking} from "../../util";
import styled from "styled-components";
import {getTasklistUrl, TASKLISTS_URL} from "../urls";


const TasklistLists = styled.ul`
    display: flex;
    flex-direction: column;
    height: inherit;
    margin: 0;
    padding: 5px;
`;


export const Tasklists = ({setDrawerOpen, tasklists, listTasklists, currentTasklist, setCurrentTasklist}) => {

    const createTasklist = async (title) => {
        let resp = await Networking.send(TASKLISTS_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({title})
        });
        let json = await resp.json();
        let id = json['id'];
        await listTasklists();
        setCurrentTasklist(id);
    };

    const deleteTasklist = id => {
        let decision = window.confirm('Delete tasklist?');
        if (!decision) return;
        Networking.send(getTasklistUrl(id), {
            method: 'DELETE'
        })
            .then(() => listTasklists())
            .then(() => {
                if (currentTasklist === id) { //If currently selected tasklist is deleted, display first tasklist
                    setCurrentTasklist(tasklists[0]['id'])
                }
            });
    };

    let tasklists_display;
    if (tasklists) { //ensure tasklists got loaded before trying to render it
        tasklists_display = [
            <CreateTasklist
                key={0}
                promptCreateTasklist={() => {
                    let title = prompt('Enter title:');
                    if (title) {
                        createTasklist(title).then(() => setDrawerOpen(false));
                    }
                }}
            />
        ];
        tasklists_display = tasklists_display.concat(tasklists.map(e =>
                (<Tasklist
                    key={e.id}
                    id={e.id}
                    value={e.title}
                    onClick={() => {
                        setDrawerOpen(false);
                        setCurrentTasklist(e.id);
                    }}
                    handleDelete={() => deleteTasklist(e.id)}
                />)
            )
        );
    } else tasklists_display = 'loading';

    return <TasklistLists>{tasklists_display}</TasklistLists>

};
