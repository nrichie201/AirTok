
import cv2
import mediapipe as mp
import time



cap = cv2.VideoCapture(0)
img = None
landmarks_global = []


def handle_result(result, output_image, timestamp_ms):
    global landmarks_global
    landmarks_global = result.hand_landmarks
                

# 1. Set your options
options = mp.tasks.vision.HandLandmarkerOptions(
    running_mode= mp.tasks.vision.RunningMode.LIVE_STREAM,
    base_options=mp.tasks.BaseOptions(model_asset_path='hand_landmarker.task'),
    num_hands=2,  # how many hands to detect
    result_callback= handle_result
)

# 2. Create the landmarker using those options
landmarker = mp.tasks.vision.HandLandmarker.create_from_options(options)
    


# This loop continuously reads frames from the camera feed, 
# writes them to the output video file, and displays them in a window.
while True:
    
    success, img = cap.read()

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    converted = mp.Image(mp.ImageFormat.SRGB,img_rgb)
    result = landmarker.detect_async(converted, int(time.time() * 1000))
    if landmarks_global:
        for hand in landmarks_global:
            for landmark in hand:
                h, w, c = img.shape
                cv2.circle(img=img, center=(int(w*landmark.x), int(h*landmark.y)) , radius=1, color=(0,255,0), thickness=3) 
                print("drawing circle at", int(w*landmark.x), int(h*landmark.y))
                # print(img is None)
                
                # print(landmark.x, landmark.y)
    
    cv2.imshow("Image",img)
    cv2.waitKey(1)

    



