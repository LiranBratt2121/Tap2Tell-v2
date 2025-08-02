import styled from "styled-components";

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0px 1px 0px black;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: 20px;
`;

export const Text = styled.h1`
  margin: -1rem;
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 0px 1px 0px black;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

export const RadioImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  margin: 1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  transform: scale(1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.1); /* Slightly enlarges the image on hover */
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.6); /* Intensifies the shadow on hover */
  }
`;

export const RadioContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem;
`;