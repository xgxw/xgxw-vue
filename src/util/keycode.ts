export enum KeyCode {
  backspace = 8,
  tab = 9,
  enter = 13,
  esc = 27,
  space = 32,
  delete = 46,
  zero = 48,
  nine = 57,
  a = 65,
  g = 71,
  z = 90,
  numpad_zero = 96,
  numpad_nine = 105
}

export function isEditKey(e: KeyboardEvent) {
  let key = e.keyCode
  return (key >= KeyCode.zero && key <= KeyCode.nine)
    || (key >= KeyCode.a && key <= KeyCode.z)
    || (key >= 186 && key <= 192)
    || (key >= 219 && key <= 222)
}