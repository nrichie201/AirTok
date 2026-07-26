import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

let swipe_up_complete = false
let swipe_down_complete = false
let like_complete = false
let save_complete = false

function swipe_up_action() {
    chrome.runtime.sendMessage({ type: 'gesture', action: 'swipe_up' })
    swipe_up_complete = true
    console.log("swiped to next video")
}

function swipe_down_action() {
    chrome.runtime.sendMessage({ type: 'gesture', action: 'swipe_down' })
    swipe_down_complete = true
    console.log("swiped back to last video")
}

function like_action() {
    chrome.runtime.sendMessage({ type: 'gesture', action: 'like' })
    like_complete = true
    console.log("liked video")
}

async function main() {
    const visionTasks = await FilesetResolver.forVisionTasks("../dist/mediap");
    const handLandmarker = await HandLandmarker.createFromOptions(visionTasks, {
        baseOptions: { modelAssetPath: "../dist/hand_landmarker.task" },
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
        console.log('detectHands running, landmarks:', handLandmarker ? 'ready' : 'not ready');
        const canvas = document.getElementById('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        console.log('canvas size:', canvas.width, 'x', canvas.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        const results = handLandmarker.detectForVideo(canvas, Date.now());
        console.log('hands detected:', results.landmarks.length);
        requestAnimationFrame(detectHands);

        for (let hand of results.landmarks) {
            const wrist = hand[0]
            const thumb_cmc = hand[1]
            const thumb_tip = hand[4]
            const index_finger_tip = hand[8]
            const middle_finger_tip = hand[12]
            const ring_finger_tip = hand[16]
            const pinky_tip = hand[20]

            const distPinkyToWrist = Math.sqrt((pinky_tip.x-wrist.x)**2 + (pinky_tip.y - wrist.y)**2)
            const distRingToWrist = Math.sqrt((ring_finger_tip.x-wrist.x)**2 + (ring_finger_tip.y - wrist.y)**2)
            const distIndexToWrist = Math.sqrt((index_finger_tip.x-wrist.x)**2 + (index_finger_tip.y - wrist.y)**2)
            const distMidToWrist = Math.sqrt((middle_finger_tip.x-wrist.x)**2 + (middle_finger_tip.y - wrist.y)**2)
            const distMiddleToThumb1 = Math.sqrt((middle_finger_tip.x-thumb_cmc.x)**2 + (middle_finger_tip.y - thumb_cmc.y)**2)

            const LA_active = Math.sqrt((index_finger_tip.x-thumb_tip.x)**2 + (index_finger_tip.y - thumb_tip.y)**2)
            const SU_gesture_active = distPinkyToWrist <= 0.3 && distRingToWrist <= 0.3 && distMiddleToThumb1 <= 0.1 && distIndexToWrist >= 0.4
            const SD_gesture_active = distPinkyToWrist <= 0.4 && distRingToWrist <= 0.4 && distMidToWrist >= 0.4 && distIndexToWrist >= 0.4

            if (SD_gesture_active && !swipe_down_complete) {
                swipe_down_action();
            } else if (SU_gesture_active && !swipe_up_complete) {
                swipe_up_action()
            } else if (LA_active <= 0.05 && !like_complete) {
                like_action()
            } else if (!SD_gesture_active && !SU_gesture_active && !(LA_active <= 0.05)) {
                swipe_down_complete = false
                swipe_up_complete = false
                like_complete = false
                save_complete = false
            }

            for (let landmark of hand) {
                const pixelX = landmark.x * canvas.width
                const pixelY = landmark.y * canvas.height
                ctx.beginPath()
                ctx.arc(pixelX, pixelY, 5, 0, Math.PI * 2)
                ctx.fillStyle = '#FF0000'
                ctx.fill()
                ctx.fillStyle = 'black'
                ctx.fillRect(pixelX, pixelY, 5, 5)
            }
        }
    }
}

main()