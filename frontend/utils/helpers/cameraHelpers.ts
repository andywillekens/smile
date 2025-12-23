export const initializeCamera = async (width: number, height: number) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width,
      height,
    },
  })

  const video = document.createElement('video')
  video.srcObject = stream
  video.autoplay = true
  video.playsInline = true

  return { stream, video }
}

