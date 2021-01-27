import {AppBarResponsive} from "../components/appBarResponsive";
import {useState, useEffect} from "react";
import {CircularProgress, Typography} from "@material-ui/core";

export const MailModule = ({returnToMainApp, logout}) => {

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [loading, setloading] = useState(false)

    const titleContent = <>
        <Typography variant={"h6"} noWrap>Mail</Typography>
        {loading
            ? <CircularProgress color="inherit" size={20} style={{margin: '12px'}}/>
            : null}
    </>



    return <AppBarResponsive
        appName={'Mail'}
        returnToMainApp={returnToMainApp}
        logout={logout}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        titleContent={titleContent}
        drawerContent={}

    >

    </AppBarResponsive>
}