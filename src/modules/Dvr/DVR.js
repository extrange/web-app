import React, {useEffect, useRef, useState} from "react";
import {AppBar} from "../../common/AppBar";
import {CircularProgress, List, ListItem, ListItemText, Typography} from "@material-ui/core";
import shaka from 'shaka-player/dist/shaka-player.ui'
import {getChannelUrl, getOrRefreshChannel} from "./urls";
import styled from 'styled-components'
import 'shaka-player/dist/controls.css'

const CHANNELS = [
    'CAM_1',
    'CAM_2',
    'CAM_5',
];

const REFRESH_INTERVAL = 10_000;

const VideoDiv = styled.div`
  width: min(100%, 1280px)
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
`;

export const DVR = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [channel, setChannel] = useState(CHANNELS[0]);
    const [loading, setLoading] = useState(false);
    const player = useRef();

    // Load channel and keep refreshing every REFRESH_INTERVAL seconds
    useEffect(() => {
        getOrRefreshChannel(channel)
            .then(({stream_uuid, timeout}) =>
                getChannelUrl(stream_uuid, channel))
            .then(url => player.current?.load(url))
            .then(() => setLoading(false));

        let intervalId = setInterval(() => {
            getOrRefreshChannel(channel)
        }, REFRESH_INTERVAL);

        // Cleanup old timers
        return () => clearInterval(intervalId)
    }, [channel]);

    // Initialize polyfills (required)
    useEffect(() => {
        shaka.polyfill.installAll();
        return () => {
            if (player.current) {
                player.current.unload();
                player.current.destroy()
            }
        }
    }, []);

    // Init and attach to video element
    const attachPlayer = videoEl => {
        /*Do not reinitialize video element if a null element is passed, or player already exists*/
        if (!videoEl || player.current) return;
        if (!shaka.Player.isBrowserSupported()) {
            console.error('Shaka player not supported');
            return
        }

        player.current = new shaka.Player(videoEl);
        player.current.addEventListener('error', e => console.error('Shaka player error: ', e.detail));

        /* Set up video controls
        videoEl.parentNode is guaranteed to have been mounted, if videoEl itself was mounted*/
        let ui = new shaka.ui.Overlay(player.current, videoEl.parentNode, videoEl);
        let controls = ui.getControls();
        controls.addEventListener('UIError', e => console.error('Shaka UI error: ', e.detail))
    };
    const switchChannel = channel =>
        void player.current?.unload()
            .then(setChannel(channel));

    const drawerContent =
        <List>
            {CHANNELS.map(e =>
                <ListItem
                    key={e}
                    button
                    onClick={() => {
                        setLoading(true);
                        setDrawerOpen(false);
                        switchChannel(e)
                    }}>
                    <ListItemText primary={e}/>
                </ListItem>)}
        </List>;

    return <AppBar
        titleContent={<>
            <Typography variant={"h6"} noWrap>DVR: {channel}</Typography>
            {loading && <CircularProgress color="inherit" size={20} style={{margin: '12px'}}/>}
        </>}
        setDrawerOpen={setDrawerOpen}
        drawerOpen={drawerOpen}
        drawerContent={drawerContent}
    >
        <VideoDiv data-shaka-player-container>
            <StyledVideo
                data-shaka-player
                ref={attachPlayer}
                id="video"
                autoPlay/>
        </VideoDiv>
    </AppBar>
};