export const drawNotFoundImage = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 120px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('?', canvas.width / 2, canvas.height / 2)
}

export const capturePictureFromVideo = (canvas: HTMLCanvasElement, video: HTMLVideoElement) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.save()
  ctx.scale(-1, 1)
  ctx.translate(-canvas.width, 0)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  ctx.restore()
}

export const downloadCompositePicture = async (
  canvas: HTMLCanvasElement,
  frameImagePath: string,
  onComplete?: () => void
) => {
  const frameImg = new Image()
  frameImg.crossOrigin = 'anonymous'

  frameImg.onload = () => {
    const frameElement = document.querySelector('img[alt="Smile"]') as HTMLImageElement
    if (!frameElement) return

    const frameRect = frameElement.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    const compositeCanvas = document.createElement('canvas')
    const ctx = compositeCanvas.getContext('2d')
    if (!ctx) return

    const frameWidth = 960
    const frameHeight = frameImg.height * (frameWidth / frameImg.width)
    compositeCanvas.width = frameWidth
    compositeCanvas.height = frameHeight

    ctx.drawImage(frameImg, 0, 0, frameWidth, frameHeight)

    const scaleX = frameWidth / frameRect.width
    const scaleY = frameHeight / frameRect.height

    const canvasX = (canvasRect.left - frameRect.left) * scaleX
    const canvasY = (canvasRect.top - frameRect.top) * scaleY
    const canvasWidth = canvasRect.width * scaleX
    const canvasHeight = canvasRect.height * scaleY

    ctx.drawImage(canvas, canvasX, canvasY, canvasWidth, canvasHeight)

    compositeCanvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `smile-photo-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      if (onComplete) {
        onComplete()
      }
    }, 'image/png')
  }

  frameImg.src = frameImagePath
}
