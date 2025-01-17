import React from 'react'
import { Letters } from './types.letterBox'
import { Image } from './styles.letterBox'
import { useNavigate } from 'react-router-dom';
import { letterAssets } from '../showcaseLetter/utils';

interface LetterBoxProps {
  letter: Letters;
}

const LetterBox: React.FC<LetterBoxProps> = ({ letter }) => {
  const navigate = useNavigate();

  return (
    <Image
      src={letterAssets[letter].image}
      alt={`Letter ${letter}`}
      onClick={() => setTimeout(() => navigate(`/capture/${letter}`), 500)}
    />)
};

export default LetterBox;
