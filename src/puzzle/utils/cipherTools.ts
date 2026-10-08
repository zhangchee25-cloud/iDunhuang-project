/**
 * 凯撒密码，只变换英文字母，符号数字不动
 * @param str 原始字符串
 * @param shift 偏移，可以负数
 */
export function caesarShift(str: string, shift: number): string {
  return str.split('').map(char => {
    if (/[A-Z]/.test(char)) {
      const code = char.charCodeAt(0)
      return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65)
    }
    if (/[a-z]/.test(char)) {
      const code = char.charCodeAt(0)
      return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97)
    }
    return char
  }).join('')
}
