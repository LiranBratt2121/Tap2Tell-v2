import json
import base64

import requests
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from core.processor import ImageProcessor
from core.ultralytics_model import UltralyticsModel
import numpy as np
from PIL import Image
from io import BytesIO

initialize_app()


# Enable CORS for all origins (development)
@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],  # Allow all origins for development
        cors_methods=["POST", "OPTIONS"],
    )
)
def process_image_function(req: https_fn.Request) -> https_fn.Response:
    """Firebase function to process an image URL."""
    if req.method == "OPTIONS":
        # Handle preflight requests
        return https_fn.Response(
            status=204,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        )

    if req.method != "POST":
        return https_fn.Response(
            "Only POST requests are supported.",
            status=405,
            headers={},  # No need to manually set CORS headers here
        )

    # Parse JSON body
    try:
        data = req.get_json()
        image_url = data.get("image_url")
        # print("IMAGE URL: " + image_url)
        if not image_url:
            return https_fn.Response(
                "Missing 'image_url' in request body.",
                status=400,
                headers={},  # No need to manually set CORS headers here
            )
    except Exception as e:
        return https_fn.Response(
            f"Error parsing request body: {str(e)}",
            status=400,
            headers={},  # No need to manually set CORS headers here
        )

    # Fetch the image from the URL and convert to base64
    try:
        image_bytes = requests.get(image_url).content
        # Convert bytes to numpy array
        image = Image.open(BytesIO(image_bytes))
        image_np = np.array(image)

        # Process the image
        processor = ImageProcessor()
        model = UltralyticsModel()
        
        processed_img = processor.process_image(image_np)
        results = model.classify(processed_img)
        return https_fn.Response(
            response=json.dumps({"result_b64": {model.model.names.get(idx): float(conf) for idx, conf in zip(results[0].probs.top5, results[0].probs.top5conf)}}),
            status=200,
            mimetype="application/json",
            headers={},  # No need to manually set CORS headers here
        )

    except Exception as e:
        return https_fn.Response(
            f"Error processing image: {str(e)}",
            status=500,
            headers={},  # No need to manually set CORS headers here
        )

