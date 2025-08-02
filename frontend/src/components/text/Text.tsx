import styled from "styled-components";

export const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0px 1px 0px black;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: 5px;
  margin-top: 2rem;
`;
