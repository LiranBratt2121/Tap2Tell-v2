import styled from "styled-components";
import Sky from "../../assets/sky.png"

export const CameraContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background-image: url(${Sky});
`;

export const CameraView = styled.div`
    padding: 1rem;
    position: relative;
`;

export const Button = styled.button`
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    bottom: 5%;
    z-index: 10;
    height: 3rem;
    width: 3rem;
    border-radius: 10rem;
    background-color: snow;
    cursor: pointer;
    z-index: 101;
`

export const Back = styled.button`
    position: absolute;
    left: 10%;
    transform: translateX(10%);
    top: 5%;
    transform: translateY(5%);
    background-color: ${props => props.theme.colors.primary};
    cursor: pointer;
    z-index: 100;
`;