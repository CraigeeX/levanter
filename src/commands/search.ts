import type { Command } from '../types/command.js'

export const searchCommands: Command[] = [
  { name: 'image', aliases: ['imagesearch', 'image_search'], async run({ sock, jid, args }) {
      const q = args.join(' ')
      await sock.sendMessage(jid, { text: `Image search for: ${q} (placeholder Google CSE ${process.env.GOOGLE_CSE_ID})` })
  } },
  { name: 'yts', async run({ sock, jid, args }) {
      const q = args.join(' ')
      await sock.sendMessage(jid, { text: `YouTube search: ${q} (placeholder)` })
  } }
]

