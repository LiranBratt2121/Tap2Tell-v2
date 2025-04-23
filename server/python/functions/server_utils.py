import base64
from io import BytesIO
from PIL import Image
import numpy as np
import requests

from core.processor import ImageProcessor
from typing import Tuple, Dict

from core.ultralytics_model import UltralyticsModel

def process_image(image_url: str) -> np.ndarray:
    processor = ImageProcessor()

    image_bytes = requests.get(image_url).content
    # Convert bytes to numpy array
    image = Image.open(BytesIO(image_bytes))
    image_np = np.array(image)

    processed_img = processor.process_image(image_np)

    return processed_img

def classify_image(image: np.ndarray) -> Dict[str, float]:
    classifier = UltralyticsModel()
    results = classifier.classify(image)
    
    top5 = {classifier.model.names.get(idx): float(conf) for idx, conf in zip(results[0].probs.top5, results[0].probs.top5conf)}
    
    return top5

def np_array_to_base64(np_array: np.ndarray, img_format: str = "PNG") -> Tuple[str, str]:
    pil_img = Image.fromarray(np_array)
    buffer = BytesIO()
    pil_img.save(buffer, format=img_format)
    base64_string = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return base64_string, img_format
