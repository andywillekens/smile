import { calculateCountdownAnimation, drawCountdownText } from './countdownHelpers'

export const drawVideoFrame = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement
) => {
  ctx.save()
  ctx.scale(-1, 1)
  ctx.translate(-canvas.width, 0)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  ctx.restore()
}

export const drawVideoWithCountdown = (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  countdown: number | null,
  countdownStartTime: number | null,
  onCountdownComplete: () => void
): boolean => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  drawVideoFrame(ctx, canvas, video)

  if (countdown !== null && countdown > 0 && countdownStartTime !== null) {
    const elapsed = Date.now() - countdownStartTime
    const duration = 1000
    const progress = Math.min(elapsed / duration, 1)

    const { opacity, scale } = calculateCountdownAnimation(progress)

    if (countdown === 1 && progress >= 1) {
      onCountdownComplete()
      return false
    }

    drawCountdownText(ctx, canvas, countdown, opacity, scale)
  }

  return true
}




