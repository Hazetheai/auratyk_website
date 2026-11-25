// Helpers for media hosted on Dropbox (Notion free plan: images/videos are
// added as Dropbox share links instead of Notion uploads).

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i
const VIDEO_EXT = /\.(mp4|m4v|mov|webm)$/i

function hostname(url) {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

function pathname(url) {
  try {
    return decodeURIComponent(new URL(url).pathname)
  } catch {
    return String(url).split('?')[0]
  }
}

function isDropboxUrl(url) {
  return typeof url === 'string' && /(^|\.)dropbox(usercontent)?\.com$/i.test(hostname(url))
}

// Share links (…?rlkey=…&dl=0) show a preview page. raw=1 serves the file itself.
function normalizeDropboxUrl(url) {
  if (!isDropboxUrl(url)) return url
  const u = new URL(url)
  u.searchParams.delete('dl')
  u.searchParams.set('raw', '1')
  return u.toString()
}

const isImageUrl = (url) => IMAGE_EXT.test(pathname(url))
const isVideoUrl = (url) => VIDEO_EXT.test(pathname(url))

module.exports = { isDropboxUrl, normalizeDropboxUrl, isImageUrl, isVideoUrl, pathname }
