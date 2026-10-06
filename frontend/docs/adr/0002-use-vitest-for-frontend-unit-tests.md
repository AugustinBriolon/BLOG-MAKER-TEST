# 2. Use Vitest for frontend unit tests

Date: 2026-10-06

## Status

Proposed

## Context

The Next.js frontend had no test runner. Google Search Console flagged the home page because its JSON-LD declared a schema.org `Product` without `offers`, `review` or `aggregateRating`, which makes the page ineligible for product rich results. The fix replaces the `Product` node with a `WebPage` whose `about` is a `Thing`, since the site is editorial and neither sells the motorcycle nor displays ratings.

Nothing prevents the invalid `Product` from coming back in a later edit. We need an automated check, which requires choosing a unit test runner for the frontend. The project is TypeScript, uses ESM, the `@/*` path alias and Next.js 16.

## Decision

We will use Vitest for frontend unit tests. Tests are colocated with the code as `*.test.ts` and run with `npm test` in the `frontend` workspace. JSON-LD builders are extracted into pure functions (`app/structuredData.ts`) so they can be tested without rendering React Server Components.

## Options considered

### Option A — Vitest

- Pros: native ESM and TypeScript with no Babel or SWC transform setup; one dev dependency; path alias configured in a few lines; fast (the first suite runs in under 200 ms).
- Cons: adds `vitest.config.ts`; rendering async Server Components still requires extra tooling if needed later.

### Option B — Jest with `next/jest`

- Pros: officially documented by Next.js; widely known.
- Cons: requires `jest`, `jest-environment-*`, `@types/jest` and transform configuration; ESM support is still experimental, which conflicts with the ESM-only dependencies used here.

### Option C — No test runner, rely on Google Rich Results Test manually

- Pros: no new dependency.
- Cons: regressions are only detected after deployment and recrawl, days later in Search Console.

## Consequences

### Positive

- Any Product-like node (`Product`, `Vehicle`, `Motorcycle`, `Car`) emitted without `offers`, `review` or `aggregateRating` fails `npm test` before deployment.
- The frontend has a test convention that later changes can follow.

### Negative

- One more dev dependency (`vitest`) to keep up to date.
- The tests check the JSON-LD builder, not the rendered HTML; a page that bypasses `buildHomeJsonLd` is not covered.

### Neutral

- CI does not run `npm test` yet; adding it to the GitHub workflow is a separate change.

## References

- https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- https://nextjs.org/docs/app/guides/testing/vitest
- https://vitest.dev
