import {describe, expect, it} from 'vitest'
import {
  estimateReadTimeMinutes,
  formatAuthorName,
  formatFrenchDate,
  hasArticleContent,
  isModularArticleContent,
  isPortableTextArray,
  withoutRedundantLeadBlocks,
} from '@/app/articleContent'

const paragraph = {
  _type: 'block',
  _key: 'p1',
  children: [{_type: 'span', _key: 's1', text: 'Hello', marks: []}],
}

describe('article content detection', () => {
  it('accepts stored Portable Text blocks', () => {
    expect(isPortableTextArray([paragraph])).toBe(true)
    expect(isPortableTextArray([])).toBe(false)
    expect(isPortableTextArray([{_type: 'textBlock', body: [paragraph]}])).toBe(false)
  })

  it('detects modular blogPost sections', () => {
    expect(
      isModularArticleContent([{_type: 'htmlEmbed', _key: 'h1', html: '<table></table>'}]),
    ).toBe(true)
  })

  it('treats Blog Maker body as renderable content', () => {
    expect(hasArticleContent({body: [paragraph]})).toBe(true)
  })

  it('treats introduction-only articles as renderable', () => {
    expect(hasArticleContent({introduction: [paragraph]})).toBe(true)
  })

  it('rejects an empty CMS document', () => {
    expect(hasArticleContent({body: [], content: [], introduction: []})).toBe(false)
  })
})

describe('article presentation helpers', () => {
  it('drops a markdown title that repeats the page heading', () => {
    const titleBlock = {
      _type: 'block',
      _key: 't1',
      children: [
        {_type: 'span', _key: 's0', text: '# 5 erreurs fréquentes en atelier', marks: []},
      ],
    }
    const result = withoutRedundantLeadBlocks(
      [titleBlock, paragraph] as never,
      '5 erreurs fréquentes en atelier',
    )
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(paragraph)
  })

  it('uses the first name when the last name is empty', () => {
    expect(formatAuthorName({firstName: 'Jean Dupont', lastName: ''})).toBe('Jean Dupont')
  })

  it('formats a date-only CMS value in French without timezone shift', () => {
    expect(formatFrenchDate('2026-10-06')).toBe('6 octobre 2026')
  })

  it('estimates reading time from body words', () => {
    const words = Array.from({length: 400}, () => ({
      _type: 'span',
      text: 'mot',
    }))
    expect(
      estimateReadTimeMinutes({
        body: [{_type: 'block', children: words}],
      }),
    ).toBe(2)
  })
})
