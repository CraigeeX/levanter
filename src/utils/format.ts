export function formatMemoryUsage(): string {
  const mem = process.memoryUsage()
  const toMB = (n: number) => (n / 1024 / 1024).toFixed(1) + ' MB'
  return `RSS ${toMB(mem.rss)}, Heap ${toMB(mem.heapUsed)}/${toMB(mem.heapTotal)}`
}

export function safeJoinLines(lines: Array<string | undefined | null>): string {
  return lines.filter(Boolean).join('\n')
}

