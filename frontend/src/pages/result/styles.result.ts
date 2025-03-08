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
    padding: 2vh 2vw;
`;

export const ResultBody = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: ${props => props.theme.colors.primary};
    width: 40vw;
    border-radius: 1.1rem;
    border: solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.5);
    margin-bottom: 5vh;
    z-index: 2;
    overflow: hidden;
    padding: 1.5rem;
    text-wrap: nowrap;

    @media only screen and (max-width: 870px) {
        width: 85vw;
        padding: 1rem;
        margin-bottom: 3vh;
    }
`;

export const ResultImage = styled.img`
    width: auto;
    height: auto;
    max-width: 90%;
    max-height: 40vh;
    margin: 1rem 0;
    border-radius: 0.2rem;
    display: block;
    z-index: -1;
    object-fit: contain;

    @media only screen and (max-width: 870px) {
        max-width: 90%;
        max-height: 30vh;
        margin: 0.8rem 0;
    }
`;

export const LetterImage = styled.img`
    max-width: 60%;
    max-height: 20vh;
    border-radius: 1rem;
    display: block;
    object-fit: contain;
    margin: 0.5rem 0 1rem;

    @media only screen and (max-width: 870px) {
        max-width: 60%;
        max-height: 15vh;
        margin: 0.5rem 0;
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
    font-size: 3.5rem;
    font-weight: bold;
    text-shadow: 0px 1px 0px black;
    color: ${props => props.theme.colors.text};
    text-align: center;
    margin: 0.5rem 0;

    @media only screen and (max-width: 870px) {
        font-size: 2.8rem;
        margin-top: 0.5rem;
    }
`;

export const SeconderyHeader = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    text-shadow: 0px 1px 0px black;
    color: ${props => props.theme.colors.text};
    text-align: center;
    margin: 0.2rem 0 0.5rem;

    @media only screen and (max-width: 870px) {
        font-size: 1.8rem;
        margin: 0.2rem 0;
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
    padding: 1.5rem 2.5rem;
    margin-top: 1rem;
    
    @media only screen and (max-width: 870px) {
        padding: 1rem 2rem;
        margin-top: 0.5rem;
    }
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