async function ensureOffscreenDocument() {
const existing = await chrome.offscreen.hasDocument?.();
if (existing) return;
await chrome.offscreen.createDocument({
url: 'src/offscreen.html',
reasons: ['USER_MEDIA'],
justification: 'Need camera access for hand gesture detection'
});
}

chrome.runtime.onInstalled.addListener(() => {
ensureOffscreenDocument();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.type === 'gesture') {
chrome.tabs.query({ url: 'https://www.tiktok.com/*' }, (tabs) => {
for (const tab of tabs) {
chrome.tabs.sendMessage(tab.id, message);
}
});
}
});