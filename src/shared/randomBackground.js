import styled from "styled-components";
import {getDaysSinceEpoch, getRandomInt} from "../util/util";
import {useEffect, useState} from "react";
import {differenceInMilliseconds, startOfTomorrow} from 'date-fns'

/*Largest index of background images, inclusive*/
const NUM_IMAGES = 26;
const initialRefreshTimeout = () => differenceInMilliseconds(new Date(), startOfTomorrow());
const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;

const RandomBackgroundImage = styled.div`
  background: url(${({$picIndex}) => `/bg/${$picIndex}.jpg`}) top/cover;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
`;

/*Get the latest pic index*/
const getPicIndex = () => getRandomInt(1, NUM_IMAGES + 1, getDaysSinceEpoch());

export const RandomBackground = () => {

    const [picIndex, setPicIndex] = useState(getPicIndex());

    const reloadBg = () => setPicIndex(getPicIndex());

    useEffect(() => {
        const timer = setTimeout(() => {
                reloadBg();
                setInterval(reloadBg, REFRESH_INTERVAL_MS)
            }, initialRefreshTimeout()
        );
        return () => clearTimeout(timer)
    }, []);

    return <RandomBackgroundImage $picIndex={picIndex}/>
};