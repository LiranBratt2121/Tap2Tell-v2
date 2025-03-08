import { animated } from "@react-spring/web";
import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5%;
`;

export const AnimatedPopup = styled(animated.img)`
  max-width: 80%;
  max-height: 80%;
  width: auto;
  height: auto;
  object-fit: contain;
  z-index: 10;
`;