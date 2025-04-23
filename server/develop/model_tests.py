import os
import sys
import cv2

script_path = os.path.abspath(__file__)
script_dir = os.path.dirname(script_path)
parent_dir = os.path.dirname(script_dir)
sys.path.insert(0, parent_dir)

from python.functions.server_utils import classify_image

def main():
    base = "photos"
    for im_path in os.listdir(base):
        if im_path.endswith(".jpg") or im_path.endswith(".png"):
            print(f"Processing: {im_path}")
            image = cv2.imread(os.path.join(base, im_path))

            if image is None:
                print(f"Error: Could not read image '{im_path}'. Skipping.")
                continue
            
            res = classify_image(image)
            print(f"Classification results for {im_path}:\n {res}")
            cv2.imshow(f'Processed: {im_path}', image)
            cv2.waitKey(0)
            cv2.destroyAllWindows()
            
            
            
if __name__ == "__main__":
    main()