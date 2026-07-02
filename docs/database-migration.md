# Database Migration Setup

## Prerequisites

Before running database migrations, ensure you have:

1. A PostgreSQL database (Neon or Supabase)
2. Your database connection string added to `.env.local`

## Setup Steps

### 1. Configure Environment Variables

Edit `.env.local` and replace the placeholder with your actual database connection string:

```bash
DATABASE_URL="postgresql://your-actual-connection-string-here"
```

### 2. Generate Migration Files

Run the following command to generate migration files based on your schema:

```bash
npm run db:generate
```

This will create migration files in the `drizzle/` directory.

### 3. Push Schema to Database

To apply the schema to your database, run:

```bash
npm run db:push
```

Or use the migrate command:

```bash
npm run db:migrate
```

### 4. Verify Database Schema

You can inspect your database using Drizzle Studio:

```bash
npm run db:studio
```

This will open a web interface at `https://local.drizzle.studio/` where you can view and manage your database.

## Database Schema Overview

The current schema includes:

- **users**: User accounts and roles
- **categories**: Blog categories
- **categoryTranslations**: Category translations (i18n)
- **posts**: Blog posts metadata
- **postTranslations**: Post content translations (i18n)
- **tags**: Blog tags
- **tagTranslations**: Tag translations (i18n)
- **postsToTags**: Post-tag relationships (many-to-many)

## Troubleshooting

If you encounter connection issues:

1. Verify your DATABASE_URL is correct
2. Ensure your database allows connections from your IP
3. Check if SSL mode is required (add `?sslmode=require` to your connection string)