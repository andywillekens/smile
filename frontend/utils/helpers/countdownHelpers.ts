export const calculateCountdownAnimation = (progress: number) => {
  let opacity = 1
  let scale = 1

  if (progress < 0.2) {
    opacity = progress / 0.2
    scale = 0.5 + (progress / 0.2) * 0.5
  } else if (progress < 0.8) {
    opacity = 1
    scale = 1
  } else {
    opacity = 1 - (progress - 0.8) / 0.2
    scale = 1 + ((progress - 0.8) / 0.2) * 0.5
  }

  return { opacity, scale }
}

export const drawCountdownText = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  countdownValue: number,
  opacity: number,
  scale: number
) => {
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.scale(scale, scale)
  ctx.fillStyle = 'white'
  ctx.font = 'bold 80px "Press Start 2P", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(countdownValue.toString(), 0, 0)
  ctx.restore()
}




