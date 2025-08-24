import type { Command } from '../types/command.js'

export const groupCommands: Command[] = [
  { name: 'hidetag', groupOnly: true, ownerOnly: true, async run({ sock, jid, args }) {
      const text = args.join(' ') || 'Hidetag'
      const metadata = await sock.groupMetadata(jid)
      const mentions = metadata.participants.map((p) => p.id)
      await sock.sendMessage(jid, { text, mentions })
  } },
  { name: 'owner', aliases: ['ownerreact', 'owner_react'], groupOnly: true, async run({ sock, jid }) {
      await sock.sendMessage(jid, { text: 'Owner react (placeholder).' })
  } },
  { name: 'limit', groupOnly: true, ownerOnly: true, async run({ sock, jid, args }) {
      await sock.sendMessage(jid, { text: `Group limit set (placeholder): ${args[0] || 'default'}` })
  } },
  { name: 'exit', groupOnly: true, ownerOnly: true, async run({ sock, jid }) {
      await sock.groupLeave(jid)
  } },
  { name: 'pin', groupOnly: true, ownerOnly: true, async run({ sock, jid, args }) {
      await sock.sendMessage(jid, { text: 'Pin message (placeholder).' })
  } }
]

