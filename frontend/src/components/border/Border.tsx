import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Star, StarBorderContainer } from "./Border.styled";

interface StarBorderProps {
  children: ReactNode;
  won: boolean
}

const StarBorder: React.FC<StarBorderProps> = ({ children, won }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<{ top: number; left: number }[]>([]);

  useEffect(() => {
    const createStarPositions = () => {
      if (!containerRef.current) return;

      const { offsetWidth, offsetHeight } = containerRef.current;
      const starSize = 15;
      const positions: { top: number; left: number }[] = [
        // Top row
        { top: starSize / 2, left: starSize / 2 },
        { top: starSize / 2, left: offsetWidth / 4 - starSize / 2 },
        { top: starSize / 2, left: offsetWidth / 2 - starSize / 2 },
        { top: starSize / 2, left: offsetWidth * 0.75 - starSize / 2 },
        { top: starSize / 2, left: offsetWidth - starSize / 2 },

        // Right column
        { top: offsetHeight / 4 - starSize / 2, left: offsetWidth - starSize / 2 },
        { top: offsetHeight / 2 - starSize / 2, left: offsetWidth - starSize / 2 },
        { top: offsetHeight * 0.75 - starSize / 2, left: offsetWidth - starSize / 2 },

        // Bottom row
        { top: offsetHeight - starSize / 2, left: offsetWidth - starSize / 2 },
        { top: offsetHeight - starSize / 2, left: offsetWidth * 0.75 - starSize / 2 },
        { top: offsetHeight - starSize / 2, left: offsetWidth / 2 - starSize / 2 },
        { top: offsetHeight - starSize / 2, left: offsetWidth / 4 - starSize / 2 },
        { top: offsetHeight - starSize / 2, left: starSize / 2 },

        // Left column
        { top: offsetHeight / 4 - starSize / 2, left: starSize / 2 },
        { top: offsetHeight / 2 - starSize / 2, left: starSize / 2 },
        { top: offsetHeight * 0.75 - starSize / 2, left: starSize / 2 }
      ];

      setStars(positions);
    };

    const observer = new ResizeObserver(createStarPositions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <StarBorderContainer ref={containerRef}>
      {won && stars.map((star, index) => (
        <Star key={index} top={star.top} left={star.left} />
      ))}
      {children}
    </StarBorderContainer>
  );
};

export default StarBorder;