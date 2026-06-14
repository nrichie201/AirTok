# AirTok

Control TikTok with hand gestures — no touching required.

## Overview
AirTok uses computer vision to detect hand gestures and automate TikTok interactions via browser automation.

## Installation
Install required packages:
```bash
python -m pip install opencv-python mediapipe selenium undetected-chromedriver webdriver-manager
```

## Usage
```bash
python camera.py
```

## Gestures
- **Swipe Up**: Pinky, ring, middle fingers close to wrist → next video
- **Swipe Down**: Pinky, ring, middle close + index to thumb → previous video
- **Like**: Thumb and index pinch → like video

## TODO
- Save gesture implementation
- JavaScript rewrite
- Mobile app support
- Fix Swipe up repeating when held