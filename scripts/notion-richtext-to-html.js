function textToHtml(richTextArray) {
  if (!richTextArray) return ''
  return richTextArray.map(text => {
    let content = text.plain_text || ''
    const { annotations } = text
    if (annotations?.bold) content = `<strong>${content}</strong>`
    if (annotations?.italic) content = `<em>${content}</em>`
    if (annotations?.strikethrough) content = `<s>${content}</s>`
    if (annotations?.underline) content = `<u>${content}</u>`
    if (annotations?.code) content = `<code>${content}</code>`
    if (text.href) content = `<a href="${text.href}" target="_blank" rel="noopener">${content}</a>`
    return content
  }).join('')
}

module.exports = { textToHtml }
