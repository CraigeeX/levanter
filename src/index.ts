import 'dotenv/config'
import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, WASocket, proto, WAMessageContent } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import { getConfig, isValidSessionId, saveRuntimeStart, getRuntimeUptime, getBotState, setBotState } from './config.js'
import { ensureStateLoaded, getPrefix, isPaused, shouldAutoAIReply } from './storage/state.js'
import { buildRouter } from './framework/router.js'
import { formatMemoryUsage } from './utils/format.js'

const logger = pino({ level: 'info' })

async function startBot() {
  const cfg = getConfig()

  if (!isValidSessionId(cfg.sessionId)) {
    logger.error(`SESSION_ID must start with CIARA-IV~. Received: ${cfg.sessionId}`)
    process.exit(1)
  }

  await ensureStateLoaded()
  saveRuntimeStart(Date.now())

  const { state, saveCreds } = await useMultiFileAuthState(`session/${cfg.sessionFolder}`)
  const { version } = await fetchLatestBaileysVersion()

  const sock: WASocket = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: [cfg.botName, 'Chrome', '1.0.0'],
    auth: state
  })

  sock.ev.on('creds.update', saveCreds)

  const router = buildRouter(sock)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom | undefined)?.output?.statusCode !== DisconnectReason.loggedOut
      logger.warn(`Connection closed. Reconnect: ${shouldReconnect}`)
      if (shouldReconnect) startBot()
    } else if (connection === 'open') {
      logger.info('CIARA-IV is online.')
      setBotState({ online: true })
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (!messages || messages.length === 0) return
    const msg = messages[0]
    if (!msg.message) return

    try {
      await router.handleMessage(msg)
    } catch (err) {
      logger.error({ err }, 'Router error')
    }
  })

  // Anti-delete basic hook (placeholder)
  sock.ev.on('messages.update', async (updates) => {
    const cfg = getConfig()
    const state = getBotState()
    if (!state.antiDelete) return
    // Placeholder: Actual anti-delete handling requires storing original messages
  })
}

startBot().catch((e) => {
  console.error(e)
  process.exit(1)
})

