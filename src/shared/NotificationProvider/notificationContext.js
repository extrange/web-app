import React from 'react'

export const getNotificationCount = notifications => notifications.reduce((sum, e) => sum + e.count, 0);

export const NotificationContext = React.createContext(undefined);