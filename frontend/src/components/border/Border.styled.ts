import styled from "styled-components";

export const StarBorderContainer = styled.div`
  position: relative;
  width: 75%;
  height: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface StarProps {
  top: number;
  left: number;
}

export const Star = styled.div<StarProps>`
  position: absolute;
  width: 25px;
  height: 25px;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transform: translate(-50%, -50%);
  background-color: gold;
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
  animation: twinkle 1s infinite alternate;

  @keyframes twinkle {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.5;
    }
  }
`;
