import 'server-only'

export const token =
  process.env.SANITY_API_READ_TOKEN ||
  'skjlWqPdG54q9IfvBSyZIyLDXpHjRbOKPAoFUj4oUoy1Lg88ANIFRkTmm1MeHPHaPLggOPLCHKkR2hgWvg8IiIHbg67tzXsAH7DRGwI3nEFuXIvWoSXTrJBbqhtOgxlmgYABdwjKTAtgG9Yl2bEk5SUGVjsdhPk85Ir2L1Ac5OHAOkTp8bcX'

if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}
