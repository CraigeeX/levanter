import type { Command } from '../types/command.js'
import { toggleButtonMode, toggleAntiDelete, setAiAutoReply } from '../storage/state.js'

export const hiddenCommands: Command[] = [
  { name: 'buttonmode', hidden: true, ownerOnly: true, async run({ sock, jid, args }) {
      const on = args[0]?.toLowerCase() === 'on'
      const off = args[0]?.toLowerCase() === 'off'
      toggleButtonMode(on ? true : off ? false : undefined)
      await sock.sendMessage(jid, { text: `Button mode: ${on ? 'on' : off ? 'off' : 'toggled'}` })
  } },
  { name: 'join', hidden: true, ownerOnly: true, async run({ sock, jid, args }) {
      await sock.sendMessage(jid, { text: 'Join group: placeholder. Provide invite link in future.' })
  } },
  { name: 'exit', hidden: true, ownerOnly: true, async run({ sock, jid }) {
      await sock.groupLeave(jid)
  } },
  { name: 'view', hidden: true, ownerOnly: true, async run({ sock, jid, args }) {
      await sock.sendMessage(jid, { text: 'View once: placeholder enabled.' })
  } },
  { name: 'save', hidden: true, ownerOnly: true, async run({ sock, jid, args }) {
      await sock.sendMessage(jid, { text: 'Save status: placeholder action.' })
  } },
  { name: 'autoview', hidden: true, ownerOnly: true, async run({ sock, jid }) {
      await sock.sendMessage(jid, { text: 'Auto-view status: placeholder toggled.' })
  } },
  { name: 'status', hidden: true, ownerOnly: true, async run({ sock, jid, args }) {
      if ((args[0] || '').toLowerCase() === 'react' && (args[1] || '').toLowerCase() === 'on') {
        await sock.sendMessage(jid, { text: 'Status react: on (placeholder)' })
      }
  } },
  { name: 'warn', hidden: true, ownerOnly: true, async run({ sock, jid, args }) {
      await sock.sendMessage(jid, { text: 'Warned user (placeholder).' })
  } },
  { name: 'ai', hidden: true, ownerOnly: true, async run({ sock, jid, args }) {
      const onoff = (args[0] || '').toLowerCase()
      if (onoff === 'on') setAiAutoReply(true)
      if (onoff === 'off') setAiAutoReply(false)
      await sock.sendMessage(jid, { text: `AI chatbot ${onoff}` })
  } },
  { name: 'anti', hidden: true, ownerOnly: true, async run({ sock, jid, args }) {
      if ((args[0] || '').toLowerCase() === 'delete') {
        const onoff = (args[1] || '').toLowerCase()
        toggleAntiDelete(onoff === 'on' ? true : onoff === 'off' ? false : undefined)
        await sock.sendMessage(jid, { text: `Anti-delete ${onoff || 'toggled'}` })
      }
  } },
  { name: 'pause', hidden: true, ownerOnly: true, async run() {} },
  { name: 'activate', hidden: true, ownerOnly: true, async run() {} }
]

