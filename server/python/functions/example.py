import cv2
from cv2 import imread
import numpy as np
from core.ultralytics_model import UltralyticsModel
from PIL import Image  

def detect_objects(image: np.ndarray):
    model = UltralyticsModel()

    results = model.classify(image)
    print(results[0])
    print(results[0].probs)
    
    print({model.model.names.get(i): float(conf) for i, conf in zip(results[0].probs.top5, results[0].probs.top5conf)})
    print(results[0].probs.top5)
def main():
    im = imread("functions/core/he.png")
    
    if im is None:
        print("Error: Image not found or cannot be loaded.")
        return
    
    detect_objects(im)

if __name__ == "__main__":
    main()
