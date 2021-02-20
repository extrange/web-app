import styled from "styled-components";
import {getDaysSinceEpoch, getRandomInt} from "../util/util";

const RandomBackgroundImage = styled.div`
  background: url(${({numImages}) => `/bg/${getRandomInt(1, numImages, getDaysSinceEpoch())}.jpg`}) top/cover;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
`;

export const RandomBackground = ({numImages}) => {
    return <RandomBackgroundImage numImages={numImages}/>
};