import 'dotenv/config'

export type BotConfig = {
  botName: string
  botImageUrl: string
  pairSiteUrl: string
  creatorGithub: string
  ownerNumber: string
  creatorNumberFormat: string
  sessionId: string
  sessionFolder: string
  defaultPrefix: string
  allowGroups: boolean
  allowDms: boolean
  buttonModeDefault: boolean
  antiDeleteDefault: boolean
  viewOnceBypassDefault: boolean
  pausedDefault: boolean
  openaiApiKey: string
  openaiModel: string
}

let runtimeStart = 0

export function saveRuntimeStart(ms: number) {
  runtimeStart = ms
}

export function getRuntimeUptime(): number {
  return Date.now() - runtimeStart
}

export function getConfig(): BotConfig {
  const sessionId = process.env.SESSION_ID?.trim() || ''
  const sessionFolder = (sessionId || 'CIARA-IV~LOCAL').replace(/[^a-zA-Z0-9_~.-]/g, '_')
  return {
    botName: process.env.BOT_NAME || 'CIARA-IV',
    botImageUrl: process.env.BOT_IMG_URL || 'https://files.catbox.moe/0bn6cs.jpg',
    pairSiteUrl: process.env.PAIR_SITE_URL || 'https://ciara-iv-link.onrender.com',
    creatorGithub: process.env.CREATOR_GITHUB || 'https://github.com/CraigeeX',
    ownerNumber: (process.env.OWNER_NUMBER || '27847826044').replace(/^\+/, ''),
    creatorNumberFormat: process.env.CREATOR_NUMBER_FORMAT || '+27847826044',
    sessionId,
    sessionFolder,
    defaultPrefix: process.env.DEFAULT_PREFIX || '.',
    allowGroups: (process.env.ALLOW_GROUPS || 'true') === 'true',
    allowDms: (process.env.ALLOW_DMS || 'true') === 'true',
    buttonModeDefault: (process.env.BUTTON_MODE || 'false') === 'true',
    antiDeleteDefault: (process.env.ANTI_DELETE || 'false') === 'true',
    viewOnceBypassDefault: (process.env.VIEW_ONCE_BYPASS || 'true') === 'true',
    pausedDefault: (process.env.PAUSED || 'false') === 'true',
    openaiApiKey: process.env.OPENAI_API_KEY || 'sk-PLACEHOLDER',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
  }
}

export function isValidSessionId(id: string): boolean {
  return /^CIARA-IV~/.test(id)
}

export type BotState = {
  online?: boolean
  antiDelete?: boolean
}

let botState: BotState = {}

export function setBotState(partial: BotState) {
  botState = { ...botState, ...partial }
}

export function getBotState(): BotState {
  return botState
}

