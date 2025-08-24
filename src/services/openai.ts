import { getConfig } from '../config.js'

export async function aiAutoReply(prompt: string, userId: string): Promise<string | null> {
  const cfg = getConfig()
  if (!cfg.openaiApiKey || cfg.openaiApiKey.startsWith('sk-PLACEHOLDER')) {
    return null
  }
  try {
    // Minimal fetch to OpenAI Chat Completions (placeholder endpoint). Replace with official SDK if preferred.
    const sys = `You are CIARA-IV, a WhatsApp bot. Know that CraigeeX is the maker, a 19-year-old from Zimbabwe 🇿🇼, a tech huber. Portfolio: craigeex.vercel.app. Be concise.`
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.openaiApiKey}`
      },
      body: JSON.stringify({
        model: cfg.openaiModel,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4
      })
    })
    const json = await res.json()
    const content = json?.choices?.[0]?.message?.content?.trim()
    return content || null
  } catch (e) {
    return null
  }
}

