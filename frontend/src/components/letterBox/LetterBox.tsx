import React from 'react'
import { Letters } from './types.letterBox'
import { Image } from './styles.letterBox'
import { letters2images } from '../../pages/dashboard/utils'
import { useNavigate } from 'react-router-dom';

interface LetterBoxProps {
  letter: Letters;
}

const LetterBox: React.FC<LetterBoxProps> = ({ letter }) => {
  const navigate = useNavigate();

  return (
    <Image
      src={letters2images[letter]}
      alt={`Letter ${letter}`}
      onClick={() => setTimeout(() => navigate(`/capture/${letter}`), 500)}
    />)
};

export default LetterBox;
