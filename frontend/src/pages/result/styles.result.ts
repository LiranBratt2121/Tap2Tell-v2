import styled from "styled-components";
import SkyImage from "../../assets/sky.png";

export const ResultContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    background-image: url(${SkyImage});
    background-size: cover;
    overflow: hidden;
    box-sizing: border-box;
`;

export const ResultBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    background-color: ${props => props.theme.colors.primary};
    height: 60vh;
    width: 40vw;
    border-radius: 1.1rem;
    border: solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.5);
    margin-bottom: 5vh;
    z-index: 2;
    overflow: hidden;
    padding-bottom: 3rem;
    text-wrap: nowrap;

    @media only screen and (max-width: 870px) {
        height: 70vh;
        width: 80vw;
        padding-bottom: 0.5rem;
    }
`;

export const ResultImage = styled.img`
    max-width: 100%;
    max-height: 100%;
    margin-bottom: 0.5rem;
    border-radius: 0.2rem;
    display: block;
    z-index: -1;
`;

export const LetterImage = styled.img`
    max-width: 60%;
    max-height: 40%;
    border-radius: 1rem;
    display: block;
    object-fit: contain;
    margin: 0.2rem;

    @media only screen and (max-width: 870px) {
        max-width: 50%;
        max-height: 40%;
    }
`;

export const WaitGif = styled.img`
    height: 100%;
    width: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
`;

export const Header = styled.h1`
    font-size: 4rem;
    font-weight: bold;
    text-shadow: 0px 1px 0px black;
    color: ${props => props.theme.colors.text};
    text-align: center;
    margin: 0;

    @media only screen and (max-width: 870px) {
        font-size: 3rem;
    }
`;

export const SeconderyHeader = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    text-shadow: 0px 1px 0px black;
    color: ${props => props.theme.colors.text};
    text-align: center;
    margin: 0;

    @media only screen and (max-width: 870px) {
        font-size: 2.5rem;
    }
`;

export const CounterText = styled.h1`
    font-size: ${props => props.theme.fontSizes.huge};
    color: ${props => props.theme.colors.text};
    font-weight: bold;
    text-shadow: 0px 1px 0px black;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.primary};
    border: solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    padding: 2vw;
`;

export const Button = styled.div`
    text-align: center;
    color: white;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: ${props => props.theme.fontSizes.bigger};
    text-shadow: 0px 1px 0px black;
    color: ${props => props.theme.colors.text};
`;
