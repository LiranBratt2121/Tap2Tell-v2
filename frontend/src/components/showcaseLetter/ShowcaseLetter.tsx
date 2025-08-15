import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSpring } from '@react-spring/web';
import { ShowcaseProps } from './types.leterBox';
import { letterAssets } from './assetManger';
import { AnimatedPopup, Overlay } from './styles.showcaseLetter';
import { useTranslation } from 'react-i18next';

const ShowcaseLetter: React.FC<ShowcaseProps> = ({ letter }) => {
  const { image, audio: hebrewAudio, audioEnglish } = useMemo(() => letterAssets[letter], [letter]);
  const [isVisible, setIsVisible] = useState(false);
  const { i18n } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const animationProps = useSpring({
    transform: isVisible ? 'scale(1)' : 'scale(0)',
    config: { tension: 280, friction: 20 },
  });

  useEffect(() => {
    if (!image) {
      return;
    }

    const audioSrc = i18n.language === 'en' ? audioEnglish : hebrewAudio;
    if (!audioSrc) {
      return;
    }

    audioRef.current = new Audio(audioSrc);
    audioRef.current.onended = () => setIsVisible(false);

    setIsVisible(true);
    audioRef.current.play();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.onended = null;
        audioRef.current = null;
      }
    };
  }, [image, hebrewAudio, audioEnglish, i18n.language]);

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