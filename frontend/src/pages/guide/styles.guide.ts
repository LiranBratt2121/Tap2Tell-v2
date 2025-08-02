import styled from "styled-components";
import Sky from "../../assets/sky.png"

export const MainContainer = styled.div`
    height: 100vh;
    width: 100vw;
    background-image: url(${Sky});
    background-size: cover;
`;

export const GuideContainer = styled.video`
    height: 100%;
    width: 100vw;
`;

export const Header = styled.h1`
    padding: 0.3rem;
    font-size: ${props => props.theme.fontSizes.medium};
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.primary};
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    text-shadow: 2px 2px 2px black;
    width: 50%;
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 2%;
    text-align: center;
    transform: translate(-50%, -50%);
`

export const SkipButton = styled.button`
    position: absolute;
    bottom: -2rem;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0.3rem;
    border-radius: 1rem;
    font-size: ${props => props.theme.fontSizes.medium};
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.primary};
`