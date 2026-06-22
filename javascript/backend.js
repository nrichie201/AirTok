import cv from '@techstark/opencv-js';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'



let video = document.getElementById('videoInput');
let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
let cap = new cv.VideoCapture(video);

const FPS = 30;
function processVideo() {
    let begin = Date.now();
    
    // Capture frame
    cap.read(src);
    
    // Convert to grayscale
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    
    // Display
    cv.imshow('canvasOutput', dst);
    
    // Schedule next frame
    let delay = 1000/FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
}

// Start camera
navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            processVideo();
        };
    })
    .catch(err => {
        console.error('Camera error:', err);
    });