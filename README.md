# Jat Injast Frontend

Next.js frontend using App Router, Tailwind 4, and the local Django backend in `../backend`.

## Run

```powershell
npm install
npm run dev
```

By default the app runs on `http://127.0.0.1:3000` and rewrites `/api/*` to `http://127.0.0.1:8000`.

## Runtime Policy

Use Node.js 20.9.0 or newer. The installed Next.js 16 package declares that runtime requirement and the project follows it for local development, CI, and production builds.

This app intentionally stays on React 18.3.x and React DOM 18.3.x for now. Next.js 16 supports React 18.2 or newer as a peer dependency, while several current runtime packages in this app still declare React 18 peer ranges. Keeping React 18 avoids mixing a React major upgrade with unrelated library modernization; React 19 should be handled in a separate dependency step that can update those peer-dependent packages together.

Route rendering strategy lives in `src/app/route-modes.js`. Public route shells are static where possible; authenticated, house-detail, and token-login routes are dynamic. Legacy browser-heavy screens are mounted as explicit CSR islands inside App Router pages.

## Quality

Use `npm run quality` as the strongest local and CI gate.

```powershell
npm ci
npm run quality
```

The quality gate runs the AI-footprint audit, hygiene checks, full and service-focused type checks, zero-warning ESLint, Vitest, focused Playwright accessibility/responsive/performance smokes, `next build`, route-rendering output checks, public HTML SEO checks, and the first-load JS budget.

`npm run build` also runs `scripts/check-route-rendering.mjs`, which verifies route source config, built app-paths, prerendered public outputs, dynamic ISR routes, and runtime-only routes. `npm run seo:html` checks public pages for a meaningful `h1`, metadata, canonical URL, and body content. If `PUBLIC_HTML_BASE_URL` is not set, it starts `next start` against the existing `.next` build on localhost and shuts it down after the check.

Useful focused gates:

```powershell
npm run test
npm run test:a11y
npm run test:responsive
npm run test:performance
npm run performance:budget
npm run seo:html
```

For CI against a staged deployment instead of a local built server:

```powershell
$env:PUBLIC_HTML_BASE_URL="https://your-staging-origin"
npm run seo:html
```

Set `PUBLIC_HTML_HOUSE_UUID` when a known public house detail page should be included in the public HTML check.

## Performance And Observability

`npm run performance:budget` reads `.next/diagnostics/route-bundle-stats.json` after a build and fails when public first-load JS exceeds the route budgets or browser-heavy libraries leak into first-load chunks. Use `npm run analyze:bundles` when investigating bundle changes.

Web vitals reporting is vendor-neutral and disabled unless configured:

```powershell
$env:NEXT_PUBLIC_WEB_VITALS_ENDPOINT="https://your-collector-origin/vitals"
$env:NEXT_PUBLIC_WEB_VITALS_DEBUG="true"
npm run dev
```

The client sends metric name, id, value, delta, rating, navigation type, and pathname with `sendBeacon` or `fetch` keepalive. `NEXT_PUBLIC_WEB_VITALS_DEBUG=true` also writes metrics to the browser console during local development.

Test accounts shown on the login screen:

- `customer` / `customer`
- `houseowner` / `houseowner`
- `admin` / `admin`
