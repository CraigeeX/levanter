import type { Command } from '../types/command.js'
import { addOwner, removeOwner, setPrefix, getPrefix, isOwner as isOwnerCheck, setPaused } from '../storage/state.js'
import { getConfig } from '../config.js'

export const ownerCommands: Command[] = [
  {
    name: 'addowner',
    ownerOnly: true,
    async run({ sock, jid, args, senderNumber }) {
      const num = (args[0] || '').replace(/\D/g, '') || senderNumber
      addOwner(num)
      await sock.sendMessage(jid, { text: `Owner added: ${num}` })
    }
  },
  {
    name: 'removeowner',
    ownerOnly: true,
    async run({ sock, jid, args }) {
      const num = (args[0] || '').replace(/\D/g, '')
      if (!num) return void (await sock.sendMessage(jid, { text: 'Provide a number.' }))
      removeOwner(num)
      await sock.sendMessage(jid, { text: `Owner removed: ${num}` })
    }
  },
  {
    name: 'setprefix',
    ownerOnly: true,
    async run({ sock, jid, args }) {
      const p = args[0]
      if (!p) return void (await sock.sendMessage(jid, { text: 'Usage: .setprefix !' }))
      setPrefix(p)
      await sock.sendMessage(jid, { text: `Prefix updated to: ${getPrefix()}` })
    }
  },
  {
    name: 'ciara_info',
    ownerOnly: true,
    async run({ sock, jid }) {
      const cfg = getConfig()
      const text = [
        `Creator: CraigeeX🫟`,
        `GitHub: ${cfg.creatorGithub}`,
        `Portfolio: craigeex.vercel.app`,
        `Country: Zimbabwe 🇿🇼`,
        `Bio: 19-year-old tech huber, maker of CIARA-IV`,
        `Contact: ${cfg.creatorNumberFormat}`
      ].join('\n')
      await sock.sendMessage(jid, { text })
    }
  },
  {
    name: 'pause',
    aliases: ['pausebot'],
    ownerOnly: true,
    async run({ sock, jid }) {
      setPaused(true)
      await sock.sendMessage(jid, { text: 'Bot paused. Only ".activate bot" can resume.' })
    }
  },
  {
    name: 'activate',
    aliases: ['activatebot', 'activate_bot', 'activate-bot'],
    ownerOnly: true,
    async run({ sock, jid }) {
      setPaused(false)
      await sock.sendMessage(jid, { text: 'Bot activated.' })
    }
  }
]

