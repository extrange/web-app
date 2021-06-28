import {OverlayScrollbarOptions} from "../theme";
import {CircularProgress, Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery} from "@material-ui/core";
import {selectCurrentModule, setCurrentModule} from "../appSlice";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import React from "react";
import styled from "styled-components";
import {OverlayScrollbarsComponent} from "overlayscrollbars-react";
import {useDispatch, useSelector} from "react-redux";
import {useLogoutMutation} from "../auth/authApi";
import {useTheme} from "@material-ui/core/styles";
import {BACKGROUND_COLOR} from "../../shared/components/backgroundScreen";


const OverlayScrollbarsWithMaxWidth = styled(OverlayScrollbarsComponent)`
  width: ${({$width})=>$width}px;
  max-width: 80vw;
`

const AppNameDiv = styled.div`
  font-family: 'Starcraft', serif;
  font-size: 20px;
  margin: 0 auto;
  text-align: center;
  cursor: default;
`;


const TransparentDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    ${({$transparent}) => $transparent && BACKGROUND_COLOR};
  }
`;

export const AppBarDrawer = ({drawerOpen, drawerWidth, setDrawerOpen, sidebarName, children}) => {

    const dispatch = useDispatch()
    const module = useSelector(selectCurrentModule)

    const [logout, {isLoading}] = useLogoutMutation()

    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'));

    const closeAppBar = () => setDrawerOpen(false)

    const clearModule = () => dispatch(setCurrentModule(null))

    return <TransparentDrawer
        $transparent={!mobile}
        onClose={closeAppBar}
        open={!mobile || drawerOpen}
        variant={mobile ? 'temporary' : 'permanent'}>
        <OverlayScrollbarsWithMaxWidth
            $width={drawerWidth}
            options={OverlayScrollbarOptions}
            className={'os-host-flexbox'}>
            <List onClick={closeAppBar}>
                <ListItem>
                    <AppNameDiv>{sidebarName}</AppNameDiv>
                </ListItem>
                {module && <ListItem button onClick={clearModule}>
                    <ListItemIcon>
                        <ArrowBackIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Back to Apps'}/>
                </ListItem>}
                {children}
                <ListItem
                    button
                    onClick={e => {
                        e.stopPropagation()
                        logout()
                    }}>
                    <ListItemIcon>
                        <MeetingRoomIcon/>
                    </ListItemIcon>
                    <ListItemText primary={'Logout'}/>
                    {isLoading && <CircularProgress size={20}/>}
                </ListItem>
            </List>
        </OverlayScrollbarsWithMaxWidth>
    </TransparentDrawer>;

}