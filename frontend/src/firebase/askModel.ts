import axios from 'axios';
import { Prediction } from '../pages/capture/types.capture';

const askModel = async (imageUrl: string) => {
    const config = {
        method: 'post',
        url: 'https://us-central1-tap2-fc536.cloudfunctions.net/process_image_function',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            image_url: imageUrl, // Include image_url in the request body
        },
    };

    console.log("IMAGE URL: " + imageUrl);

    try {
        const result = await axios.request(config);
        console.log(`RESULT:\n ${JSON.stringify(result.data)}`);
        const predictions = result.data.result_b64; // Access the result_b64 field
        const resultsArray: Prediction[] = [];

        Object.keys(predictions).forEach((key) => {
            resultsArray.push({ letter: key, confidence: predictions[key] } as Prediction);
        });

        return resultsArray;
    } catch (error) {
        console.error('Error calling the model:', error);
        throw error; // Re-throw the error to handle it in the calling code
    }
};

export default askModel;