# Saad Hasan Portfolio

A dynamic personal portfolio for showcasing projects, experience, writing, and multilingual profile content.

## Live Site

- Portfolio: [https://saadhasan.de](https://saadhasan.de)
- Render deployment: [https://saadhasan07.onrender.com](https://saadhasan07.onrender.com)
- Admin: available from the footer `Admin` button after login

## What This Project Does

- Serves a bilingual portfolio in English and German
- Includes light and dark theme support
- Lets portfolio content be managed through an admin dashboard
- Syncs GitHub repositories into the projects section
- Supports multiple GitHub accounts for project sync
- Lets you switch GitHub sync behavior between broader and portfolio-focused modes
- Exposes downloadable CV files and project/demo links

## Stack

- Frontend: React, TypeScript, Tailwind CSS, TanStack Query
- Backend: Node.js, Express
- Data layer: Drizzle ORM with PostgreSQL support plus in-memory fallback for free hosting
- Authentication: session-based admin login
- Hosting: Render with custom domain managed through IONOS DNS

## Project Structure

- `client/`: React app and UI components
- `server/`: Express app, admin routes, GitHub sync, auth, and storage
- `shared/`: shared schema and types
- `attached_assets/`: profile media and downloadable CV assets

## GitHub Sync

The portfolio can pull repositories from one or more GitHub usernames.

Admin features include:
- viewing connected GitHub accounts
- adding or removing GitHub usernames
- running manual sync
- choosing between `Show All Good Repos` and `Portfolio-Focused Only`

Hidden or draft-style repositories can be excluded with topics like:
- `hidden`
- `draft`
- `hide-from-portfolio`

## Local Development

```bash
npm install
npm run dev
```

Useful scripts:

```bash
npm run build
npm run start
npm run check
npm run db:push
```

## Notes

- The project is intentionally dynamic and not a static export.
- The production domain is `saadhasan.de`.
- The free Render deployment may take a few seconds to wake up after inactivity.

## Cleanup Done

This repo has been cleaned up to remove duplicate server packaging files and stale hosting references so the main app structure is easier to maintain.
