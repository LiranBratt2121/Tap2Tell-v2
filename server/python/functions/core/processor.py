import numpy as np
import cv2


class ImageProcessor:
    def process_image(self, img: np.ndarray) -> np.ndarray:
        """Process the image through a combined Fourier Transform and Adaptive Thresholding pipeline."""
        try:
            resized = cv2.resize(img, (640, 480))
            
            # Step 2: Convert to grayscale
            gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
            
            # Step 3: Apply Non-local Means Denoising to reduce wood texture
            denoised = cv2.fastNlMeansDenoising(gray, None, h=15, searchWindowSize=21)
            
            # Step 4: Apply CLAHE with very low clip limit to avoid enhancing wood grain
            clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8,8))
            contrast_enhanced = clahe.apply(denoised)
            
            # Step 5: Apply Gaussian blur
            blurred = cv2.GaussianBlur(contrast_enhanced, (5, 5), 0)
            
            # Step 6: Apply Laplacian edge detection
            laplacian = cv2.Laplacian(blurred, cv2.CV_64F, ksize=3)
            laplacian = cv2.convertScaleAbs(laplacian)
            
            # Step 7: Normalize
            normalized = cv2.normalize(laplacian, None, 0, 255, cv2.NORM_MINMAX)
            
            # Step 8: Enhance strong edges
            enhanced = cv2.addWeighted(normalized, 1.5, np.zeros_like(normalized), 0, 0)
            
            # Step 9: Clean up noise with morphological operations
            kernel = np.ones((3,3), np.uint8)
            cleaned = cv2.morphologyEx(enhanced, cv2.MORPH_CLOSE, kernel)
            
            return cleaned
        except Exception as e:
            print(f"Error during image processing: {e}")
            return None