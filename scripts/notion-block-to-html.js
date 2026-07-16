const { textToHtml } = require('./notion-richtext-to-html')

function normalizeDropboxUrl(url) {
  if (!url) return url
  if (!url.includes('dropbox.com') && !url.includes('dropboxusercontent.com')) return url
  return url
    .replace(/[?&]dl=0/, '&raw=1')
    .replace(/[?&]dl=1/, '&raw=1')
}

function blockChildrenHtml(block) {
  return block[block.type]?.children || ''
}

function blockToHtml(block) {
  const children = blockChildrenHtml(block)
  switch (block.type) {
    case 'paragraph':
      return `<p>${textToHtml(block.paragraph.rich_text)}${children}</p>`
    case 'heading_1':
      return `<h1>${textToHtml(block.heading_1.rich_text)}${children}</h1>`
    case 'heading_2':
      return `<h2>${textToHtml(block.heading_2.rich_text)}${children}</h2>`
    case 'heading_3':
      return `<h3>${textToHtml(block.heading_3.rich_text)}${children}</h3>`
    case 'bulleted_list_item':
      return `<li>${textToHtml(block.bulleted_list_item.rich_text)}${children}</li>`
    case 'numbered_list_item':
      return `<li>${textToHtml(block.numbered_list_item.rich_text)}${children}</li>`
    case 'to_do':
      return `<div class="todo">${textToHtml(block.to_do.rich_text)}${children}</div>`
    case 'toggle':
      return `<details><summary>${textToHtml(block.toggle.rich_text)}</summary>${children}</details>`
    case 'code':
      return `<pre><code class="language-${block.code.language}">${textToHtml(block.code.rich_text)}</code></pre>`
    case 'quote':
      return `<blockquote>${textToHtml(block.quote.rich_text)}${children}</blockquote>`
    case 'divider':
      return `<hr>`
    case 'image':
      return block.image.type === 'external'
        ? `<figure><img src="${block.image.external.url}" alt="${block.image.caption?.[0]?.plain_text || ''}" /></figure>`
        : `<figure><img src="${block.image.file.url}" alt="${block.image.caption?.[0]?.plain_text || ''}" /></figure>`
    case 'video': {
      const url = block.video.type === 'external' ? block.video.external?.url : block.video.file?.url
      if (!url) return ''

      const caption = block.video.caption?.[0]?.plain_text || ''

      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] || ''
        if (videoId) {
          return `<figure class="video-embed"><div class="video-embed__inner"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></figure>`
        }
      }

      const videoUrl = normalizeDropboxUrl(url)
      const posterAttr = caption.match(/^https?:\/\/.+/) ? `poster="${caption}"` : ''

      return `<figure class="video-embed video-embed--direct" data-video-player>
        <div class="video-embed__player-wrapper">
          <video class="video-embed__player" playsinline ${posterAttr}>
            <source src="${videoUrl}" type="video/mp4">
          </video>
          <div class="video-embed__overlay">
            <button class="video-embed__play-btn" aria-label="Play video">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            </button>
          </div>
          <div class="video-embed__controls">
            <div class="video-embed__controls-track-wrap">
              <div class="video-embed__controls-track"><div class="video-embed__controls-fill"></div></div>
            </div>
            <div class="video-embed__controls-row">
              <button class="video-embed__ctrl-btn video-embed__ctrl-play" aria-label="Play">
                <svg class="video-embed__ctrl-icon video-embed__ctrl-icon--play" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                <svg class="video-embed__ctrl-icon video-embed__ctrl-icon--pause" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              </button>
              <span class="video-embed__time">0:00</span>
              <div class="video-embed__controls-spacer"></div>
              <div class="video-embed__volume">
                <button class="video-embed__ctrl-btn video-embed__ctrl-vol" aria-label="Mute">
                  <svg class="video-embed__ctrl-icon video-embed__ctrl-icon--vol-on" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  <svg class="video-embed__ctrl-icon video-embed__ctrl-icon--vol-off" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="display:none"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/><line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="2"/></svg>
                </button>
                <div class="video-embed__volume-slider">
                  <div class="video-embed__volume-track"><div class="video-embed__volume-fill"></div></div>
                </div>
              </div>
              <button class="video-embed__ctrl-btn video-embed__ctrl-fs" aria-label="Full screen">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </figure>`
    }
    case 'callout':
      return `<div class="callout">${block.callout.icon?.emoji || ''} ${textToHtml(block.callout.rich_text)}${children}</div>`
    case 'child_page':
      return ''
    default:
      return ''
  }
}

function blocksToHtml(blocks, listAccumulator = { type: null, items: [] }) {
  let html = ''

  for (const block of blocks) {
    if (block.has_children && block.children) {
      block[block.type].children = blocksToHtml(block.children)
    }

    const type = block.type
    const isList = ['bulleted_list_item', 'numbered_list_item'].includes(type)

    if (isList) {
      if (listAccumulator.type !== type) {
        if (listAccumulator.items.length > 0) {
          const tag = listAccumulator.type === 'bulleted_list_item' ? 'ul' : 'ol'
          html += `<${tag}>${listAccumulator.items.join('')}</${tag}>`
          listAccumulator.items = []
        }
        listAccumulator.type = type
      }
      listAccumulator.items.push(blockToHtml(block))
    } else {
      if (listAccumulator.items.length > 0) {
        const tag = listAccumulator.type === 'bulleted_list_item' ? 'ul' : 'ol'
        html += `<${tag}>${listAccumulator.items.join('')}</${tag}>`
        listAccumulator.items = []
        listAccumulator.type = null
      }
      html += blockToHtml(block)
    }
  }

  if (listAccumulator.items.length > 0) {
    const tag = listAccumulator.type === 'bulleted_list_item' ? 'ul' : 'ol'
    html += `<${tag}>${listAccumulator.items.join('')}</${tag}>`
    listAccumulator.items = []
    listAccumulator.type = null
  }

  return html
}

module.exports = { blockToHtml, blocksToHtml }
