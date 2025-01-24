import styled from "styled-components";
import StarImage from "../../assets/media/star.png";

export const StarBorderContainer = styled.div`
  position: relative;
  display: inline-block;
  max-width: 50%;
  max-height: 40%;

  @media only screen and (max-width: 870px) {
    max-width: 85%;
    max-height: 60%;
  }
`;

export const Star = styled.div<{ top: number; left: number }>`
  position: absolute;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${StarImage});
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;