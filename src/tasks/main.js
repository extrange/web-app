import React, {useEffect, useRef, useState} from "react";
import {HideOnScroll, Navbar} from "../components/navbar";
import {Tasklists} from "./tasklists/tasklists";
import {Tasks} from "./tasks/tasks";
import styled from "styled-components";
import {Networking} from "../util";
import {TASKLISTS_URL} from "./urls";
import {
    AppBar,
    IconButton,
    List,
    ListItem,
    ListItemIcon, ListItemText,
    Paper, Slide,
    SwipeableDrawer,
    Toolbar,
    Typography, useScrollTrigger
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";

const TaskDiv = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 0 auto;
`

export const TaskApp = ({returnToMainApp, logout}) => {

    const [currentTasklist, setCurrentTasklist] = useState(null);
    const [tasklists, setTasklists] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [listRef, setListRef] = useState(undefined)

    const listTasklists = () => {
        Networking.send(TASKLISTS_URL, {
            method: 'GET'
        })
            .then(resp => resp.json())
            .then(json => setTasklists(json))
        ;
    };

    const getTasklistTitle = id => {
        if (id && tasklists)
            return tasklists.filter(e => e?.id === id)[0]?.title
        else return 'Tasks'
    }

    useEffect(() => {
        listTasklists()
    }, []);

    const trigger = useScrollTrigger({target: undefined, threshold: 50})

    return <TaskDiv>
        <>
            <Slide direction={'down'} in={!trigger}>
                <AppBar position={'sticky'}>
                    <Toolbar variant={'dense'}>
                        <IconButton color={"inherit"} onClick={() => setDrawerOpen(true)}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant={'h6'}>
                            {'ou'}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Slide>
            <SwipeableDrawer
                open={drawerOpen}
                onOpen={() => setDrawerOpen(true)}
                onClose={() => setDrawerOpen(false)}
            >
                <Paper>
                    <List>
                        <ListItem button onClick={returnToMainApp}>
                            <ListItemIcon>
                                <ExitToAppIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Back to Apps'}/>
                        </ListItem>
                        <Tasklists
                            currentTasklist={currentTasklist}
                            setCurrentTasklist={setCurrentTasklist}
                            setDrawerOpen={setDrawerOpen}
                            tasklists={tasklists}
                            listTasklists={listTasklists}
                        />
                        <ListItem button onClick={logout}>
                            <ListItemIcon>
                                <MeetingRoomIcon/>
                            </ListItemIcon>
                            <ListItemText primary={'Logout'}/>
                        </ListItem>
                    </List>
                </Paper>
            </SwipeableDrawer>
        </>
        <div style={{ flex: '1 1 auto ' }}>
            <Tasks
            currentTasklist={currentTasklist}
            ref={el => el ? setListRef(el) : undefined}
        />
        </div>

    </TaskDiv>;
};
