document.getElementById('grant').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('popup.html?fullpage=true') })
})

if (new URLSearchParams(window.location.search).get('fullpage')) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    stream.getTracks().forEach(track => track.stop())
    document.body.innerHTML = '<p>Camera access granted! You can close this tab.</p>'
  }).catch(err => {
    document.body.innerHTML = '<p>Error: ' + err.message + '</p>'
  })
}