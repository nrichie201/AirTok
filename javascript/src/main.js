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
    video.style.display = 'none'
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream
        video.play()
        setTimeout(() => detectHands(), 1000)
    })

    function detectHands() {

    const canvas = document.getElementById('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const results = handLandmarker.detectForVideo(canvas, Date.now());
    console.log(results);
    requestAnimationFrame(detectHands);
    console.log("Drawing landmarks:", results.landmarks.length)
    for (let hand of results.landmarks) {
        for (let landmark of hand) {
            const pixelX = landmark.x * canvas.width
            const pixelY = landmark.y * canvas.height
            console.log("canvas size:", canvas.width, canvas.height) 
            console.log("drawing at:", pixelX, pixelY)
            ctx.beginPath()
            ctx.arc(pixelX, pixelY, 5, 0, Math.PI * 2)  // full circle
            ctx.fillStyle = '#FF0000'  // red
            console.log("drawing at", pixelX, pixelY)
            ctx.fill()

            ctx.fillStyle = 'black'
             
            ctx.fillRect(pixelX, pixelY, 5, 5)
        }
    }
    }

    
    
}

main()