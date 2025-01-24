import cv2
import numpy as np
from sklearn.cluster import KMeans

def get_dominant_color(image, k=1):
    pixels = image.reshape(-1, 3)
    kmeans = KMeans(n_clusters=k, random_state=0)
    kmeans.fit(pixels)
    dominant_color = kmeans.cluster_centers_[0]
    return dominant_color

def remove_bg_dynamic(im: cv2.Mat, color_tolerance=50):
    resized = cv2.resize(im, (100, 100), interpolation=cv2.INTER_AREA)
    dominant_color = get_dominant_color(resized).astype(int)
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    dominant_color_hsv = cv2.cvtColor(np.uint8([[dominant_color]]), cv2.COLOR_BGR2HSV)[0][0]
    lower_bound = np.array([dominant_color_hsv[0] - color_tolerance, 50, 50])
    upper_bound = np.array([dominant_color_hsv[0] + color_tolerance, 255, 255])
    
    mask = cv2.inRange(hsv, lower_bound, upper_bound)
    rgba = cv2.cvtColor(im, cv2.COLOR_BGR2BGRA)
    rgba[mask == 255] = [0, 0, 0, 0]
    return rgba

def main():
    path = "image border.jpg"
    mat = cv2.imread(path)
    no_background = remove_bg_dynamic(mat)
    cv2.imshow("Background Removed", no_background)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
