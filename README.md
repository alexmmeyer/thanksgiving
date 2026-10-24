# McAfee-Sandefur Thanksgiving 2026

Mobile-first microsite for the Cape San Blas reunion: schedule with RSVPs, potluck menu, and a map of where everyone's staying.

- **Guests** can add, edit, and delete their own dishes and RSVPs. Ownership is tied to a cookie on their device.
- **Planners** tap the lock icon at the bottom of the Home page and enter the shared password. They can then manage the schedule and the family groups on the map, and edit or delete any dish or RSVP.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run seed                 # load starter groups and schedule
npm run dev
```

Without Redis credentials, data is stored in `.data/dev-store.json`. Without a Google key, the map shows a placeholder and new groups can't be saved, because their addresses can't be looked up.

## Deploying to Vercel

1. Import this project into Vercel.
2. In the project's **Storage** tab, add **Upstash for Redis** from the Marketplace and connect it. This sets the Redis environment variables.
3. In Google Cloud, enable the **Maps JavaScript API** and the **Geocoding API** for your key.
4. Set `PLANNER_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_GOOGLE_MAPS_KEY`, and `GOOGLE_GEOCODING_KEY` in Vercel.
5. Load the starter data into production Redis:

   ```bash
   npx vercel env pull .env.local --environment=production
   npm run seed
   ```

6. Deploy.

`npm run seed` only fills collections that are empty, so it's safe to run again. It loads the houses, the schedule, and the "things to do" places from `scripts/seed-data.ts`. `npm run seed -- --force` replaces all three with the starter data. It does not touch dishes, but it clears RSVPs for the replaced events.

## Updating the live site from scripts

These log in to the deployed site as a planner and go through its API, so they don't need any Redis or Google credentials locally.

- `npm run sync-schedule` makes the live schedule match `EVENTS` in `scripts/seed-data.ts`. Edit that list, run it once to preview, then add `-- --apply` to make the changes. Events are matched by day and title and edited in place, so RSVPs are kept.
- `npm run add-places` adds the `PLACES` from `scripts/seed-data.ts` that aren't on the site yet.

Both need `SITE_URL=https://your-site.vercel.app PLANNER_PASSWORD=...` in front of the command.

The map uses Google's `DEMO_MAP_ID`, which Advanced Markers require. Google intends it for testing, so if the pins ever stop showing, create your own Map ID in Google Cloud and swap it into `components/MapView.tsx`.
