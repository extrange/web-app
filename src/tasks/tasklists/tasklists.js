import React, {useEffect, useState} from "react";
import {CreateTasklist} from "./tasklist/createTasklist";
import {Tasklist} from "./tasklist/tasklist";
import './tasklists.css'
import {Networking} from "../../util";
import {PlainButton, StyledButton} from "../../components/common";
import styled from "styled-components";
import {getTasklistUrl, TASKLISTS_URL} from "../urls";

const TasklistsContainer = styled.div`
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 599px) {
        width: ${props => props.visible ? `inherit` : '50px'};
    }
    @media screen and (min-width: 600px) {
        flex: 1
    }
`;

const MenuButton = styled(PlainButton)`
    @media screen and (max-width: 599px) {
        display: block;
    }
    @media screen and (min-width: 600px) {
        display: none;
    }
`;

const CollapsibleButtonContainer = styled.div`
    display: flex;
    @media screen and (max-width: 599px) {
        flex-direction: column;  
    }
    @media screen and (min-width: 600px) {
        flex-direction: row;
    }

`;

const TasklistLists = styled.ul`
    @media screen and (max-width: 600px) {
        display: ${props => props.visible ? 'block' : 'none'};
    }
    @media screen and (min-width: 600px) {
        display: block;
    }
    height: inherit;
    margin: 0;
    padding: 5px;
    overflow-y: scroll;
    flex: 1;
`;


export const Tasklists = props => {
    const [tasklists, setTasklists] = useState(null);

    // Toggle visibility of tasklists
    const [visible, setVisible] = useState(true);

    const listTasklists = async () => {
        let resp = await Networking.send(TASKLISTS_URL, {
            method: 'GET'
        });
        let json = await resp.json();
        setTasklists(json);
    };

    const createTasklist = async (title) => {
        let resp = await Networking.send(TASKLISTS_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({title})
        });
        let json = await resp.json();
        let id = json['id'];
        await listTasklists();
        props.setCurrentTasklist(id);
    };

    const deleteTasklist = async (id) => {
        let decision = window.confirm('Delete tasklist?');
        if (!decision) return;
        await Networking.send(getTasklistUrl(id), {
            method: 'DELETE'
        });
        await listTasklists().then(() => {
            if (props.currentTasklist === id) { //If currently selected tasklist is deleted, display first tasklist
                console.log(`curTasklist: ${props.currentTasklist}, id=${id}`);
                props.setCurrentTasklist(tasklists[0]['id'])
            }
        });
    };

    //todo Hacky way to avoid returning promise
    useEffect(() => {
        listTasklists()
    }, []);

    let tasklists_display;
    if (tasklists) { //ensure tasklists got loaded before trying to render it
        tasklists_display = [
            <CreateTasklist
                key={0}
                promptCreateTasklist={() => {
                    let title = prompt('Enter title:');
                    if (title) createTasklist(title)
                }}
            />
        ];
        tasklists_display = tasklists_display.concat(tasklists.map(e =>
                (<Tasklist
                    key={e.id}
                    id={e.id}
                    value={e.title}
                    onClick={() => {
                        props.setCurrentTasklist(e.id);
                        setVisible(false)
                    }}
                    handleDelete={() => deleteTasklist(e.id)}
                />)
            )
        );
    } else tasklists_display = 'loading';

    return (
        <TasklistsContainer visible={visible}>
            <MenuButton onClick={() => setVisible(!visible)}>Menu</MenuButton>
            <TasklistLists visible={visible}>{tasklists_display}</TasklistLists>
            <CollapsibleButtonContainer>

                <StyledButton
                    variant={'outlined'}
                    color={'primary'}
                    onClick={props.returnToMainApp}
                >Return to Main App
                </StyledButton>

                <StyledButton
                    variant={'contained'}
                    color={'primary'}
                    onClick={props.logout}
                >Logout
                </StyledButton>

            </CollapsibleButtonContainer>
        </TasklistsContainer>
    )
};
