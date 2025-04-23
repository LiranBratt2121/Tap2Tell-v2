import numpy as np
import cv2

class ImageProcessor:
    def process_image(self, img: np.ndarray) -> np.ndarray:
        try:
            resized = cv2.resize(img, (640, 480))
            gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

            # 1. Pre-smoothing: Try Median Blur
            blurred = cv2.medianBlur(gray, 5) # Tune kernel size (3, 5, 7)

            # 2. Canny Edge Detection - Tune thresholds!
            canny_edges = cv2.Canny(blurred, 40, 120, apertureSize=3) # Tune thresholds (e.g., 50,100 / 40,120) and apertureSize (3 or 5)

            # 3. Post-processing: Contour Filtering
            contours, hierarchy = cv2.findContours(canny_edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
            filtered_edges = np.zeros_like(canny_edges)
            min_contour_length = 25 # <<< TUNE THIS VALUE

            for contour in contours:
                length = cv2.arcLength(contour, closed=False)
                if length > min_contour_length:
                    cv2.drawContours(filtered_edges, [contour], -1, (255), thickness=1)

            # 4. Optional: Morphological Closing on filtered edges
            kernel_close = np.ones((3,3), np.uint8) # Tune kernel size/iterations
            final_output = cv2.morphologyEx(filtered_edges, cv2.MORPH_CLOSE, kernel_close, iterations=1)

            return final_output

        except Exception as e:
            print(f"Error during image processing: {e}")
            return np.zeros((480, 640), dtype=np.uint8)