import { Prediction, Results } from "../pages/capture/types.capture";
import axios from 'axios';

const getTop3 = (predictions: Prediction[]) => {
    const top3 = [];


    for (let i = 0; i < 2; i++) {
        top3.push(predictions[i]);
    }

    return top3;
}

const askModel = async (imageUrl: string) => {
    const config = {
        method: 'post',
        url: 'https://us-central1-tap2-fc536.cloudfunctions.net/process_image_function',
        headers: {
            'Content-Type': 'application/json',
        },
        data: { image_url: imageUrl },
    };

    console.log("IMAGE URL: " + imageUrl);
    const result = await axios.request(config).then((res) => res.data);
    console.log(`RESULT:\n ${result}`);
    const predictions = result["result_b64"]["predictions"];
    const top3 = getTop3(predictions);
    const detectedCharacter = top3[0];

    return {
        detectedCharacter,
        top3,
    };
};


export default askModel;