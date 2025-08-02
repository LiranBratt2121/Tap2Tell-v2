import styled from "styled-components";
import Sky from "../../assets/sky.png"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;  
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
  height: 100vh;
  background-image: url(${Sky});
  background-size: cover;
`;

export const FormContainer = styled.div`
  flex: 0 1 150px;
  padding: 20px;
  border-radius: 1rem;
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.9);
  background-color: ${props => props.theme.colors.primary};
`