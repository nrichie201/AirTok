
import cv2
import mediapipe as mp



cap = cv2.VideoCapture(0)


# 1. Set your options
options = mp.tasks.vision.HandLandmarkerOptions(
    base_options=mp.tasks.BaseOptions(model_asset_path='hand_landmarker.task'),
    num_hands=2  # how many hands to detect
)

# 2. Create the landmarker using those options
landmarker = mp.tasks.vision.HandLandmarker.create_from_options(options)
    


# This loop continuously reads frames from the camera feed, 
# writes them to the output video file, and displays them in a window.
while True:
    success, img = cap.read()

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    converted = mp.Image(mp.ImageFormat.SRGB,img_rgb)
    result = landmarker.detect(converted)
    print(result)
   
    

    cv2.imshow("Image", img)
    cv2.waitKey(1)

    



