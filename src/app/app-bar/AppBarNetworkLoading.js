import { useSelector } from "react-redux"
import { selectPendingNetworkActions } from "../appSlice"
import { CircularProgress } from '@material-ui/core';

export const AppBarNetworkLoading = () => {
    const hasPendingNetworkActions = useSelector(selectPendingNetworkActions).length > 0

    return hasPendingNetworkActions ? <CircularProgress size={20}/> : null
}