from typing import Tuple
import cv2

def resize(mat: cv2.Mat, size: Tuple[int, int]):
    return cv2.resize(mat, size)
    
def main():
    im_path = "star.png"
    output_path = "star_resized.png"
    mat = cv2.imread(im_path, cv2.IMREAD_UNCHANGED)
    resized = resize(mat, size=(81, 81))
    
    cv2.imwrite(output_path, resized)
    
if __name__ == '__main__':
    main()