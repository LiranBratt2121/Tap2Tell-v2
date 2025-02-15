from inference_sdk import InferenceHTTPClient


class RoboflowModel:
    API_URL = "https://classify.roboflow.com"
    ROBOFLOW_API_KEY = "zH3DEeEJl1BppVPa4jJE"
    MODEL_ID = "hebrew-lettersv2/1"

    def __init__(self):
        self.client = InferenceHTTPClient(
            api_url=RoboflowModel.API_URL,
            api_key=RoboflowModel.ROBOFLOW_API_KEY
        )

    def classify(self, url: str):
        print("I AM IN CLASSIFY")
        return self.client.infer(url, RoboflowModel.MODEL_ID)
