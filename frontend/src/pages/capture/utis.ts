// Resize image and return it as base64 URL
export const resizeImage = (base64Url: string, width: number = 640, height: number = 480): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            const resizedBase64Url = canvas.toDataURL();
            resolve(resizedBase64Url);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image"));
        };

        img.src = base64Url;
    });
};
