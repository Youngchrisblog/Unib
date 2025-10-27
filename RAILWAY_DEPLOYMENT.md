# Railway Deployment Guide

## Problem Fixed

The error you were seeing (`relation "admin_users" does not exist`) occurred because the database tables weren't created in your Railway production database. This has now been fixed!

## What Changed

1. **Migration Files Generated**: Created SQL migration files in the `migrations/` folder that define your database schema
2. **Migration Script**: Added `server/migrate.ts` to run migrations programmatically
3. **Updated Build Process**: Modified `package.json` scripts to automatically run migrations on deployment

## How It Works

When you deploy to Railway:

1. **Build Step**: `npm run build`
   - Builds your frontend (Vite)
   - Builds your backend (`server/index.ts`)
   - Builds the migration script (`server/migrate.ts`)
   - Copies migration files to the `dist/` folder

2. **Start Step**: `npm start`
   - **First**: Runs `node dist/migrate.js` to create/update database tables
   - **Then**: Starts your application with `node dist/index.js`

## Deployment Steps

### 1. Commit Your Changes

```bash
git add .
git commit -m "Add database migrations for Railway deployment"
git push
```

### 2. Railway Will Automatically

- Run the build command
- Apply database migrations
- Start your application

### 3. Verify

Your app should now start successfully without the "relation does not exist" errors!

## Local Development

For local development, the workflow remains the same:
```bash
npm run dev
```

The migration script will automatically run in the production environment.

## Future Schema Changes

If you modify your database schema (`shared/schema.ts`):

1. **Generate new migration**:
   ```bash
   npm run db:generate
   ```

2. **Commit the migration file**:
   ```bash
   git add migrations/
   git commit -m "Add new migration"
   git push
   ```

3. Railway will automatically apply it on the next deployment

## Troubleshooting

If you still see errors:

1. **Check DATABASE_URL**: Ensure it's set in Railway environment variables
2. **Check Logs**: Look at Railway deployment logs for migration errors
3. **Manual Migration** (if needed):
   ```bash
   npm run db:migrate
   ```

## Important Files

- `migrations/` - Contains SQL migration files (commit these!)
- `server/migrate.ts` - Migration runner script
- `drizzle.config.ts` - Drizzle ORM configuration
- `shared/schema.ts` - Your database schema definition
