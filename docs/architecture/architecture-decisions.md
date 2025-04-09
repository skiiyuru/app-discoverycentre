# Architecture Decisions

## Core Principles

1. **Leverage Next.js Features First**

   - Use React Server Components (RSC) for data fetching
   - Server Actions for mutations
   - App Router for routing and layouts
   - Server-side data access with minimal client-side state

2. **Data Flow Architecture**

   ```
   Server Components → Database Queries
         ↓
   Props & Server Actions
         ↓
   Client Components (UI + Interactivity)
   ```

3. **Key Benefits**
   - Reduced client-side JavaScript
   - Type-safe database queries
   - Simplified state management
   - Progressive enhancement
   - Better performance

## Implementation Guidelines

### Data Fetching

```typescript
// Server Component
async function EventsPage() {
  // Direct database access
  const events = await db.query.events.findMany()

  return <EventsList events={events} />
}
```

### Mutations

```typescript
// Server Action
async function registerParticipant(data: FormData) {
  // 1. Validate
  // 2. Process payment
  // 3. Save to database
  return result
}

// Client Component
'use client'
function RegistrationForm() {
  // Use server action
  const register = useFormState(registerParticipant)
}
```

### Feature Organization

```
src/
├── features/
│   └── event/
│       ├── components/     # React components
│       │   ├── server/    # Server components
│       │   └── client/    # Client components
│       └── actions/       # Server actions
└── lib/
    └── db/               # Database operations
```

## External Integrations (e.g., M-PESA)

- Keep third-party API calls in server-side code
- Use Server Actions for payment flows
- Handle callbacks via API routes

## Real-time Updates Implementation

### Server-Sent Events (SSE)

Current implementation uses SSE for real-time payment status updates with the following architecture:

```plaintext
M-PESA Callback → Server Action → SSE → Client Component
```

#### Implementation Details

- SSE endpoint using Edge Runtime
- `globalThis` for storing stream controllers
- Custom hook for client-side consumption
- Type-safe event emissions

#### Current Approach Limitations

The current implementation uses `globalThis` as a temporary store for stream controllers, which has several limitations:

1. **Memory-based Storage**

   - Doesn't persist across server restarts
   - Controllers are lost if the server crashes
   - Not suitable for serverless environments

2. **Scalability Constraints**

   - Doesn't work across multiple server instances
   - No built-in cleanup mechanism
   - Memory usage grows with concurrent connections

3. **Development-friendly Trade-offs**
   - Simple to implement and understand
   - Works well for prototyping and development
   - Sufficient for current scale

#### Future Scaling Options

As the application grows, consider these alternatives:

1. **Redis-based Solution**

   ```typescript
   // Store controller references in Redis
   // while keeping real-time capabilities
   ```

2. **Alternative Technologies**

   - WebSocket for bidirectional communication
   - Pusher for managed real-time infrastructure
   - Socket.io for more complex real-time features

3. **Message Queues**
   - Redis Pub/Sub for distributed events
   - Apache Kafka for high-scale scenarios
   - Amazon SQS/SNS for cloud-native approach

The current SSE implementation serves as a foundation that can be replaced with minimal changes to the client-side code when needed.

## Database Indexing Strategy

### Current Implementation

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

### Design Considerations

1. **Index Selection**

   - Indexes match actual query patterns
   - Avoided indexes on rarely queried columns
   - Considered column cardinality for composite indexes

2. **Performance Trade-offs**

   - Write overhead vs read performance
   - Storage space vs query speed
   - Index maintenance costs

3. **SQLite/Turso Specific**
   - Automatic PRIMARY KEY indexing
   - Single index usage per table per query
   - Implicit indexes from UNIQUE constraints

### Future Considerations

1. **Index Performance Monitoring**

   ```typescript
   // TODO: Implement monitoring for:
   - Index usage statistics
   - Query execution plans
   - Index size growth
   - Write performance impact
   ```

2. **Maintenance Strategy**

   - Regular index usage analysis
   - Periodic index rebuilding
   - Unused index cleanup
   - Query pattern changes monitoring

3. **Scaling Considerations**
   - Index size vs database growth
   - Write-heavy vs read-heavy operations
   - Cache strategy integration
   - Potential for selective indexing

### Implementation Example

```typescript
// Current optimal query pattern
const payment = await db.query.payments.findFirst({
  where: and(
    eq(payments.merchantRequestId, requestId),
    eq(payments.checkoutRequestId, checkoutId)
  )
})
```

This documentation will be updated as we implement monitoring and gather performance metrics.

## Future Considerations

While starting with this simpler approach, the architecture allows for:

- Adding real-time features via Server-Sent Events
- Implementing caching strategies
- Scaling to handle more complex data requirements
- Integration with additional payment providers

## Why Not GraphQL?

Current architecture provides similar benefits without additional complexity:

- Type safety through TypeScript
- Efficient data fetching via RSC
- Flexible data access patterns
- Built-in state management
