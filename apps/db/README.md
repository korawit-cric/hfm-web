# Database (`hfm-db`)

PostgreSQL database service running in Docker.

## Usage

```bash
# Start the database
npm run dev
# or
npm start

# Stop the database
npm stop
# or
npm run down

# View logs
npm run logs

# Check status
npm run ps
```

## Environment Variables

The database configuration is read from the root `.env` file:

- `DB_USER` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - PostgreSQL password (default: postgres)
- `DB_NAME` - Database name (default: `hfm-db`)
- `DB_PORT` - Host port mapping (default: 5433)
- `DB_CONTAINER_NAME` - Docker container name (default: `hfm-db`)
- `DATABASE_URL` - Full connection string for Prisma

## Troubleshooting

**Prisma: "Database does not exist" (P1003)**

Postgres only creates `POSTGRES_DB` on the **first** container start. If you changed `DB_NAME` or the volume was created with an old name, either:

1. **Recreate the volume** (wipes local DB data): from repo root, `npm run db:stop` then `docker volume rm` for the compose volume (see `apps/db/docker-compose.yml`), or `docker compose -f apps/db/docker-compose.yml down -v`, then `npm run db:start` and `npm run db:push` / migrate + seed.

2. **Create the database manually** (keeps other DBs):

   ```bash
   docker compose -f apps/db/docker-compose.yml exec postgres \
     psql -U postgres -c 'CREATE DATABASE "hfm-db";'
   ```

Ensure root `.env` has `DB_NAME=hfm-db` and matching `DATABASE_URL`.

## Connection

The database is accessible at:

- **Host**: localhost
- **Port**: ${DB_PORT:-5433}
- **Database**: ${DB_NAME:-hfm-db}
- **User**: ${DB_USER:-postgres}
- **Password**: ${DB_PASSWORD:-postgres}
