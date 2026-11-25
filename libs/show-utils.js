import dayjs from 'dayjs'

// True once the show's (last) date is before today. Upcoming and running
// shows have no detail page.
export function hasHappened(show) {
  const p = show?.properties || {}
  const last = p.dateEnd || p.date
  return !!last && dayjs(last).isBefore(dayjs(), 'day')
}

// "7 September 2025", "17–20 September 2026", "29 May 2026, 18:00".
export function formatShowDate(start, end, { short = false } = {}) {
  if (!start) return ''
  const s = dayjs(start)
  const month = short ? 'MMM' : 'MMMM'
  if (end) {
    const e = dayjs(end)
    if (s.isSame(e, 'month')) return `${s.format('D')}–${e.format(`D ${month} YYYY`)}`
    if (s.isSame(e, 'year')) return `${s.format(`D ${month}`)} – ${e.format(`D ${month} YYYY`)}`
    return `${s.format(`D ${month} YYYY`)} – ${e.format(`D ${month} YYYY`)}`
  }
  const day = s.format(`D ${month} YYYY`)
  return String(start).includes('T') && !short ? `${day}, ${s.format('HH:mm')}` : day
}

// How a show is grouped on a project page, from its ShowType.
export function showKind(type) {
  if (['Installation', 'Exhibition'].includes(type)) return 'Shows'
  if (type === 'Panel Talk' || type === 'Workshop') return 'Talks'
  return 'Performances'
}
