# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

import json
from firebase_functions import https_fn
from firebase_admin import initialize_app

from core.image_processor import ImageProcessor
from core.roboflow_model import RoboflowModel

initialize_app()


@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("Hello world!!")


@https_fn.on_request()
def process_image_function(req: https_fn.Request) -> https_fn.Response:
    """Firebase function to process a base64 string image."""
    if req.method != "POST":
        return https_fn.Response("Only POST requests are supported.", status=405)

    # Parse JSON body
    try:
        data = req.get_json()
        image_b64 = data.get("image_b64")
        if not image_b64:
            return https_fn.Response("Missing 'image_b64' in request body.", status=400)
    except Exception as e:
        return https_fn.Response(f"Error parsing request body: {str(e)}", status=400)

    # Process the image
    try:
        processor = ImageProcessor()
        model = RoboflowModel()

        result_b64 = processor.process_image(image_b64)
        results = model.classify(result_b64)
        print("I AM AFTER CLASSIFY")
        return https_fn.Response(
            response=json.dumps({"result_b64": results}),
            status=200,
            mimetype="application/json",
        )

    except Exception as e:
        return https_fn.Response(f"Error processing image: {str(e)}", status=500)
