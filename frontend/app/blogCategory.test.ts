import {describe, expect, it} from 'vitest'
import {resolveBlogMagazineCategory} from '@/app/blogCategory'

describe('resolveBlogMagazineCategory', () => {
  it('keeps an exact Sanity category title', () => {
    expect(resolveBlogMagazineCategory({categoryTitle: 'Essais & Tests'})).toBe('ESSAIS & TESTS')
  })

  it('maps essai titles into the essais bucket', () => {
    expect(
      resolveBlogMagazineCategory({
        title: 'Chroniques d’essais : comment analyser les performances de votre moto',
      }),
    ).toBe('ESSAIS & TESTS')
  })

  it('maps cafe racer prep into custom', () => {
    expect(
      resolveBlogMagazineCategory({
        title: 'Préparation café racer : par où commencer',
      }),
    ).toBe('CUSTOM & ATELIER')
  })

  it('defaults technical CP3 copy to moteur', () => {
    expect(
      resolveBlogMagazineCategory({
        title: 'Guides d’entretien moteur CP3 : la checklist avant de vous lancer',
        tags: ['Entretien moteur CP3'],
      }),
    ).toBe('MOTEUR & TECHNIQUE')
  })
})
