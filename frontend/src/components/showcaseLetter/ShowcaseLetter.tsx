import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSpring } from '@react-spring/web';
import { ShowcaseProps } from './types.leterBox';
import { letterAssets, additionalAssets } from './assetManger';
import { AnimatedPopup, Overlay } from './styles.showcaseLetter';
import { useTranslation } from 'react-i18next';

const ShowcaseLetter: React.FC<ShowcaseProps> = ({ letter }) => {
  const { image, audio: hebrewLetterIntro } = useMemo(() => letterAssets[letter], [letter]);
  const [isVisible, setIsVisible] = useState(false);
  const { i18n } = useTranslation();

  // Use refs to persist the audio objects across renders
  const hebrewAudioRef = useRef<HTMLAudioElement | null>(null);
  const englishAudioRef = useRef<HTMLAudioElement | null>(null);

  const animationProps = useSpring({
    transform: isVisible ? 'scale(1)' : 'scale(0)',
    config: { tension: 280, friction: 20 },
  });

  useEffect(() => {
    if (!image || !hebrewLetterIntro) {
      return;
    }

    // A flag to prevent issues with multiple effect calls
    let isMounted = true;
    let cleanupFunction: (() => void) | null = null;
    let audioLoadTimeout: ReturnType<typeof setTimeout> | null = null;

    // Reset and create new audio instances for each effect run
    const resetAudios = () => {
      if (hebrewAudioRef.current) {
        hebrewAudioRef.current.pause();
        hebrewAudioRef.current.currentTime = 0;
        hebrewAudioRef.current.onended = null;
        hebrewAudioRef.current = null;
      }
      if (englishAudioRef.current) {
        englishAudioRef.current.pause();
        englishAudioRef.current.currentTime = 0;
        englishAudioRef.current.onended = null;
        englishAudioRef.current = null;
      }
    };
    resetAudios();
    
    // Create new Audio objects and assign them to refs
    hebrewAudioRef.current = new Audio(hebrewLetterIntro);
    hebrewAudioRef.current.preload = 'auto'; // Explicitly hint to the browser to preload

    if (i18n.language === "en") {
      englishAudioRef.current = new Audio(additionalAssets.CurrentEnglishAudio);
      englishAudioRef.current.preload = 'auto'; // Preload the English audio as well
    }

    // Function to handle the actual playback logic
    const handlePlayback = () => {
      if (!isMounted || !hebrewAudioRef.current) return;
      
      const hebrewAudio = hebrewAudioRef.current;
      const englishAudio = englishAudioRef.current;
      const TRIM_TIME_MS = 1500;

      setIsVisible(true);
      
      if (i18n.language === "en") {
        let timeout: ReturnType<typeof setTimeout>;

        hebrewAudio.play();
        timeout = setTimeout(() => {
          if (englishAudio) {
            hebrewAudio.pause();
            hebrewAudio.currentTime = 0;
            englishAudio.play();
          }
        }, TRIM_TIME_MS);

        if (englishAudio) {
          englishAudio.onended = () => {
            setIsVisible(false);
          };
        }
        cleanupFunction = () => {
          if (timeout) clearTimeout(timeout);
          hebrewAudio.pause();
          hebrewAudio.currentTime = 0;
          if (englishAudio) {
            englishAudio.pause();
            englishAudio.currentTime = 0;
            englishAudio.onended = null;
          }
        };
      } else {
        hebrewAudio.onended = () => {
          setIsVisible(false);
        };
        hebrewAudio.play();
        cleanupFunction = () => {
          hebrewAudio.pause();
          hebrewAudio.currentTime = 0;
          hebrewAudio.onended = null;
        };
      }
    };

    // Use a promise to handle the loading state
    const playPromise = new Promise<void>((resolve) => {
      if (hebrewAudioRef.current && hebrewAudioRef.current?.readyState >= 3) { // Check if already loaded
        resolve();
      } else {
        const handleCanPlayThrough = () => {
          if (isMounted) {
            resolve();
          }
          hebrewAudioRef.current?.removeEventListener('canplaythrough', handleCanPlayThrough);
        };
        hebrewAudioRef.current?.addEventListener('canplaythrough', handleCanPlayThrough);

        // A fallback in case 'canplaythrough' never fires (e.g., a network error)
        audioLoadTimeout = setTimeout(() => {
          if (isMounted) {
            console.warn("Audio loading timed out, playing anyway.");
            resolve();
          }
        }, 5000); // 5-second timeout
      }
    });

    playPromise.then(() => {
      if (isMounted) {
        if (audioLoadTimeout) clearTimeout(audioLoadTimeout);
        handlePlayback();
      }
    });

    // Main cleanup function for the effect
    return () => {
      isMounted = false;
      if (audioLoadTimeout) clearTimeout(audioLoadTimeout);
      if (cleanupFunction) {
        cleanupFunction();
      }
      resetAudios();
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