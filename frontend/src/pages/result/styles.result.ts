import styled from "styled-components";
import skyImage from "../../assets/sky.png";

// Container for entire page content
export const ResultContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    background-image: url(${skyImage});
    overflow: hidden;
    box-sizing: border-box;
`;

export const WaitGif = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;  /* Ensures the gif covers the entire container */
    position: absolute; /* Make sure it's positioned in relation to the container */
    top: 0;
    left: 0;
`;

export const Header = styled.h1`
    font-size: 5vw;
    font-weight: bold;
    text-shadow: 0px 1px 0px black;
    color: ${props => props.theme.colors.text};
    text-align: center;
    margin-bottom: 2vw;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.primary};
    border: solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.5);
    height: 12vh;
    width: 40vw;
    border-radius: 8px;
    padding: 2vw;
`;

export const Button = styled.button`
    width: 20vw;
    height: 10vh;
    background-color: white;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.8);
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: ${props => props.theme.fontSizes.small};
`;
