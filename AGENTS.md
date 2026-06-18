# Sneaker Drop Backend Agent Rules

You are working on a high-concurrency "Sneaker Drop" system.

## CORE RULES (NEVER BREAK THESE)

1. Backend logic is the highest priority.
2. Never allow overselling stock.
3. All stock mutations MUST be inside Prisma transactions.
4. Reservation expiry must restore stock.
5. Users can only purchase ACTIVE reservations.
6. Always assume multiple users hit APIs at the same time.

## SYSTEM DESIGN

Entities:
- User
- Drop (inventory)
- Reservation (temporary lock, 60s TTL)
- Purchase (final state)

## CONCURRENCY RULE

- ALWAYS use prisma.$transaction for:
  - reserve stock
  - rollback stock
  - purchase flow

## REAL-TIME RULE

- Use socket.io to emit:
  - stock-updated
  - reservation-created
  - reservation-expired
  - purchase-completed

## CODE STYLE

- Keep services separated from controllers
- No business logic inside routes
- Always validate DB state before mutation
- Fail fast with clear errors

## PRIORITY ORDER

1. Backend logic correctness (100% bug-free)
2. API correctness
3. Real-time sync
4. Frontend integration
5. UI polish
6. Deployment

## DO NOT

- Do not allow race condition unsafe updates
- Do not trust frontend state
- Do not mutate stock outside transaction