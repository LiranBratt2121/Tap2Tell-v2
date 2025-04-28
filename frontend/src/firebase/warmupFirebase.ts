import axios from 'axios';

export const warmUpServer = async () => {
    const warmingImageUrl = "https://dummyimage.com/1x1/ffffff/ffffff.png"; // 1x1 pixel image

    const config = {
        method: 'post',
        url: 'https://us-central1-tap2-fc536.cloudfunctions.net/process_image_function',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            image_url: warmingImageUrl,
        },
    };

    try {
        const res = await axios.request(config)
        return res.status;
    } catch (error) {
        console.error('Error warming up the server:', error);
        return -1;
    }
}