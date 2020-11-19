import styled from "styled-components";
import {getRandomInt} from "../util";
import {getDaysSinceEpoch} from "../util";
import React from "react";

const BackgroundImage = styled.div`
    background: url(${({numImages}) => `/bg/${getRandomInt(1, numImages, getDaysSinceEpoch())}.jpg`}) top/cover;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: -1;
`;

const BackgroundScreen = styled.div`
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
`;

export const Background = ({numImages}) => {
    return <>
        <BackgroundImage numImages={numImages}/>
        <BackgroundScreen/>
        </>
};