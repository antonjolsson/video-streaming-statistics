browser.runtime.onMessage.addListener(showOrCloseInfoWindow);

let updateInterval
let numVideoFrames = 0
const NO_VIDEO_MESSAGE = 'Could not find a video element'

function getStats(video) {
    if (!video) {
        return NO_VIDEO_MESSAGE
    }

    const videoWidth = video?.videoWidth
    const videoHeight = video?.videoHeight
    const quality = video.getVideoPlaybackQuality()
    const deltaFrames = numVideoFrames > 0 ? quality.totalVideoFrames - numVideoFrames : 'N/A'
    numVideoFrames = quality.totalVideoFrames
    return `<b>Resolution:</b> ${videoWidth} x ${videoHeight}<br>
            <b>Framerate: </b>${deltaFrames} FPS<br>
            <b>Dropped frames: </b>${quality.droppedVideoFrames} out of ${quality.totalVideoFrames}`
}

function showOrCloseInfoWindow()  {
    let result = document.getElementById('video-stats-div')
    if (result) {
        result.remove()
        numVideoFrames = 0
        clearInterval(updateInterval)
        return
    }
    // browser.runtime.sendMessage({message: 'window visible'})
    const video= document.querySelector('video')
    const stats = getStats(video)
    if (stats === NO_VIDEO_MESSAGE) {
        alert(NO_VIDEO_MESSAGE)
        return
    }

    const div = document.createElement('div')
    div.id = 'video-stats-div'
    div.style.position = 'absolute'
    div.style.display = 'flex'
    div.style.flexDirection = 'column'
    div.style.justifyContent = 'center'
    div.style.alignItems = 'flex-start'
    div.style.top = '1rem'
    div.style.left = '1rem'
    div.style.zIndex = String(Number.MAX_SAFE_INTEGER)
    div.style.background = 'rgba(0 0 0 / 0.5)'
    div.style.color = 'white'
    div.style.padding = '1.2rem 1.4rem'
    div.style.borderRadius = '0.5rem'
    div.style.fontSize = 'calc(max(0.8rem, 12.8px))'

    const closeCross = document.createElement('div')
    closeCross.innerText = 'x'
    closeCross.style.position = 'absolute'
    closeCross.style.top = '0.1rem'
    closeCross.style.right = '0.3rem'
    closeCross.onclick = showOrCloseInfoWindow
    closeCross.style.cursor = 'pointer'

    const p = document.createElement('p')
    p.innerHTML = stats

    const videoParent = video.parentElement
    videoParent.appendChild(div)
    div.appendChild(closeCross)
    div.appendChild(p)

    updateInterval = setInterval(() => {
        p.innerHTML = getStats(video)
    }, 1000)
}