import type { WASocket } from '@adiwajshing/baileys'
import { jidNormalizedUser } from '@adiwajshing/baileys'
import { getConfig, getRuntimeUptime } from '../config.js'
import { formatMemoryUsage } from '../utils/format.js'
import { formatDuration } from '../utils/time.js'
import { getPrefix, isOwner as isOwnerCheck, isPaused, shouldAutoAIReply } from '../storage/state.js'
import { Command, CommandContext } from '../types/command.js'
import { systemCommands } from '../commands/system.js'
import { mainCommands } from '../commands/main.js'
import { ownerCommands } from '../commands/owner.js'
import { hiddenCommands } from '../commands/hidden.js'
import { downloadCommands } from '../commands/download.js'
import { searchCommands } from '../commands/search.js'
import { groupCommands } from '../commands/group.js'
import { aiAutoReply } from '../services/openai.js'

const registry: Map<string, Command> = new Map()

function register(cmds: Command[]) {
  for (const c of cmds) {
    registry.set(c.name, c)
    for (const a of c.aliases || []) registry.set(a, c)
  }
}

register([
  ...systemCommands,
  ...mainCommands,
  ...ownerCommands,
  ...hiddenCommands,
  ...downloadCommands,
  ...searchCommands,
  ...groupCommands
])

export function buildRouter(sock: WASocket) {
  async function handleMessage(msg: any) {
    const m = msg
    const from = m.key.remoteJid as string
    const isGroup = from.endsWith('@g.us')
    const senderJid = jidNormalizedUser(m.key.participant || m.key.remoteJid)
    const senderNumber = senderJid.split('@')[0]
    const prefix = getPrefix()

    const text = extractText(m)
    if (!text) return

    // Pause gate
    if (isPaused()) {
      if (text.startsWith(prefix)) {
        const cmdName = text.slice(prefix.length).trim().split(/\s+/)[0]
        if (['activate', 'activatebot', 'activate_bot', 'activate-bot'].includes(cmdName)) {
          // allow hidden activate handled in hiddenCommands
        } else {
          return
        }
      } else {
        return
      }
    }

    // Command handling
    if (text.startsWith(prefix)) {
      const withoutPrefix = text.slice(prefix.length).trim()
      const [cmdName, ...args] = withoutPrefix.split(/\s+/)
      const cmd = registry.get(cmdName.toLowerCase())
      if (!cmd) return

      const ctx: CommandContext = {
        sock,
        jid: from,
        isGroup,
        senderJid,
        senderNumber,
        isOwner: isOwnerCheck(senderNumber),
        prefix,
        args,
        text: withoutPrefix,
        raw: m
      }

      if (cmd.ownerOnly && !ctx.isOwner) return
      if (cmd.groupOnly && !ctx.isGroup) return
      if (cmd.dmsOnly && ctx.isGroup) return

      await cmd.run(ctx)
      return
    }

    // Numeric replies to menu sections
    if (/^(10|[1-9])$/.test(text.trim())) {
      await sendMenuSection(sock, from, text.trim())
      return
    }

    // AI auto-reply
    if (shouldAutoAIReply()) {
      const reply = await aiAutoReply(text, senderNumber)
      if (reply) await sock.sendMessage(from, { text: reply }, { quoted: m })
    }
  }

  return { handleMessage }
}

function extractText(m: any): string | null {
  const msg = m.message
  if (msg?.conversation) return msg.conversation
  if (msg?.extendedTextMessage?.text) return msg.extendedTextMessage.text
  if (msg?.imageMessage?.caption) return msg.imageMessage.caption
  if (msg?.videoMessage?.caption) return msg.videoMessage.caption
  return null
}

async function sendMenuSection(sock: WASocket, jid: string, num: string) {
  const sections: Record<string, string> = {
    '1': `OWNER\n.addowner\n.removeowner\n.broadcastgroup\n.setprefix\n.updateplugin\n.pluginlist\n.autoupdate\n.eval\n.botlog\n.tempban`,
    '2': `MAIN\n.userinfo\n.botinfo\n.uptime\n.feedback\n.ping\n.serverstatus\n.remindme`,
    '3': `DOWNLOAD\n.song\n.video\n.tiktok\n.instagram\n.facebook\n.spotify\n.apk\n.multidl`,
    '4': `SEARCH\n.google\n.gimage\n.wiki\n.define\n.weather\n.trendnews\n.nearby`,
    '5': `AI\n.chatgpt\n.imagine\n.summary\n.story\n.poem\n.aiquiz\n.voiceai`,
    '6': `CONVERT\n.toaudio\n.tomp3\n.img2pdf\n.pdf2img\n.audio2text\n.text2audio\n.vid2gif\n.img2url`,
    '7': `MATHTOOL\n.calc\n.derivative\n.integral\n.factor\n.matrix\n.stats\n.convertunit\n.probability`,
    '8': `GROUP\n.add\n.kick\n.promote\n.vcf\n.tagall\n.setwelcome\n.setbye\n.mute / .unmute\n.groupstats\n.reactionrole`,
    '9': `STICKER\n.sticker\n.attp\n.emojimix\n.sfull\n.toimg\n.stickermeme\n.stickerpack`,
    '10': `GAME\n.trivia\n.hangman\n.dice\n.coinflip\n.tictactoe\n.slot\n.quiz\n.mathgame\n.memorygame`
  }
  const body = sections[num] || 'Section not found.'
  await sock.sendMessage(jid, { text: `Here are the commands for section ${num}:\n\n${body}` })
}

