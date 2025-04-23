import cv2
import numpy as np
import os

input_folder = "test"
output_folder = "output_images"

# Create output folder
os.makedirs(output_folder, exist_ok=True)

for filename in os.listdir(input_folder):
    if not filename.lower().endswith((".png", ".jpg", ".jpeg")):
        continue

    path = os.path.join(input_folder, filename)
    image = cv2.imread(path)

    if image is None:
        print(f"Failed to load {filename}")
        continue

    h, w = image.shape[:2]
    print(f"Processing {filename} (size: {w}x{h})")

    # Adjusted coordinates for your image: covers the "yal" text
    # These are absolute for 768x768 images
    x1, y1 = 45, 625
    x2, y2 = 200, 675

    # Draw mask over the area to inpaint
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[y1:y2, x1:x2] = 255

    # Inpaint the masked region
    inpainted = cv2.inpaint(image, mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)

    output_path = os.path.join(output_folder, filename)
    cv2.imwrite(output_path, inpainted)

print("✅ Done!")
