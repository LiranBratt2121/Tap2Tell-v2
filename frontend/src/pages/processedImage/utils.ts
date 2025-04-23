import axios, { AxiosRequestConfig } from 'axios';
import { Letters } from '../../components/letterBox/types.letterBox';

export const getProcessedImageBase64 = async (imageUrl: string): Promise<string> => {
    // URL of your deployed process-and-return-image function
    const functionUrl = 'https://process-and-return-image-cvoftbjb2q-uc.a.run.app';

    // --- Input Validation ---
    if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error("Invalid image URL provided.");
    }
    // Optional: Basic check if it looks like a URL
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
         console.warn("Provided URL might not be valid:", imageUrl);
    }
    // ---------------------

    const config: AxiosRequestConfig = { // Use AxiosRequestConfig type for clarity
        method: 'post',
        url: functionUrl,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            image_url: imageUrl, // Body expected by your Cloud Function
        },
    };

    console.log(`Calling ${functionUrl} with IMAGE URL: ${imageUrl}`);

    try {
        // Make the request, expecting ProcessedImageResponse structure
        const result = await axios.request(config);

        console.log(`RESULT:\n ${JSON.stringify(result.data)}`);

        // Extract the base64 data URL string from the response
        const base64DataUrl = result.data.image_base64;

        // --- Response Validation ---
        if (typeof base64DataUrl !== 'string' || !base64DataUrl.startsWith('data:image/')) {
            console.error("Invalid response format received:", result.data);
            throw new Error("Received invalid base64 data format from the function.");
        }
        // ------------------------

        // Return only the base64 data URL string
        return base64DataUrl;

    } catch (error: any) { // Catch block to handle errors
        // Log more specific Axios error details if available
        if (axios.isAxiosError(error)) {
             console.error(
                'Axios error calling the function:',
                error.response?.status, // Status code (e.g., 400, 500)
                error.response?.data || error.message // Response body or error message
             );
        } else {
             console.error('Error calling the function:', error);
        }
        throw error; // Re-throw the error so the calling code can handle it
    }
};

export const similarHebrewLetters: Record<Letters, Letters[]> = {
    Alef: ["Ayin"],
    Bet: ["Kaf"],
    Gimel: [],
    Dalet: ["Resh", "Resh"],
    He: ["Qof"],
    Vav: ["Zayin", "Yod", "Resh"],
    Zayin: ["Vav", "Yod"],
    Het: ["He"],
    Tet: ["Samech"],
    Yod: ["Vav", "Zayin", "Resh", "Dalet"],
    Kaf: ["Bet", "Qof"],
    Lamed: [],
    Mem: ["Samech"],
    Nun: [],
    Samech: ["Tet", "Mem"],
    Ayin: ["Alef"],
    Peh: ["Tsadeh"],
    Tsadeh: ["Nun", "Peh"],
    Qof: ["Kaf", "Resh", "He"],
    Resh: ["Dalet", "Yod", "Vav"],
    Shin: [],
    Tav: [],
  };