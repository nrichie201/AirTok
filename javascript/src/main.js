import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

async function main() {
    const visionTasks = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    const handLandmarker = await HandLandmarker.createFromOptions(visionTasks, {
        baseOptions: {
            modelAssetPath: "hand_landmarker.task"
        },
        numHands: 2,
        runningMode: "VIDEO"
    });

    const video = document.getElementById('video')
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream
        video.play()
        setTimeout(() => detectHands(), 1000)
    })

    function detectHands() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const results = handLandmarker.detectForVideo(canvas, Date.now());
    console.log(results);
    requestAnimationFrame(detectHands);
    }
}

main()