import os
from PIL import Image


def crop(path: str, src="media"):
    im = Image.open(os.path.join(src, path))

    width, height = im.size

    top_crop = height * 0.2
    bottom_crop = height - height * 0.2

    cropped = im.crop((0, top_crop, width, bottom_crop))

    return cropped, path


def main():
    src = "media"
    out_dir = "media_cropped"
    image_paths = os.listdir(src)

    os.makedirs(out_dir, exist_ok=True)
    
    for path in image_paths:
        cropped, name = crop(path)
        cropped.save(os.path.join(out_dir, name))
        
if __name__ == "__main__":
    main()
