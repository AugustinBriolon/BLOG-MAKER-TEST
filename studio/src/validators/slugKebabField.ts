import type {CustomValidator} from 'sanity'

/**
 * Validateur de slug au format kebab-case strict sans accents.
 * Format attendu : lettres minuscules, chiffres et tirets uniquement.
 */
export const validateSlugKebabField: CustomValidator<any> = (slug) => {
  if (!slug || !slug.current) {
    return true
  }

  const value = slug.current
  const kebabRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  if (!kebabRegex.test(value)) {
    return 'Le slug doit être en minuscules, sans accents ni caractères spéciaux, séparé par des tirets (ex: guide-moteur-cp3).'
  }

  return true
}
