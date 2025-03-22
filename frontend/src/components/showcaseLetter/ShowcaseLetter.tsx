import React, { useMemo, useState, useEffect } from 'react';
import { useSpring } from '@react-spring/web';
import { ShowcaseProps } from './types.leterBox';
import { letterAssets } from './assetManger';
import { AnimatedPopup, Overlay } from './styles.showcaseLetter';

const ShowcaseLetter: React.FC<ShowcaseProps> = ({ letter }) => {
  const { image, audio } = useMemo(() => letterAssets[letter], [letter]);
  const [isVisible, setIsVisible] = useState(false);

  const animationProps = useSpring({
    transform: isVisible ? 'scale(1)' : 'scale(0)',
    config: { tension: 280, friction: 20 },
  });

  useEffect(() => {
    if (image && audio) {
      setIsVisible(true);
      const sound = new Audio(audio);
      sound.play();

      sound.onended = () => {
        setIsVisible(false);
      };

      return () => {
        sound.pause();
        sound.currentTime = 0;
        sound.remove();
      };
    }
  }, [image, audio]);

  return (
    <Overlay>
      {image && (
        <AnimatedPopup
          src={image}
          alt="letter"
          style={animationProps}
        />
      )}
    </Overlay>
  );
};

export default ShowcaseLetter;
