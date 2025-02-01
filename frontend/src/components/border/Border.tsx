import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Star, StarBorderContainer } from "./Border.styled";

interface StarBorderProps {
  children: ReactNode;
  won: boolean;
}

const StarBorder: React.FC<StarBorderProps> = ({ children, won }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<{ top: number; left: number }[]>([]);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const createStarPositions = () => {
    if (!containerRef.current || !imageDimensions) return;

    const { width, height } = imageDimensions;
    const topStars = 5;
    const sideStars = 3;
    const starSize = 15;
    const padding = starSize - 6;

    const positions: { top: number; left: number }[] = [];

    // Calculate container's offset to center stars around the image
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = (containerRect.width - width) / 2;
    const offsetY = (containerRect.height - height) / 2;

    // Top and bottom edges
    for (let i = 0; i < topStars; i++) {
      const leftPos = offsetX + padding + (i * (width - 2 * padding) / (topStars - 1));
      positions.push({ top: offsetY + padding, left: leftPos });
      positions.push({ top: offsetY + height - padding, left: leftPos });
    }

    // Left and right edges
    for (let i = 1; i < sideStars + 1; i++) {
      const topPos = offsetY + padding + (i * (height - 2 * padding) / (sideStars + 1));
      positions.push({ top: topPos, left: offsetX + padding });
      positions.push({ top: topPos, left: offsetX + width - padding });
    }

    setStars(positions);
  };

  const updateImageDimensions = () => {
    if (!containerRef.current) return;
    
    const imageElement = containerRef.current.querySelector('img');
    if (!imageElement) return;

    const { width, height } = imageElement.getBoundingClientRect();
    setImageDimensions({ width, height });
  };

  // Effect for handling image load and dimensions
  useEffect(() => {
    const handleImageLoad = () => {
      updateImageDimensions();
    };

    const imageElement = containerRef.current?.querySelector('img');
    if (imageElement) {
      imageElement.addEventListener('load', handleImageLoad);
      if (imageElement.complete) {
        handleImageLoad();
      }
    }

    // Set up mutation observer to detect image changes
    const mutationObserver = new MutationObserver(updateImageDimensions);

    if (containerRef.current) {
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
      });
    }

    // Set up resize observer
    const resizeObserver = new ResizeObserver(updateImageDimensions);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (imageElement) {
        imageElement.removeEventListener('load', handleImageLoad);
      }
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  // Separate effect for updating star positions when dimensions change
  useEffect(() => {
    if (imageDimensions) {
      createStarPositions();
    }
  }, [imageDimensions]);

  return (
    <StarBorderContainer ref={containerRef}>
      {won && stars.map((star, index) => (
        <Star 
          key={index} 
          top={star.top} 
          left={star.left}
        />
      ))}
      {children}
    </StarBorderContainer>
  );
};

export default StarBorder;