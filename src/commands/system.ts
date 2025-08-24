import type { Command } from '../types/command.js'
import { getConfig, getRuntimeUptime } from '../config.js'
import { formatDuration } from '../utils/time.js'
import { formatMemoryUsage } from '../utils/format.js'
import { setAiAutoReply } from '../storage/state.js'

export const systemCommands: Command[] = [
  {
    name: 'menu',
    aliases: [],
    async run({ sock, jid, raw }) {
      const cfg = getConfig()
      const uptime = formatDuration(getRuntimeUptime())
      const ram = formatMemoryUsage()
      const body = [
        `HELLO : ${displayName(raw)} ✨`,
        '',
        '┏〔 ⚙ COMMANDS PANEL 〕━┓',
        `┃ RAM USAGE : ${ram}`,
        `┃ RUNTIME   : ${uptime}`,
        '┗━━━━━━━━━━━━━━●●',
        '',
        '┏━━〔 📑 LIST MENU 〕━━┓',
        '┃ 1  OWNER',
        '┃ 2  MAIN',
        '┃ 3  DOWNLOAD',
        '┃ 4  SEARCH',
        '┃ 5  AI',
        '┃ 6  CONVERT',
        '┃ 7  MATHTOOL',
        '┃ 8  GROUP',
        '┃ 9  STICKER',
        '┃ 10 GAME',
        '┗━━━━━━━━━━━━●●●●',
        '',
        '💡 Reply the Number to view commands'
      ].join('\n')

      await sock.sendMessage(jid, {
        image: { url: cfg.botImageUrl },
        caption: body
      })
    }
  },
  {
    name: 'list',
    aliases: [],
    async run({ sock, jid, raw }) {
      const header = `HI ${displayName(raw)} ✨\n\n*🅲︎🅸︎🅰︎🆁︎🅰︎-🅸︎🆅︎🫟*\n`
      const body = `
1️⃣ *OWNER*
.addowner
.removeowner
.broadcastgroup
.setprefix
.updateplugin
.pluginlist
.autoupdate
.eval
.botlog
.tempban
2️⃣ *MAIN*
.userinfo
.botinfo
.uptime
.feedback
.ping
.serverstatus
.remindme
3️⃣ *DOWNLOAD*
.song
.video
.tiktok
.instagram
.facebook
.spotify
.apk
.multidl
4️⃣ *SEARCH*
.google
.gimage
.wiki
.define
.weather
.trendnews
.nearby
5️⃣ *AI*
.chatgpt
.imagine
.summary
.story
.poem
.aiquiz
.voiceai
6️⃣ *CONVERT*
.toaudio
.tomp3
.img2pdf
.pdf2img
.audio2text
.text2audio
.vid2gif
.img2url
7️⃣ *MATHTOOL*
.calc
.derivative
.integral
.factor
.matrix
.stats
.convertunit
.probability
8️⃣ *GROUP*
.add
.kick
.promote
.vcf
.tagall
.setwelcome
.setbye
.mute / .unmute
.groupstats
.reactionrole
9️⃣ *STICKER*
.sticker
.attp
.emojimix
.sfull
.toimg
.stickermeme
.stickerpack
🔟 *GAME*
.trivia
.hangman
.dice
.coinflip
.tictactoe
.slot
.quiz
.mathgame
.memorygame

💡 Type the *CIARA-IV* to use command`
      await sock.sendMessage(jid, { text: header + '\n' + body })
    }
  },
  {
    name: 'ciara_ai',
    async run({ sock, jid }) {
      setAiAutoReply(true)
      await sock.sendMessage(jid, { text: 'AI auto-reply enabled.' })
    }
  },
  {
    name: 'ciara_stop',
    async run({ sock, jid }) {
      setAiAutoReply(false)
      await sock.sendMessage(jid, { text: 'AI auto-reply disabled.' })
    }
  }
]

function displayName(m: any): string {
  const push = m.pushName || 'User'
  return push
}

