import styled, { } from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
  height: 100vh;
  background-image: url("src/assets/sky.png");
  background-size: cover;
`;


export const FormContainer = styled.div`
  flex: 0 1 150px;
  padding: 20px;
  border-radius: 1rem;
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.9);
  background-color: ${props => props.theme.colors.primary};
`

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0px 1px 0px black;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: 20px;
`;

export const Button = styled.button`
  width: 100%;
  padding: ${props => props.theme.fontSizes.small};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: ${props => props.theme.fontSizes.medium};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;