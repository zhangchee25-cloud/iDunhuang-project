// Smooth, reversible reveal; independent of camera and chapter timing.
const stops = [[0, .04], [.12, .12], [.25, .70], [.36, 1]] as const

export function heroReveal(progress: number) {
  for (let index = 1; index < stops.length; index++) {
    const [end, value] = stops[index]
    const [start, previous] = stops[index - 1]
    if (progress <= end) {
      const t = Math.max(0, Math.min(1, (progress - start) / (end - start)))
      return previous + (value - previous) * t * t * (3 - 2 * t)
    }
  }
  return 1
}
