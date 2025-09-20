# PostgreSQL Setup for Benevolence Hub

## Overview

This project is currently using a JSON file (`db.json`) for data storage, but has been configured to use PostgreSQL as its database. The database connection is configured in the `.env` file and managed through Prisma ORM, but the application code is currently using the JSON file instead.

## Configuration

### Database URL

The database connection string is defined in the `.env` file:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/benevolence_hub"
```

This connection string follows the format:

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME
```

### Prisma Schema

The database schema is defined in `prisma/schema.prisma`. This file includes the data models and their relationships.

## Available Scripts

The following npm scripts are available for database management:

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:studio` - Open Prisma Studio to view and edit data
- `npm run db:push` - Push schema changes to the database
- `npm run db:seed` - Seed the database with initial data

## Setting Up Locally

1. Install PostgreSQL on your machine
2. Create a database named `benevolence_hub`
3. Update the `.env` file with your PostgreSQL credentials if needed
4. Run `npm run prisma:generate` to generate the Prisma client
5. Run `npm run prisma:migrate` to create the database tables
6. Run `npm run db:seed` to seed the database with initial data

## Migrations

When making changes to the database schema:

1. Update the models in `prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create a new migration
3. Commit the migration files to version control

## Seeding

The seed script is located at `prisma/seed.ts`. It populates the database with initial data for development and testing purposes.

To modify the seed data, edit the `prisma/seed.ts` file and run `npm run db:seed`.

## Switching Between db.json and PostgreSQL

The application is currently configured to use `db.json` for data storage. You can switch between storage options as needed.

### Migrating from db.json to PostgreSQL

A migration script has been provided to help transfer data from `db.json` to PostgreSQL:

1. Ensure PostgreSQL is running and the database is created
2. Uncomment the Prisma client code in `src/lib/prisma.ts`
3. Run `npm run prisma:generate` to ensure the Prisma client is up to date
4. Run `npm run prisma:migrate` to apply any pending migrations
5. Run `npm run db:migrate-to-postgres` to migrate data from `db.json` to PostgreSQL

### Migrating from PostgreSQL back to db.json

If you need to switch back to using `db.json`:

1. Ensure the Prisma client code in `src/lib/prisma.ts` is uncommented
2. Run `npm run db:migrate-from-postgres` to migrate data from PostgreSQL to `db.json`
3. Comment out the Prisma client code in `src/lib/prisma.ts` if you want to ensure the application only uses `db.json`

### Manual Code Changes

After migrating the data, you'll need to update the application code to use Prisma instead of the JSON file:

1. Update the server action files to use Prisma instead of the JSON file-based db implementation:
   - In files like `src/app/admin/admins/_actions/admins.ts`, uncomment the Prisma import and comment out the db import
   - Replace db function calls with equivalent Prisma client calls

A conversion example is provided in `docs/prisma-conversion-example.ts` that shows how to modify a server action to use Prisma instead of the JSON file-based implementation.

Note that switching to PostgreSQL will require modifying multiple files throughout the codebase to use the Prisma client instead of the JSON file-based implementation.