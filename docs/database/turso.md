# Turso Database Configuration

Turso credentials are used in two places:

1. **Runtime** (`db/db.ts`) - For application database operations
2. **Drizzle CLI** (`drizzle.config.ts`) - For migrations and schema management

Required environment variables:
```bash
TURSO_CONNECTION_URL=your_connection_url_here
TURSO_AUTH_TOKEN=your_auth_token_here
```