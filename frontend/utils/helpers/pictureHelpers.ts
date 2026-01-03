import { capturePictureFromVideo } from './canvasHelpers'
import { triggerFlash } from './flashHelpers'

export interface PictureState {
  isPictureTaken: { value: boolean }
  isCountdownActive: { value: boolean }
  animationFrameId: { value: number | null }
  clearAnimationFrame: () => void
}

export const capturePicture = (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  flashOverlay: HTMLElement | null,
  state: PictureState
) => {
  if (state.animationFrameId.value !== null) {
    cancelAnimationFrame(state.animationFrameId.value)
    state.clearAnimationFrame()
  }

  triggerFlash(flashOverlay)
  setTimeout(() => {
    capturePictureFromVideo(canvas, video)
    state.isPictureTaken.value = true
  }, 200)

  setTimeout(() => {
    state.isCountdownActive.value = false
  }, 500)
}

export interface ResetState {
  isPictureTaken: { value: boolean }
  countdown: { value: number | null }
  countdownStartTime: { value: number | null }
  isCountdownActive: { value: boolean }
  countdownTimeout: { value: ReturnType<typeof setTimeout> | null }
  clearCountdownTimeout: () => void
}

export const resetPictureState = (state: ResetState) => {
  state.isPictureTaken.value = false
  state.countdown.value = null
  state.countdownStartTime.value = null
  state.isCountdownActive.value = false

  if (state.countdownTimeout.value !== null) {
    clearTimeout(state.countdownTimeout.value)
    state.clearCountdownTimeout()
  }
}
