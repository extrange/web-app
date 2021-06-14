import {Badge, Chip, Divider, IconButton, ListItem, ListItemText, Popover, Typography} from '@material-ui/core'
import NotificationsIcon from "@material-ui/icons/Notifications";
import React, {useState} from "react";
import styled from "styled-components";
import {formatDistanceToNowStrict} from 'date-fns'
import {useSelector} from "react-redux";
import {selectNotificationsSorted} from "../notifications/notificationSlice";
import {formatDistanceToNowPretty} from "../../shared/util";

const StyledChip = styled(Chip)`
  margin-right: 5px;
  cursor: pointer;
`;

const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    max-width: min(calc(100% - 32px), 600px);
  }
`;

const StyledSpan = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

export const NotificationMenu = () => {

    const notifications = useSelector(selectNotificationsSorted)

    const [anchorEl, setAnchorEl] = useState();

    const handleNotificationClick = e => setAnchorEl(e.currentTarget);
    const onClose = () => setAnchorEl(null);

    return <>
        <IconButton
            onClick={handleNotificationClick}
        >
            <Badge badgeContent={notifications.length} color={'error'}>
                <NotificationsIcon/>
            </Badge>
        </IconButton>
        <StyledPopover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}>
            {notifications.length > 0 ?
                notifications.map(e => <React.Fragment key={e.id}>
                        <ListItem button>
                            <ListItemText
                                disableTypography
                                primary={<>
                                    <StyledChip
                                        color={'primary'}
                                        label={e.source}/>
                                    {e.title}
                                </>}
                                secondary={<>
                                    <StyledSpan>{e.content}</StyledSpan>
                                    <Typography variant={'body2'}
                                                align={'right'}>
                                        {formatDistanceToNowPretty(new Date(e.timestamp))}
                                    </Typography>
                                </>}/>
                        </ListItem>
                        <Divider/>
                    </React.Fragment>) :
                <ListItem>
                    <ListItemText
                        primary={'No new notifications'}/>
                </ListItem>}
        </StyledPopover>
    </>

};