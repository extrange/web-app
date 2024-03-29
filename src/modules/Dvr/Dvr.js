import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import "shaka-player/dist/controls.css";
import shaka from "shaka-player/dist/shaka-player.ui";
import styled from "styled-components";
import { getChannelUrl, useGetOrRefreshChannelQuery } from "./dvrApi";

const CHANNELS = ["CAM_1", "CAM_2", "CAM_3", "CAM_4", "CAM_5", "CAM_6"];

const REFRESH_INTERVAL = 10_000;

const VideoDiv = styled.div`
  width: min(100%, 1280px);
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
`;

export const Dvr = ({ setDrawerContent, setTitleContent, setSidebarName }) => {
  const [channel, setChannel] = useState(CHANNELS[0]);
  const player = useRef();

  const { data, isFetching } = useGetOrRefreshChannelQuery(channel, {
    refetchOnMountOrArgChange: true, //Don't cache stream UUIDs
    pollingInterval: REFRESH_INTERVAL,
  });

  useEffect(() => {
    if (data && !isFetching) {
      player.current?.load(getChannelUrl(data.stream_uuid, channel));
    }
  }, [channel, data, isFetching]);

  // Initialize polyfills (required)
  useEffect(() => {
    shaka.polyfill.installAll();
    return () => {
      if (player.current) {
        player.current.unload();
        player.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    setDrawerContent(
      <List>
        {CHANNELS.map((channel) => (
          <ListItem key={channel} button onClick={() => switchChannel(channel)}>
            <ListItemText primary={channel} />
          </ListItem>
        ))}
      </List>
    );
  }, [setDrawerContent]);

  useEffect(() => {
    setTitleContent(<Typography variant={"h6"}>{channel}</Typography>);
  }, [setTitleContent, channel]);

  // Init and attach to video element
  const attachPlayer = (videoEl) => {
    /*Do not reinitialize video element if a null element is passed, or player already exists*/
    if (!videoEl || player.current) return;
    if (!shaka.Player.isBrowserSupported()) {
      console.error("Shaka player not supported");
      return;
    }

    player.current = new shaka.Player(videoEl);
    player.current.addEventListener("error", (e) =>
      console.error("Shaka player error: ", e.detail)
    );

    /* Set up video controls
        videoEl.parentNode is guaranteed to have been mounted, if videoEl itself was mounted*/
    let ui = new shaka.ui.Overlay(player.current, videoEl.parentNode, videoEl);
    let controls = ui.getControls();
    controls.addEventListener("UIError", (e) =>
      console.error("Shaka UI error: ", e.detail)
    );
  };

  const switchChannel = (channel) =>
    void player.current?.unload().then(setChannel(channel));

  return (
    <VideoDiv data-shaka-player-container>
      <StyledVideo data-shaka-player ref={attachPlayer} id="video" autoPlay />
    </VideoDiv>
  );
};
