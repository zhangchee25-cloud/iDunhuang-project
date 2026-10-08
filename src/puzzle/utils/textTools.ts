/** 提取字符串里面全部大写A‑Z字母，拼接返回 */
export function extractUppercase(input: string): string {
  const matches = input.match(/[A-Z]/g)
  if (!matches) return ""
  return matches.join("")
}

/** 打字机逐字输出工具 */
export async function typeWriter(text: string, onPrint: (chunk:string)=>void, delay=80):Promise<void>{
  let output = ""
  for(const ch of text){
    output += ch
    onPrint(output)
    await new Promise(resolve=>setTimeout(resolve, delay))
  }
}
