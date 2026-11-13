import 'server-only'

/**
 * Optional read token for draft/Live Content API.
 * Published CDN reads work without it on a public dataset.
 * Never hardcode a token here: a revoked value breaks all authenticated fetches (incl. sitemap).
 */
export const token = process.env.SANITY_API_READ_TOKEN
