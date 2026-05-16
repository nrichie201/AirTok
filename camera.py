
import cv2
import mediapipe as mp
import time
import math



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
    
# Likes the tiktok video
def like_action(thumb_tip, index_finger_tip):
    distance = math.sqrt((index_finger_tip.x-thumb_tip.x)** 2   + (index_finger_tip.y - thumb_tip.y)**2)
    if distance <= 0.05:
        print("Liked the tiktok")

def swipe_action():
    print("swiped to next video")

def save_action():
    print("saved Video")

# This loop continuously reads frames from the camera feed, 
# writes them to the output video file, and displays them in a window.
while True:
    
    success, img = cap.read()

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    converted = mp.Image(mp.ImageFormat.SRGB,img_rgb)
    result = landmarker.detect_async(converted, int(time.time() * 1000))
    if landmarks_global:
        for hand in landmarks_global:
            wrist = hand[0]

            #Thumb Finger
            thumb_cmc = hand[1]
            thumb_mcp = hand[2]
            thumb_ip = hand[3]
            thumb_tip = hand[4]

            #Index Finger
            index_finger_mcp = hand[5]
            index_finger_pip = hand[6]
            index_finger_dip = hand[7]
            index_finger_tip = hand[8]

            #Middle Finger
            middle_finger_mcp = hand[9]
            middle_finger_pip = hand[10]
            middle_finger_dip = hand[11]
            middle_finger_tip = hand[12]

            #Ring Finger
            ring_finger_mcp = hand[13]
            ring_finger_pip = hand[14]
            ring_finger_dip = hand[15]
            ring_finger_tip = hand[16]

            #Pinky Finger
            pinky_mcp = hand[17]
            pinky_pip = hand[18]
            pinky_dip = hand[19]
            pinky_tip = hand[20]
            for landmark in hand:
                h, w, c = img.shape
                cv2.circle(img=img, center=(int(w*landmark.x), int(h*landmark.y)) , radius=1, color=(0,255,0), thickness=3) 
                print("drawing circle at", int(w*landmark.x), int(h*landmark.y))
                # print(img is None)
                
                # print(landmark.x, landmark.y)
            like_action(thumb_tip, index_finger_tip)
    
    cv2.imshow("Image",img)
    cv2.waitKey(1)

    




