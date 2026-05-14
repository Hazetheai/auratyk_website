const { textToHtml } = require('./notion-richtext-to-html')

function blockToHtml(block) {
  switch (block.type) {
    case 'paragraph':
      return `<p>${textToHtml(block.paragraph.rich_text)}</p>`
    case 'heading_1':
      return `<h1>${textToHtml(block.heading_1.rich_text)}</h1>`
    case 'heading_2':
      return `<h2>${textToHtml(block.heading_2.rich_text)}</h2>`
    case 'heading_3':
      return `<h3>${textToHtml(block.heading_3.rich_text)}</h3>`
    case 'bulleted_list_item':
      return `<li>${textToHtml(block.bulleted_list_item.rich_text)}</li>`
    case 'numbered_list_item':
      return `<li>${textToHtml(block.numbered_list_item.rich_text)}</li>`
    case 'to_do':
      return `<div class="todo">${textToHtml(block.to_do.rich_text)}</div>`
    case 'toggle':
      return `<details><summary>${textToHtml(block.toggle.rich_text)}</summary></details>`
    case 'code':
      return `<pre><code class="language-${block.code.language}">${textToHtml(block.code.rich_text)}</code></pre>`
    case 'quote':
      return `<blockquote>${textToHtml(block.quote.rich_text)}</blockquote>`
    case 'divider':
      return `<hr>`
    case 'image':
      return block.image.type === 'external'
        ? `<figure><img src="${block.image.external.url}" alt="${block.image.caption?.[0]?.plain_text || ''}" /></figure>`
        : `<figure><img src="${block.image.file.url}" alt="${block.image.caption?.[0]?.plain_text || ''}" /></figure>`
    case 'video': {
      const url = block.video.external.url
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1] || ''
      if (videoId) {
        return `<figure class="video-embed"><div class="video-embed__inner"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></figure>`
      }
      return ''
    }
    case 'callout':
      return `<div class="callout">${block.callout.icon?.emoji || ''} ${textToHtml(block.callout.rich_text)}</div>`
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
