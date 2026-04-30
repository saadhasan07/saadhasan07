# Setup Notes

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in the values you need.

3. Start the app:

```bash
npm run dev
```

## Important Environment Variables

- `SESSION_SECRET`: required for admin login sessions
- `DATABASE_URL`: enables PostgreSQL-backed storage
- `USE_MEM_STORAGE=true`: lets the app run without a database for free-hosting or quick previews
- `GITHUB_TOKEN`: improves GitHub sync reliability and rate limits
- `GITHUB_USERNAME` or `GITHUB_USERNAMES`: optional default GitHub accounts for sync

## Production Notes

- The live site runs on Render.
- The custom domain is `saadhasan.de`.
- On free hosting, the app may use in-memory storage and take a few seconds to wake up.

## Admin Notes

- GitHub accounts and sync mode can be managed from the admin dashboard.
- Sync mode can be switched back anytime if you prefer the broader repo list.
