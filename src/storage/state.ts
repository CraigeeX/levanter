import { getConfig } from '../config.js'

type MutableState = {
  prefix: string
  owners: string[]
  allowGroups: boolean
  allowDms: boolean
  buttonMode: boolean
  antiDelete: boolean
  viewOnceBypass: boolean
  paused: boolean
  aiAutoReply: boolean
}

let state: MutableState | null = null

export async function ensureStateLoaded() {
  if (state) return
  const cfg = getConfig()
  state = {
    prefix: cfg.defaultPrefix,
    owners: [cfg.ownerNumber],
    allowGroups: cfg.allowGroups,
    allowDms: cfg.allowDms,
    buttonMode: cfg.buttonModeDefault,
    antiDelete: cfg.antiDeleteDefault,
    viewOnceBypass: cfg.viewOnceBypassDefault,
    paused: cfg.pausedDefault,
    aiAutoReply: false
  }
}

export function getPrefix(): string {
  return state!.prefix
}

export function setPrefix(p: string) {
  state!.prefix = p
}

export function isOwner(num: string): boolean {
  return state!.owners.includes(num.replace(/^\+/, ''))
}

export function addOwner(num: string) {
  const clean = num.replace(/^\+/, '')
  if (!state!.owners.includes(clean)) state!.owners.push(clean)
}

export function removeOwner(num: string) {
  const clean = num.replace(/^\+/, '')
  state!.owners = state!.owners.filter((n) => n !== clean)
}

export function isPaused(): boolean {
  return state!.paused
}

export function setPaused(p: boolean) {
  state!.paused = p
}

export function toggleButtonMode(on?: boolean) {
  state!.buttonMode = on ?? !state!.buttonMode
}

export function isButtonMode(): boolean {
  return state!.buttonMode
}

export function toggleAntiDelete(on?: boolean) {
  state!.antiDelete = on ?? !state!.antiDelete
}

export function isAntiDelete(): boolean {
  return state!.antiDelete
}

export function setAiAutoReply(on: boolean) {
  state!.aiAutoReply = on
}

export function shouldAutoAIReply(): boolean {
  return state!.aiAutoReply
}

export function setAllowGroups(on: boolean) {
  state!.allowGroups = on
}

export function setAllowDms(on: boolean) {
  state!.allowDms = on
}

export function getAllowFlags() {
  return { groups: state!.allowGroups, dms: state!.allowDms }
}

