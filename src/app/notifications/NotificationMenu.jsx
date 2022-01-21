import {
  Badge,
  Chip,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  useDismissNotificationMutation,
  useGetNotificationsQuery,
} from "./notificationsApi";
import { selectAppNotifications } from "./notificationSlice";
import { format, compareDesc, isToday } from "date-fns";

const StyledChip = styled(Chip)`
  margin-right: 5px;
  cursor: pointer;
`;

const StyledPopover = styled(Popover)`
  .MuiPopover-paper {
    max-width: min(calc(100% - 32px), 600px);
    max-height: calc(100% - 56px);
    overscroll-behavior: contain;
  }
`;

const StyledSpan = styled.div`
  white-space: pre-line;
`;

const REFRESH_INTERVAL_MS = 60 * 1000;

/* If today, format as 1:38am. Otherwise, 12 Jan 1:38am. */
const formatTime = (date) =>
  isToday(date)
    ? `Today, ${format(date, "h:mmaaa")}`
    : format(date, "d MMM, h:mmaaa");

export const NotificationMenu = () => {
  const { data: serverNotifications = [] } =
    useGetNotificationsQuery(undefined, {
      pollingInterval: REFRESH_INTERVAL_MS,
      refetchOnReconnect: true,
    });
  const [dismissNotification] = useDismissNotificationMutation();

  const appNotifications = useSelector(selectAppNotifications);

  /* Combine notifications from both the front- and back-ends */
  const notifications = useMemo(
    () =>
      [...serverNotifications, ...appNotifications].sort((a, b) =>
        compareDesc(a.created, b.created)
      ),
    [serverNotifications, appNotifications]
  );

  const [anchorEl, setAnchorEl] = useState();

  const handleNotificationClick = (e) => setAnchorEl(e.currentTarget);
  const onClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleNotificationClick}>
        <Badge badgeContent={notifications.length} color={"error"}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <StyledPopover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        disableScrollLock
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((e) => (
            <React.Fragment key={e.id}>
              <ListItem
                button
                onClick={() => dismissNotification({ id: e.id })}
              >
                <ListItemText
                  disableTypography
                  primary={
                    <>
                      <StyledChip color={"primary"} label={e.source} />
                      {e.title}
                    </>
                  }
                  secondary={
                    <>
                      <StyledSpan>{e.content}</StyledSpan>
                      <Typography variant={"body2"} align={"right"}>
                        {formatTime(e.created)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <ListItem>
            <ListItemText primary={"No new notifications"} />
          </ListItem>
        )}
      </StyledPopover>
    </>
  );
};
