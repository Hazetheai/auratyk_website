import showsData from '@/content/notion/shows.json'

// How much is written on a project's page, as plain-text characters.
export function bodyTextLength(project) {
  const html = project?.bodyHtml || ''
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length
}

// A project is featured on /projects when it has a cover image and a real
// page (not just a line or two). Nothing to tick in Notion: fill in the page
// and add a CoverImage and it moves up on its own.
const FEATURED_MIN_CHARS = 400
export function isFeatured(project) {
  return !!project?.properties?.coverUrl && bodyTextLength(project) >= FEATURED_MIN_CHARS
}

function linkedShowDates(project) {
  return (showsData.items || [])
    .filter((s) => (s.properties?.projects || []).includes(project.id))
    .map((s) => s.properties?.dateEnd || s.properties?.date)
    .filter(Boolean)
    .sort()
}

// Most recent activity: the latest linked show, else the project's own date.
export function latestDate(project) {
  const dates = linkedShowDates(project)
  return dates[dates.length - 1] || project?.properties?.date || ''
}

// "2025" or "2025–2026", from the project date and its linked shows.
export function yearSpan(project) {
  const years = [project?.properties?.date, ...linkedShowDates(project)]
    .filter(Boolean)
    .map((d) => String(d).slice(0, 4))
    .sort()
  if (!years.length) return ''
  const first = years[0]
  const last = years[years.length - 1]
  return first === last ? first : `${first}–${last}`
}

// Newest first; projects without any date go last, alphabetically.
export function byRecency(a, b) {
  const da = latestDate(a)
  const db = latestDate(b)
  if (da && db && da !== db) return da < db ? 1 : -1
  if (da && !db) return -1
  if (!da && db) return 1
  return a.title.localeCompare(b.title)
}
