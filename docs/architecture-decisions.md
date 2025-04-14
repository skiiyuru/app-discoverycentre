# Architecture Decisions

## Core Architecture: Serverless First

We chose a fully serverless architecture to match our tournament registration system's sporadic usage patterns:

1. **Next.js App Router**

   - Server Components for data fetching
   - Server Actions for mutations
   - Edge Runtime for global performance

2. **Database: Neon (Serverless PostgreSQL)**

   - HTTP connections over WebSocket/TCP
   - Connection per request model
   - Automatic scaling and pause

3. **Real-time: Upstash Redis**
   - HTTP-based Redis for payment updates
   - Serverless-friendly pub/sub
   - No connection management overhead

### Key Benefits

- Pay per use matches tournament cycles
- Auto-scaling for registration spikes
- Zero maintenance during quiet periods
- Global edge deployment for Kenya-wide access

## Implementation Patterns

### Data Access Pattern

```typescript
// Server Components: Direct database access
async function TournamentPage() {
  const tournament = await db.query.tournaments.findFirst({
    where: eq(tournaments.id, currentId)
  })
  return <TournamentDetails tournament={tournament} />
}

// Server Actions: Mutations with real-time updates
async function registerPlayer(data: FormData) {
  // 1. Database write
  const player = await db.insert(players).values(...)
  // 2. Payment initiation
  const payment = await initiateMpesa(...)
  // 3. Real-time notification
  await publishPaymentUpdate(...)
  return player
}
```

### Payment Flow Architecture

1. **M-PESA Integration**

   - Server Actions for payment initiation
   - Webhook handlers for callbacks
   - Real-time status updates via Redis

2. **Status Updates**
   - Redis pub/sub for real-time notifications
   - SSE for client updates
   - Automatic connection cleanup

## Learnings & Trade-offs

### Database Indexing Strategy

1. **Participant Search Index**

   ```typescript
   index('participant_name_idx').on(table.firstName, table.lastName)
   ```

   - Optimizes participant lookup by name
   - Column order based on query patterns

2. **Payment Tracking Indexes**
   ```typescript
   uniqueIndex('request_id_idx').on(table.merchantRequestId, table.checkoutRequestId)
   index('phone_status_idx').on(table.phoneNumber, table.status)
   ```
   - Ensures M-PESA transaction uniqueness
   - Optimizes payment status lookups
   - Composite indexes match common query patterns

#### Design Considerations

- Indexes match actual query patterns
- Avoided indexes on rarely queried columns
- Considered column cardinality for composite indexes

### Database Connections

- **HTTP Over WebSocket**: Chose HTTP for database connections because:
  - Most operations are single request/response
  - Better cold start performance
  - Simpler connection management
  - Lower costs for sporadic access

### Real-time Updates

- **Redis + SSE Over WebSocket**:
  - More reliable for serverless
  - Better browser support
  - Simpler error handling
  - Automatic reconnection

### State Management

- **Server-centric Over Client State**:
  - Reduced client-side complexity
  - Better consistency
  - Simplified data flow
  - Enhanced security

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── server/         # Server Components
│   └── client/         # Client Components
├── db/                 # Database setup & schema
└── lib/                # Shared utilities
    ├── mpesa/         # Payment integration
    └── redis/         # Real-time updates
```

## Future Considerations

1. **Monitoring & Debugging**

   - Implement payment flow logging
   - Add performance monitoring

2. **Performance Optimization**

   - Implement caching strategy
   - Optimize cold starts
   - Add edge caching

3. **Scale Considerations**
   - Monitor database connection patterns
   - Track Redis usage metrics
   - Analyze payment flow bottlenecks
