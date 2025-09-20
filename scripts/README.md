# Migration Scripts

This directory contains scripts for migrating data between different storage options in the Benevolence Hub application.

## Available Scripts

### migrate-to-postgres.ts

This script migrates data from the local `db.json` file to a PostgreSQL database using Prisma.

**Usage:**
```bash
npm run db:migrate-to-postgres
```

**Prerequisites:**
- PostgreSQL database must be running and accessible
- The database connection string must be correctly set in the `.env` file
- Prisma migrations must be applied (`npm run prisma:migrate`)

**What it does:**
- Reads all data from `db.json`
- Clears existing data in the PostgreSQL database
- Inserts all projects, users, volunteers, and donations into PostgreSQL

### migrate-from-postgres.ts

This script migrates data from a PostgreSQL database back to the local `db.json` file.

**Usage:**
```bash
npm run db:migrate-from-postgres
```

**Prerequisites:**
- PostgreSQL database must be running and accessible
- The database connection string must be correctly set in the `.env` file

**What it does:**
- Fetches all data from the PostgreSQL database using Prisma
- Converts date objects to ISO strings for JSON storage
- Writes all projects, users, volunteers, and donations to `db.json`

## Notes

- These scripts are intended for development and testing purposes
- Always back up your data before running migration scripts
- After migrating data, you'll need to update the application code to use the appropriate data source (see `docs/postgres-setup.md` for details)