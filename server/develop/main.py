import sys
import os
import cv2

script_path = os.path.abspath(__file__)
script_dir = os.path.dirname(script_path)
parent_dir = os.path.dirname(script_dir)
sys.path.insert(0, parent_dir)
# --- End of fix ---

# Now the import should work because 'server' is in sys.path
from python.functions.core.processor import ImageProcessor

def main():
    processor = ImageProcessor()

    # Make sure 'photos' and 'output' are relative to the script's location (develop)
    photos_dir = os.path.join(script_dir, 'photos')
    output_dir = os.path.join(script_dir, 'output')
    os.makedirs(output_dir, exist_ok=True) # Ensure the output_dir directory exists

    if not os.path.isdir(photos_dir):
        print(f"Error: Directory 'photos' not found in {script_dir}")
        return

    os.makedirs(output_dir, exist_ok=True) # Create output dir relative to script

    print(f"Looking for images in: {photos_dir}")
    print(f"Saving processed images to: {output_dir}")

    image_files = [f for f in os.listdir(photos_dir) if os.path.isfile(os.path.join(photos_dir, f))]

    if not image_files:
        print(f"No image files found in {photos_dir}")
        return

    for filename in image_files:
        file_path = os.path.join(photos_dir, filename)
        print(f"Processing: {file_path}")
        img = cv2.imread(file_path)

        if img is None:
            print(f"Error: Could not read image '{filename}'. Skipping.")
            continue # Skip to the next image

        try:
            res = processor.process_image(img)

            # Define output path
            output_path = os.path.join(output_dir, filename)

            # Save the processed image FIRST
            success = cv2.imwrite(output_path, res)
            if success:
                print(f"Saved processed image to: {output_path}")
            else:
                 print(f"Error: Failed to save image to {output_path}")

            # Then show it
            cv2.imshow(f'Processed: {filename}', res)
            cv2.imshow('Original', cv2.resize(img, (640, 480)))
            print("Press any key to continue to the next image (or close the window)...")
            cv2.waitKey(0)
            cv2.destroyAllWindows() # Close the specific window after key press

        except Exception as e:
            print(f"Error processing image '{filename}': {e}")
            # Optionally destroy windows if an error occurs during processing
            cv2.destroyAllWindows()


    print("Finished processing all images.")
    # Ensure all windows are closed at the very end if the loop finishes normally
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()