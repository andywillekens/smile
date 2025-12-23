export interface CountdownState {
  countdown: { value: number | null }
  countdownStartTime: { value: number | null }
  isCountdownActive: { value: boolean }
  countdownTimeout: { value: ReturnType<typeof setTimeout> | null }
  setCountdownTimeout: (timeout: ReturnType<typeof setTimeout> | null) => void
}

export const startCountdown = (state: CountdownState) => {
  state.isCountdownActive.value = true
  state.countdown.value = 3
  state.countdownStartTime.value = Date.now()

  const tick = () => {
    if (state.countdown.value === null) return

    if (state.countdown.value > 1) {
      state.countdown.value--
      state.countdownStartTime.value = Date.now()
      const timeout = setTimeout(tick, 1000)
      state.setCountdownTimeout(timeout)
    }
  }

  const timeout = setTimeout(tick, 1000)
  state.setCountdownTimeout(timeout)
}

