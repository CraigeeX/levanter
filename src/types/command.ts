import type { WASocket } from '@adiwajshing/baileys'

export type CommandContext = {
  sock: WASocket
  jid: string
  isGroup: boolean
  senderJid: string
  senderNumber: string
  isOwner: boolean
  prefix: string
  args: string[]
  text: string
  raw: any
}

export type Command = {
  name: string
  aliases?: string[]
  description?: string
  hidden?: boolean
  ownerOnly?: boolean
  groupOnly?: boolean
  dmsOnly?: boolean
  run: (ctx: CommandContext) => Promise<void>
}

