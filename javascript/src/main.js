import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
let swipe_up_complete = false
let swipe_down_complete = false
let like_complete = false
let save_complete = false


function swipe_up_action() {
    const swipe_next = new KeyboardEvent('keydown', { key: 'ArrowUp' })
    document.dispatchEvent(swipe_next)
    swipe_up_complete = true
    console.log("swiped to next video")
}

function swipe_down_action() {
    const swipe_back = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    document.dispatchEvent(swipe_back)
    swipe_down_complete = true
    console.log("swiped back to last video")
}

function like_action() {
    const like = new KeyboardEvent('keydown', { key: 'l' })
    document.dispatchEvent(like)
    like_complete = true
    console.log("liked video")
}

async function main() {
    const visionTasks = await FilesetResolver.forVisionTasks(
    "/mediap"
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
    //console.log(results);
    requestAnimationFrame(detectHands);
    //console.log("Drawing landmarks:", results.landmarks.length)



    for (let hand of results.landmarks) {
        const wrist = hand[0]

        //Thumb Finger
        const thumb_cmc = hand[1]
        const thumb_mcp = hand[2]
        const thumb_ip = hand[3]
        const thumb_tip = hand[4]

        //Index Finger
        const index_finger_mcp = hand[5]
        const index_finger_pip = hand[6]
        const index_finger_dip = hand[7]
        const index_finger_tip = hand[8]
                


        //Middle Finger
        const middle_finger_mcp = hand[9]
        const middle_finger_pip = hand[10]
        const middle_finger_dip = hand[11]
        const middle_finger_tip = hand[12]

        //Ring Finger
        const ring_finger_mcp = hand[13]
        const ring_finger_pip = hand[14]
        const ring_finger_dip = hand[15]
        const ring_finger_tip = hand[16]

        //Pinky Finger
        const pinky_mcp = hand[17]
        const pinky_pip = hand[18]
        const pinky_dip = hand[19]
        const pinky_tip = hand[20]

        //Distance Calculations
        const distPinkyToWrist = Math.sqrt((pinky_tip.x-wrist.x)** 2   + (pinky_tip.y - wrist.y)**2)
        const distRingToWrist = Math.sqrt((ring_finger_tip.x-wrist.x)** 2   + (ring_finger_tip.y - wrist.y)**2)
        const distIndexToWrist = Math.sqrt((index_finger_tip.x-wrist.x)** 2   + (index_finger_tip.y - wrist.y)**2)
        const distMidToWrist = Math.sqrt((middle_finger_tip.x-wrist.x)** 2   + (middle_finger_tip.y - wrist.y)**2)
        const distMiddleToThumb1 = Math.sqrt((middle_finger_tip.x-thumb_cmc.x)** 2   + (middle_finger_tip.y - thumb_cmc.y)**2)
        const distIndexToThumb1 = Math.sqrt((index_finger_tip.x-thumb_cmc.x)** 2   + (index_finger_tip.y - thumb_cmc.y)**2)

        //Active action functions Checker
        const SA_active = Math.sqrt((middle_finger_tip.x-thumb_tip.x)** 2   + (middle_finger_tip.y - thumb_tip.y)**2)
        const LA_active = Math.sqrt((index_finger_tip.x-thumb_tip.x)** 2   + (index_finger_tip.y - thumb_tip.y)**2)
        const SU_gesture_active = distPinkyToWrist <= 0.3 && distRingToWrist <= 0.3 && distMiddleToThumb1 <= 0.1 && distIndexToWrist >= 0.4
        const SD_gesture_active = distPinkyToWrist <= 0.4 && distRingToWrist <= 0.4 && distMidToWrist >= 0.4 && distIndexToWrist >= 0.4

        //Checks if the swipe-down gesture is active and if the action was already completed
        if (SD_gesture_active && !swipe_down_complete) {
            swipe_down_action();
        }
            
        //Checks if the swipe-up gesture is active and if the action was already completed
        else if (SU_gesture_active && !swipe_up_complete){
            swipe_up_action()
        }
            
        //Checks if like-action gesture is active and if the action was alreadu completed
        else if (LA_active <= 0.05 && !like_complete) {
            like_action()
        }

        //elif SA_active <= 0.05 and not save_complete:
        //     save_action()

        else if (!SD_gesture_active && !SU_gesture_active && !(LA_active <= 0.05)){
            swipe_down_complete = false
            swipe_up_complete = false
            like_complete = false
            save_complete = false
        }
        else {
            //Pass
        }

        for (let landmark of hand) {
            const pixelX = landmark.x * canvas.width
            const pixelY = landmark.y * canvas.height
            //console.log("canvas size:", canvas.width, canvas.height) 
            //console.log("drawing at:", pixelX, pixelY)
            ctx.beginPath()
            ctx.arc(pixelX, pixelY, 5, 0, Math.PI * 2)  // full circle
            ctx.fillStyle = '#FF0000'  // red
            //console.log("drawing at", pixelX, pixelY)
            ctx.fill()

            ctx.fillStyle = 'black'
             
            ctx.fillRect(pixelX, pixelY, 5, 5)
        }
    }
    }

    
    
}

main()