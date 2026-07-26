chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== 'gesture') return

    let key
    if (message.action === 'swipe_up') key = 'ArrowUp'
    else if (message.action === 'swipe_down') key = 'ArrowDown'
    else if (message.action === 'like') key = 'l'

    if (key) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key }))
    }
})