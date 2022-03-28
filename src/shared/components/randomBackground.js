import styled from "styled-components";
import { getDaysSinceEpoch, getRandomInt } from "../util";
import { useCallback, useEffect, useState } from "react";

/*Largest index of background images, inclusive*/
const NUM_IMAGES = 90;

const RandomBackgroundImage = styled.div`
  background: url(${({ $picIndex }) => `/bg/${$picIndex}.jpg`}) top/cover;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
`;

/*Get the latest pic index on window focus (setTimeout is unreliable*/
const getPicIndex = () => getRandomInt(1, NUM_IMAGES + 1, getDaysSinceEpoch());

export const RandomBackground = () => {
  const [picIndex, setPicIndex] = useState(getPicIndex());
  const listener = useCallback(() => setPicIndex(getPicIndex()), []);

  useEffect(() => {
    window.addEventListener("focus", listener);
    return () => window.removeEventListener("focus", listener);
  }, [listener]);

  return <RandomBackgroundImage $picIndex={picIndex} />;
};
