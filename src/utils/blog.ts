const getPlainText = (node: any): string => {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(getPlainText).join(' ')
  if (node.type === 'text' && node.text) return node.text
  if (node.content) return getPlainText(node.content)
  return ''
}

export const getSnippet = (content: any, words = 22): string => {
  const text = getPlainText(content).replace(/\s+/g, ' ').trim()
  if (!text) return ''
  const parts = text.split(' ')
  const short = parts.slice(0, words).join(' ')
  return parts.length > words ? short + '…' : short
}
