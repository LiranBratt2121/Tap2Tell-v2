import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  svg {
    transition: opacity 0.2s;
  }

  &:hover svg {
    opacity: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

interface AcceptButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
}

const AcceptButton: React.FC<AcceptButtonProps> = ({ size = 24, ...props }) => {
  return (
    <StyledButton {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={size}
        height={size}
      >
        <path
          fill="#3AAF3C"
          d="M256 0c141.39 0 256 114.61 256 256S397.39 512 256 512 0 397.39 0 256 114.61 0 256 0z"
        />
        <path
          fill="#0DA10D"
          fillRule="nonzero"
          d="M391.27 143.23h19.23c-81.87 90.92-145.34 165.89-202.18 275.52-29.59-63.26-55.96-106.93-114.96-147.42l22.03-4.98c44.09 36.07 67.31 76.16 92.93 130.95 52.31-100.9 110.24-172.44 182.95-254.07z"
        />
        <path
          fill="#fff"
          fillRule="nonzero"
          d="M158.04 235.26c19.67 11.33 32.46 20.75 47.71 37.55 39.53-63.63 82.44-98.89 138.24-148.93l5.45-2.11h61.06c-81.87 90.93-145.34 165.9-202.18 275.53-29.59-63.26-55.96-106.93-114.96-147.43l64.68-14.61z"
        />
      </svg>
    </StyledButton>
  );
};

export default AcceptButton;
