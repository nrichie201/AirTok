const { HandLandmarker, FilesetResolver } = vision

async function main() {
    const visionTasks = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    const handLandmarker = await HandLandmarker.createFromOptions(visionTasks, {
        baseOptions: {
            modelAssetPath: "hand_landmarker.task"
        },
        numHands: 2
    });

    const video = document.getElementById('video')
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream
        video.play()
    })

    function detectHands() {
        const results = handLandmarker.detectForVideo(video, Date.now())
        console.log(results)
        requestAnimationFrame(detectHands)
    }
    detectHands()
}

main()