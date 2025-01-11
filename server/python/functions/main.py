import json
import requests
import base64
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from core.image_processor import ImageProcessor
from core.roboflow_model import RoboflowModel

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
        print("IMAGE URL: " + image_url)
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
        print("trying to request")
        response = requests.get(image_url, stream=True)
        if response.status_code != 200:
            return https_fn.Response(
                f"Error fetching image from URL: {response.status_code}",
                status=400,
                headers={},  # No need to manually set CORS headers here
            )

        # Make sure the image data is processed properly
        image_data = response.content
        image_b64 = base64.b64encode(image_data).decode("utf-8", "ignore")

        # Process the image
        processor = ImageProcessor()
        model = RoboflowModel()

        processed_image_b64 = processor.process_image(image_b64)
        results = model.classify(processed_image_b64)

        return https_fn.Response(
            response=json.dumps({"result_b64": results}),
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
