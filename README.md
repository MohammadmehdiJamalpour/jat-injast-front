# Jat Injast Frontend

Next.js frontend using App Router, Tailwind 4, and the local Django backend in `../backend`.

## Run

```powershell
npm install
npm run dev
```

By default the app runs on `http://127.0.0.1:3000` and rewrites `/api/*` to `http://127.0.0.1:8000`.

Route rendering strategy lives in `src/app/route-modes.js`. Public route shells are static where possible; authenticated, house-detail, and token-login routes are dynamic. Legacy browser-heavy screens are mounted as explicit CSR islands inside App Router pages.

Test accounts shown on the login screen:

- `customer` / `customer`
- `houseowner` / `houseowner`
- `admin` / `admin`
