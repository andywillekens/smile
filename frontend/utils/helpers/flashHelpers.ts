export const triggerFlash = (flashOverlay: HTMLElement | null) => {
  if (!flashOverlay) return

  flashOverlay.classList.add('flash')
  setTimeout(() => {
    if (flashOverlay) {
      flashOverlay.classList.remove('flash')
    }
  }, 200)
}




