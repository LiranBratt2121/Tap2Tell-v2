import cv2
from cv2 import imread
import numpy as np
from core.ultralytics_model import UltralyticsModel
from core.processor import ImageProcessor
from PIL import Image  

def detect_objects(image: np.ndarray):
    model = UltralyticsModel()
    detector = ImageProcessor()
    
    results = model.classify(detector.process_image(image))
    print(results[0])
    print(results[0].probs)
    
    print({model.model.names.get(i): float(conf) for i, conf in zip(results[0].probs.top5, results[0].probs.top5conf)})
    print(results[0].probs.top5)
    
def main():
    cap = cv2.VideoCapture(0)
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        cv2.imshow('Frame', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        
        to_capture = frame.copy()

    cap.release()
    cv2.destroyAllWindows()

    detect_objects(to_capture)
        
if __name__ == "__main__":
    main()
