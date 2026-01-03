<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  ssr: false
})
import { drawNotFoundImage, downloadCompositePicture } from '~/utils/helpers/canvasHelpers'
import { initializeCamera } from '~/utils/helpers/cameraHelpers'
import { drawVideoWithCountdown } from '~/utils/helpers/videoHelpers'
import { capturePicture, resetPictureState } from '~/utils/helpers/pictureHelpers'
import { startCountdown } from '~/utils/helpers/countdownManager'

const canvas = ref<HTMLCanvasElement | null>(null)
const flashOverlay = ref<HTMLDivElement | null>(null)
const frameImage = ref<HTMLImageElement | null>(null)
const isPictureTaken = ref(false)
const cameraGranted = ref(false)
const cameraDenied = ref(false)
const countdown = ref<number | null>(null)
const isCountdownActive = ref(false)
const countdownStartTime = ref<number | null>(null)
let video: HTMLVideoElement | null = null
let stream: MediaStream | null = null
let animationFrameId: number | null = null
let countdownTimeout: ReturnType<typeof setTimeout> | null = null

const updateCanvasSize = () => {
  if (!canvas.value || !frameImage.value) return

  const frameElement = frameImage.value
  const frameRect = frameElement.getBoundingClientRect()

  const scale = frameRect.width / 960
  const canvasWidth = 288 * scale
  const canvasHeight = 391 * scale
  const canvasTop = 268 * scale

  canvas.value.style.width = `${canvasWidth}px`
  canvas.value.style.height = `${canvasHeight}px`
  canvas.value.style.top = `${canvasTop}px`

  canvas.value.width = 288
  canvas.value.height = 391
}

const handleResize = () => {
  updateCanvasSize()
}

const handleCapturePicture = () => {
  if (!canvas.value || !video) return

  capturePicture(canvas.value, video, flashOverlay.value, {
    isPictureTaken,
    isCountdownActive,
    animationFrameId: { value: animationFrameId },
    clearAnimationFrame: () => {
      animationFrameId = null
    }
  })
}

const resetPicture = () => {
  resetPictureState({
    isPictureTaken,
    countdown,
    countdownStartTime,
    isCountdownActive,
    countdownTimeout: { value: countdownTimeout },
    clearCountdownTimeout: () => {
      countdownTimeout = null
    }
  })

  if (video && stream) {
    drawVideoToCanvas()
  }
}

const downloadPicture = async () => {
  if (!canvas.value) return

  await downloadCompositePicture(canvas.value, '/assets/images/portret.png', resetPicture)
}

const smile = () => {
  if (isPictureTaken.value || isCountdownActive.value || cameraDenied.value) return

  startCountdown({
    countdown,
    countdownStartTime,
    isCountdownActive,
    countdownTimeout: { value: countdownTimeout },
    setCountdownTimeout: (timeout) => {
      countdownTimeout = timeout
    }
  })
}

const drawVideoToCanvas = () => {
  if (!canvas.value || !video || isPictureTaken.value || cameraDenied.value) return

  const shouldContinue = drawVideoWithCountdown(
    canvas.value,
    video,
    countdown.value,
    countdownStartTime.value,
    () => {
      countdown.value = null
      countdownStartTime.value = null
      isCountdownActive.value = false
      handleCapturePicture()
    }
  )

  if (shouldContinue) {
    animationFrameId = requestAnimationFrame(drawVideoToCanvas)
  }
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)

  const checkImage = () => {
    const img = document.querySelector('img[alt="Smile"]') as HTMLImageElement
    if (img) {
      frameImage.value = img
      img.addEventListener('load', () => {
        updateCanvasSize()
      })
      if (img.complete) {
        updateCanvasSize()
      } else {
        img.addEventListener('load', updateCanvasSize, { once: true })
      }
    }
  }

  checkImage()
  setTimeout(checkImage, 100)

  try {
    const result = await initializeCamera(288, 391)
    stream = result.stream
    video = result.video

    cameraGranted.value = true

    video.addEventListener('loadedmetadata', () => {
      if (canvas.value) {
        canvas.value.width = 288
        canvas.value.height = 391
        updateCanvasSize()
        drawVideoToCanvas()
      }
    })
  } catch (error) {
    console.error('Error accessing webcam:', error)
    cameraDenied.value = true

    const drawNotFound = () => {
      if (canvas.value && frameImage.value) {
        updateCanvasSize()
        drawNotFoundImage(canvas.value)
      }
    }
    if (frameImage.value) {
      drawNotFound()
    } else {
      const checkAndDraw = () => {
        const img = document.querySelector('img[alt="Smile"]') as HTMLImageElement
        if (img) {
          frameImage.value = img
          if (img.complete) {
            drawNotFound()
          } else {
            img.addEventListener('load', drawNotFound, { once: true })
          }
        } else {
          setTimeout(checkAndDraw, 50)
        }
      }
      checkAndDraw()
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }

  if (countdownTimeout !== null) {
    clearTimeout(countdownTimeout)
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
  }

  if (video) {
    video.srcObject = null
    video = null
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-top h-full relative">
    <div
      ref="flashOverlay"
      class="absolute inset-0 bg-white z-50 opacity-0 pointer-events-none"></div>
    <ClientOnly>
      <canvas
        ref="canvas"
        class="absolute bg-black"
        style="left: 50%; transform: translateX(-50%)" />
      <template #fallback>
        <div
          class="absolute bg-black"
          style="left: 50%; transform: translateX(-50%); width: 288px; height: 391px"></div>
      </template>
    </ClientOnly>
    <NuxtImg
      src="/assets/images/portret.png"
      alt="Smile"
      width="512"
      height="512"
      class="w-[960px] object-cover" />
  </div>
  <div
    :class="[
      'flex gap-2 sm:gap-4 justify-center p-4 sm:p-8 transition-transform duration-500 ease-out absolute bottom-0 w-full',
      isCountdownActive
        ? 'translate-y-full'
        : cameraGranted || isPictureTaken
        ? 'translate-y-0'
        : 'translate-y-full'
    ]">
    <button v-if="!isPictureTaken" class="button" @click="smile">Smile</button>
    <template v-if="isPictureTaken">
      <button class="button" @click="resetPicture">Re-take</button>
      <button class="button" @click="downloadPicture">Download</button>
    </template>
  </div>
</template>
