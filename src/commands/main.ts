import type { Command } from '../types/command.js'
import { getConfig } from '../config.js'

export const mainCommands: Command[] = [
  {
    name: 'repository',
    aliases: ['repo'],
    async run({ sock, jid }) {
      const cfg = getConfig()
      await sock.sendMessage(jid, { text: `GitHub Repository:\n${cfg.creatorGithub}/CIARA-IV` })
    }
  },
  {
    name: 'pairbot',
    async run({ sock, jid }) {
      const cfg = getConfig()
      await sock.sendMessage(jid, { text: `Pair your bot here:\n${cfg.pairSiteUrl}` })
    }
  },
  {
    name: 'owner',
    async run({ sock, jid }) {
      const cfg = getConfig()
      await sock.sendMessage(jid, { text: `Owner: wa.me/${cfg.ownerNumber}` })
    }
  }
]

