import styled from "styled-components";
import Sky from "../../assets/sky.png"

export const DashboardContainer = styled.div`
    display: flex;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url(${Sky});
    background-size: cover;
`;
export const LettersContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: row-reverse;
    align-content: center;
    width: 100%;
    gap: 0.5rem;
    padding: 3rem 0.5rem 0.5rem;
    margin: 0 0.5rem;
    border-radius: 1.1rem;
    border: solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.5);
    background-color: ${props => props.theme.colors.primary};
    position: relative;
`;

export const Header = styled.h1`
    position: absolute;
    top: 0.1rem;
    right: 50%;
    transform: translateX(50%);
    margin: 0;
    text-align: center;
    text-shadow: 0px 1px 0px black;
    color: ${props => props.theme.colors.text};
    font-size: ${props => props.theme.fontSizes.bigger};
    z-index: 10;
    white-space: nowrap;
`;
