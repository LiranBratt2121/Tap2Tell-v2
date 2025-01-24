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
`;

export const AnimatedPopup = styled(animated.img)`
  height: 60%;
  width: 80%;
  z-index: 10;
`;