// PDF coordinate conversion utilities

export function toPdfCoords(
  x: number, y: number, w: number, h: number,
  cw: number, ch: number, pw: number, ph: number
) {
  return {
    x: (x / cw) * pw,
    y: ph - ((y + h) / ch) * ph,
    width: (w / cw) * pw,
    height: (h / ch) * ph,
  };
}

export function sigToPercent(
  x: number, y: number, w: number, h: number,
  cw: number, ch: number
) {
  return {
    left: `${(x / cw) * 100}%`,
    top: `${(y / ch) * 100}%`,
    width: `${(w / cw) * 100}%`,
    height: `${(h / ch) * 100}%`,
  };
}
