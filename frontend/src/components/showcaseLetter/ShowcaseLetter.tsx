import React, { useMemo, useState, useEffect } from 'react';
import { useSpring } from '@react-spring/web';
import { ShowcaseProps } from './types.leterBox';
import { letterAssets, additionalAssets } from './assetManger';
import { AnimatedPopup, Overlay } from './styles.showcaseLetter';
import { useTranslation } from 'react-i18next';

const ShowcaseLetter: React.FC<ShowcaseProps> = ({ letter }) => {
  const { image, audio: hebrewLetterIntro } = useMemo(() => letterAssets[letter], [letter]);
  const [isVisible, setIsVisible] = useState(false);
  const { i18n } = useTranslation();

  const animationProps = useSpring({
    transform: isVisible ? 'scale(1)' : 'scale(0)',
    config: { tension: 280, friction: 20 },
  });

  const getAudioShowcase = () => {
    const hebrewAudio = new Audio(hebrewLetterIntro);
    const englishAudio = new Audio(additionalAssets.CurrentEnglishAudio);
    const TRIM_TIME_MS = 1200; // 1.2 seconds in milliseconds
    let timeout: ReturnType<typeof setTimeout>;

    if (i18n.language === "en") {
      hebrewAudio.play();

      timeout = setTimeout(() => {
        hebrewAudio.pause();
        hebrewAudio.currentTime = 0;
        englishAudio.play();
      }, TRIM_TIME_MS);

      englishAudio.onended = () => {
        setIsVisible(false);
      };

      return {
        audios: [hebrewAudio, englishAudio],
        cancel: () => clearTimeout(timeout),
      };
    } else {
      hebrewAudio.onended = () => {
        setIsVisible(false);
      };

      hebrewAudio.play();

      return {
        audios: [hebrewAudio],
        cancel: () => {},
      };
    }
  };

  useEffect(() => {
    if (!image || !hebrewLetterIntro) return;

    setIsVisible(true);

    const { audios, cancel } = getAudioShowcase();

    return () => {
      cancel();
      audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.onended = null;
      });
    };
  }, [image, hebrewLetterIntro, i18n.language]);

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
