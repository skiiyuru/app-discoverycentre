# Chess Tournament Registration

A web application for managing chess tournament registrations with M-PESA payment integration.

## Features

- Tournament registration form
- M-PESA mobile money integration
- Participant management
- Real-time payment verification

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Turso (SQLite)
- **ORM**: Drizzle
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **Payment**: M-PESA

## Development

First, run the development server:

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Management

```bash
# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Open database UI
pnpm db:studio
```

## Environment Variables

```bash
# Database
TURSO_CONNECTION_URL=
TURSO_AUTH_TOKEN=

# M-PESA (coming soon)
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Turso Documentation](https://docs.turso.tech)
- [M-PESA API Documentation](https://developer.safaricom.co.ke)
