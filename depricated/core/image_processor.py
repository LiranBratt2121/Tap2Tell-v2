import numpy as np
import cv2
from PIL import Image
import io
import base64


class ImageProcessor:
    def __ensure_png_format(self, image_b64: str) -> np.ndarray:
        """Ensure the image is in PNG format and convert if necessary."""
        # Decode the base64 string into bytes
        image_data = base64.b64decode(image_b64)

        try:
            # Load the image into a PIL Image object
            img = Image.open(io.BytesIO(image_data))
            print(f"Image format: {img.format}")  # Debugging: log image format

            if img.format != "PNG":
                # Convert to PNG if not already
                print("Converting image to PNG format...")
                output = io.BytesIO()  # Avoid using 'with' to keep the file open
                img.save(output, format="PNG")
                output.seek(0)  # Reset the pointer to the beginning of the file
                img = Image.open(output)  # Reopen the converted image
                print("Image converted to PNG.")  # Debugging

            # Convert to an OpenCV-compatible format (numpy array)
            img_np = np.array(img)
            print(f"Image shape: {img_np.shape}")  # Debugging: log image shape

            if img_np.shape[-1] == 4:  # If PNG has an alpha channel, remove it
                img_np = cv2.cvtColor(img_np, cv2.COLOR_RGBA2RGB)

            return cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
        except Exception as e:
            print(f"Error during image loading and conversion: {e}")
            raise  # Re-raise the exception for further handling

    def process_image(self, image_b64: str) -> str:
        """Process the image from a base64 string and return edge-detected output."""
        try:
            # Ensure the input image is in PNG format
            mat = self.__ensure_png_format(image_b64)
            print("Image loaded and converted successfully.")  # Debugging

            # Step 1: Resize the image for consistent processing
            resized = cv2.resize(mat, (640, 480))

            # Step 2: Convert to grayscale
            gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)

            # Step 3: Perform Fourier Transform to get frequency domain
            dft = cv2.dft(np.float32(gray), flags=cv2.DFT_COMPLEX_OUTPUT)
            dft_shift = np.fft.fftshift(dft)

            # Step 4: Create a circular low-pass filter mask
            rows, cols = gray.shape
            crow, ccol = rows // 2, cols // 2  # Center of the frequency domain
            radius = 100  # Radius for the low-pass filter
            mask = np.zeros((rows, cols, 2), np.uint8)
            cv2.circle(mask, (ccol, crow), radius, (1, 1), thickness=-1)

            # Step 5: Apply the mask and inverse DFT
            fshift = dft_shift * mask
            f_ishift = np.fft.ifftshift(fshift)
            img_back = cv2.idft(f_ishift)
            img_back = cv2.magnitude(img_back[:, :, 0], img_back[:, :, 1])

            # Step 6: Normalize the result to the range [0, 255]
            img_back = cv2.normalize(img_back, None, 0, 255, cv2.NORM_MINMAX)
            img_back = np.uint8(img_back)

            # Step 7: Apply Gaussian blur to the frequency-filtered image (optional)
            blurred = cv2.GaussianBlur(img_back, (5, 5), 0)

            # Step 8: Edge Detection using Canny
            edges = cv2.Canny(blurred, 50, 150)

            # Step 9: Turn to b64 string
            _, buffer = cv2.imencode(".png", edges)
            b64 = base64.b64encode(buffer).decode("utf-8")

            return b64
        except Exception as e:
            print(f"Error processing image: {e}")
            raise  # Re-raise the exception for further handling
