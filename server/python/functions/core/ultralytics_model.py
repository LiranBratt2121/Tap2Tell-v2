import numpy as np
import os
from ultralytics import YOLO
from PIL import Image


class UltralyticsModel:
    def load_model(self, path: str):
        self.model = YOLO(path)

    def __init__(self):
        path = os.path.join(os.path.dirname(__file__), "best.pt")
        print(f'{path} is the model path')
        self.load_model(path)

    def classify(self, image: np.ndarray) -> dict:
        if not self.model:
            raise Exception("Model not loaded.")
        
        im = Image.fromarray(image)
        results = self.model.predict(im)
        
        # Log the results
        print("Model Results:", results)
        if results and hasattr(results[0], 'probs'):
            print("Probs:", results[0].probs)
            print("Top 5 Indices:", results[0].probs.top5)
            print("Top 5 Confidences:", results[0].probs.top5conf)
        
        return results
