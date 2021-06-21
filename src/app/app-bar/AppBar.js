import {AppBar as MuiAppBar, IconButton, Slide, Toolbar, Typography, useScrollTrigger,} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import {styled as muiStyled} from "@material-ui/core/styles"
import styled from 'styled-components'
import {NotificationMenu} from "../notifications/NotificationMenu";
import {useSelector} from "react-redux";
import {selectCurrentModule} from "../appSlice";
import React, {useLayoutEffect, useState} from "react";
import {ModuleSelect} from "../modules/ModuleSelect";
import {MODULES} from "../modules/modules";
import {AppBarDrawer} from "./AppBarDrawer";

export const drawerWidth = 300;

const FlexContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const TransparentAppBar = muiStyled(MuiAppBar)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },

    '@supports (backdrop-filter: blur(10px))': {
        'backdrop-filter': 'blur(10px)',
    },

    background: 'rgba(0,0,0,0.6)',

}));

const DrawerContainer = muiStyled('div')(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
    },

}));

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const ContentDiv = styled.div`
  height: calc(100% - 48px); //48px is the height of Toolbar (variant=dense)
`;


const StyledIconButton = muiStyled(IconButton)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none',
    }
}));


/*To prevent AppBar from automatically closing on ListItem click, use
* e.stopPropagation().*/
export const AppBar = () => {

    const {id} = useSelector(selectCurrentModule)

    const trigger = useScrollTrigger({threshold: 50});

    /*Hooks are passed to modules*/
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerContent, setDrawerContent] = useState(null)
    const [sidebarName, setSidebarName] = useState('')
    const [titleContent, setTitleContent] = useState(null)

    const appBarProps = {setDrawerContent, setTitleContent, setSidebarName, setDrawerOpen}

    /*useLayoutEffect is critical here, to ensure that this runs BEFORE any
    * useEffect(s) in the children that might call setTitleContent etc.*/
    useLayoutEffect(() => {
        if (!id) {
            setSidebarName('Modules')
            setTitleContent(<Typography variant={"h6"}>Modules</Typography>)
            setDrawerContent(null)
        } else {
            setTitleContent(<Typography variant={"h6"}>{MODULES[id].menuName}</Typography>)
            setSidebarName(MODULES[id].menuName)
        }

    }, [id, setDrawerContent, setSidebarName, setTitleContent])

    return <FlexContainer>
        <Slide direction={'down'} in={!trigger}>
            <TransparentAppBar
                position={'fixed'}
                color={'transparent'}>
                <Toolbar variant={"dense"}>
                    <StyledIconButton
                        color={"inherit"}
                        edge={'start'}
                        onClick={() => setDrawerOpen(true)}>
                        <MenuIcon/>
                    </StyledIconButton>
                    {titleContent}
                    <div style={{flex: 1}}/>
                    <NotificationMenu/>
                </Toolbar>
            </TransparentAppBar>
        </Slide>

        <DrawerContainer>
            <AppBarDrawer
                drawerOpen={drawerOpen}
                drawerWidth={drawerWidth}
                setDrawerOpen={setDrawerOpen}
                sidebarName={sidebarName}>
                {drawerContent}
            </AppBarDrawer>
        </DrawerContainer>


        <ContentContainer>
            <Toolbar variant={"dense"}/>
            <ContentDiv>
                {id ?
                    React.createElement(MODULES[id].element, appBarProps) :
                    <ModuleSelect {...appBarProps}/>}
            </ContentDiv>
        </ContentContainer>

    </FlexContainer>
};