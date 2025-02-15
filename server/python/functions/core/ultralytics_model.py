import numpy as np
import os
from ultralytics import YOLO
from PIL import Image


class UltralyticsModel:
    def load_model(self, path: str):
        self.model = YOLO(path)

    def __init__(self):
        self.load_model(os.path.abspath("core/best.pt"))

    def classify(self, image: np.ndarray) -> dict:
        if not self.model:
            raise Exception("Model not loaded.")
        
        im = Image.fromarray(image)

        results = self.model.predict(im)
        return results
