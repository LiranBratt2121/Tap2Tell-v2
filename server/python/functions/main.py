import json
import requests
from firebase_functions import https_fn, options
from firebase_admin import initialize_app
from core.ultralytics_model import UltralyticsModel
from server_utils import np_array_to_base64, process_image

initialize_app()

# Initialize the model once
model = UltralyticsModel()

# Common CORS headers
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


options.set_global_options(
    region="us-central1",
    memory=options.MemoryOption.GB_2,
    cpu=2,
    timeout_sec=30
)

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],  # Allow all origins for development
        cors_methods=["POST", "OPTIONS"],
    )
)
def process_image_function(req: https_fn.Request) -> https_fn.Response:
    """Firebase function to process an image URL."""

    if req.method == "OPTIONS":
        return https_fn.Response(status=204, headers=CORS_HEADERS)

    if req.method != "POST":
        return https_fn.Response("Only POST requests are supported.", status=405)

    # Parse JSON body
    try:
        data = req.get_json()
        image_url = data.get("image_url")
        if not image_url:
            return https_fn.Response("Missing 'image_url' in request body.", status=400)
    except json.JSONDecodeError:
        return https_fn.Response("Invalid JSON format in request body.", status=400)

    # Fetch and process the image
    try:
        processed_img = process_image(image_url)
        results = model.classify(processed_img)

        response_data = {
            "result_b64": {
                model.model.names.get(idx): float(conf)
                for idx, conf in zip(results[0].probs.top5, results[0].probs.top5conf)
            }
        }

        return https_fn.Response(
            response=json.dumps(response_data),
            status=200,
            mimetype="application/json",
        )

    except requests.RequestException as e:
        return https_fn.Response(f"Error fetching image: {str(e)}", status=500)

    except Exception as e:
        return https_fn.Response(f"Error processing image: {str(e)}", status=500)


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins=["*"],  # Allow all origins for development
        cors_methods=["POST", "OPTIONS"],
    )
)
def process_and_return_image(req: https_fn.Request) -> https_fn.Response:
    """Fetch and process the image, then return the processed image."""

    if req.method == "OPTIONS":
        return https_fn.Response(status=204, headers=CORS_HEADERS)
    if req.method != "POST":
        return https_fn.Response("Only POST requests are supported.", status=405)
    try:
        data = req.get_json()
        image_url = data.get("image_url")

        if not image_url:
            return https_fn.Response("Missing 'image_url' in request body.", status=400)

        processed_img = process_image(image_url)  # Call the processing function

        base64_string, img_format = np_array_to_base64(processed_img)
        
        response_data = {
            "image_base64": f"data:image/{img_format.lower()};base64,{base64_string}"
        }
        
        return https_fn.Response(
            response=json.dumps(response_data),
            status=200,
            mimetype="application/json",
        )

    except json.JSONDecodeError:
        return https_fn.Response("Invalid JSON format in request body.", status=400)

    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return https_fn.Response(
            f"Internal server error during image processing. {e}",
            status=500,
            headers=CORS_HEADERS
        )
