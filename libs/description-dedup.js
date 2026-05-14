export function dedupDescription(bodyHtml, description) {
  if (!bodyHtml || !description) return bodyHtml
  const bodyText = bodyHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const desc = description.replace(/\s+/g, ' ').trim()
  if (bodyText.startsWith(desc)) {
    const descRegex = new RegExp(description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const remaining = bodyHtml.replace(descRegex, '').trim()
    return remaining.replace(/<p>\s*<\/p>/g, '').trim()
  }
  return bodyHtml
}
