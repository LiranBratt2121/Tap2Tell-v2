import axios from 'axios';
import { Prediction } from '../pages/capture/types.capture';


const askModel = async (imageUrl: string) => {
    const config = {
        method: 'post',
        url: 'https://process-image-function-cvoftbjb2q-uc.a.run.app',
        headers: {
            'Content-Type': 'application/json',
        },
        data: { image_url: imageUrl },
    };

    console.log("IMAGE URL: " + imageUrl);
    const result = await axios.request(config).then((res) => res.data);
    console.log(`RESULT:\n ${result}`);
    const predictions = result["result_b64"];
    const resultsArray: Prediction[] = []

    Object.keys(predictions).map((key) => { 
        resultsArray.push({letter: key, confidence: predictions[key]} as Prediction);
    });

    return resultsArray;
};


export default askModel;