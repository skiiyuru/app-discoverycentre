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
