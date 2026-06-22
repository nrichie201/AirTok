
import cv2
import mediapipe as mp
import time
import math
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import undetected_chromedriver as uc
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC



cap = cv2.VideoCapture(0)
img = None
landmarks_global = []

swipe_up_complete = False
swipe_down_complete = False
like_complete = False
save_complete = False

#Uses chrome to run the handgesture integration
driver = uc.Chrome(version_main=148)
driver.get("https://www.tiktok.com/")
assert "TikTok" in driver.title
elem = driver.find_element(By.TAG_NAME, "body")




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
def like_action():
    global like_complete
    elem.send_keys("L")
    like_complete = True
    print("Liked the tiktok")

#swiping up
def swipe_up_action():
    global swipe_up_complete
    elem.send_keys(Keys.ARROW_DOWN)
    swipe_up_complete = True
    print("swiped to next video")

#swiping down
def swipe_down_action():
    
    global swipe_down_complete
    elem.send_keys(Keys.ARROW_UP)
    swipe_down_complete = True
    print("swiping back to previous video")
    

# #saving video
# def save_action():
#     global save_complete
#     try:
#         element = WebDriverWait(driver, 10).until(
#             EC.element_to_be_clickable((By.XPATH, "//*[contains(@aria-label, 'Favorit')]"))
#             )
#         element.click()
#         save_complete = True
#         print("save action fired!")
#     except:
#         print("save button not found")

#Main function, processes the landmarks and calls on each action function each frame.
def process_landmark():
    global swipe_down_complete
    global swipe_up_complete
    global like_complete
    global save_complete
    frame_count = 0
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

            #Distance Calculations
            distPinkyToWrist = math.sqrt((pinky_tip.x-wrist.x)** 2   + (pinky_tip.y - wrist.y)**2)
            distRingToWrist = math.sqrt((ring_finger_tip.x-wrist.x)** 2   + (ring_finger_tip.y - wrist.y)**2)
            distIndexToWrist = math.sqrt((index_finger_tip.x-wrist.x)** 2   + (index_finger_tip.y - wrist.y)**2)
            distMidToWrist = math.sqrt((middle_finger_tip.x-wrist.x)** 2   + (middle_finger_tip.y - wrist.y)**2)
            distMiddleToThumb1 = math.sqrt((middle_finger_tip.x-thumb_cmc.x)** 2   + (middle_finger_tip.y - thumb_cmc.y)**2)
            distIndexToThumb1 = math.sqrt((index_finger_tip.x-thumb_cmc.x)** 2   + (index_finger_tip.y - thumb_cmc.y)**2)

            #Active action functions Checker
            SA_active = math.sqrt((middle_finger_tip.x-thumb_tip.x)** 2   + (middle_finger_tip.y - thumb_tip.y)**2)
            LA_active = math.sqrt((index_finger_tip.x-thumb_tip.x)** 2   + (index_finger_tip.y - thumb_tip.y)**2)
            SU_gesture_active = distPinkyToWrist <= 0.3 and distRingToWrist <= 0.3 and distMiddleToThumb1 <= 0.1 and distIndexToWrist >= 0.4
            SD_gesture_active = distPinkyToWrist <= 0.4 and distRingToWrist <= 0.4 and distMidToWrist >= 0.4 and distIndexToWrist >= 0.4

            
            #print("distIndex:", distIndexToWrist, "distMid:", distMidToWrist)

            #Checks if the swipe-down gesture is active and if the action was already completed
            if SD_gesture_active and not swipe_down_complete:
                swipe_down_action()
            
            #Checks if the swipe-up gesture is active and if the action was already completed
            elif SU_gesture_active and not swipe_up_complete:
                swipe_up_action()
            
            #Checks if like-action gesture is active and if the action was alreadu completed
            elif LA_active <= 0.05 and not like_complete:
                like_action()
            # elif SA_active <= 0.05 and not save_complete:
            #     save_action()
            elif not SD_gesture_active and not SU_gesture_active and not (LA_active <= 0.05):
                swipe_down_complete = False
                swipe_up_complete = False
                like_complete = False
                save_complete = False
            else:
                pass


            
            for landmark in hand:
                h, w, c = img.shape
                cv2.circle(img=img, center=(int(w*landmark.x), int(h*landmark.y)) , radius=1, color=(0,255,0), thickness=3) 
                #print("drawing circle at", int(w*landmark.x), int(h*landmark.y))
                # print(img is None)
                
                # print(landmark.x, landmark.y)
            

# This loop continuously reads frames from the camera feed, 
# writes them to the output video file, and displays them in a window.
while True:

    success, img = cap.read()

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    converted = mp.Image(mp.ImageFormat.SRGB,img_rgb)
    result = landmarker.detect_async(converted, int(time.time() * 1000))
    if landmarks_global:
        process_landmark()
    
    cv2.imshow("Image",img)
    cv2.waitKey(1)

    




