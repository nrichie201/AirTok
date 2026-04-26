import math
import cv2
import numpy
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision



cam = cv2.VideoCapture(0)


frame_width = int(cam.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cam.get(cv2.CAP_PROP_FRAME_HEIGHT))

# tells the code what type of format to put it as, in this case, a mp4 video, 
# and then it creates a video writer object that will write the frames to a file 
# called output.mp4, with a frame rate of 20.0 and the same width and height as the camera feed.
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('output.mp4',fourcc, 20.0, (frame_width, frame_height))
runmode = mp.tasks.vision.RunningMode 
base_options = python.BaseOptions(model_asset_path='hand_landmarker.task')

# This loop continuously reads frames from the camera feed, 
# writes them to the output video file, and displays them in a window.
while True:
    ret, frame = cam.read()
    if not ret:
        break

    out.write(frame)

    cv2.imshow('Camera', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


    

cam.release()
out.release()
cv2.destroyAllWindows()
cam.quit()


