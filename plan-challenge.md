# Challenge implementation plan

Implement the minimum functional setup for challenges for the ACWP, with Server-Sent Events for live notifications.

## Minimum entities

### Challenge

Create a dedicated `Challenge` entity with:

- `id`
- `challenger: Player`
- `challenged: Player`
- `status: ChallengeStatus`
- `challengerDeckSnapshot: ChallengeDeckSnapshot`
- `createdAt`
- `updatedAt`
- `expiresAt`
- `challengedReadAt`
- `challengerReadAt`
- `match: Match`
- `cancelReason: ChallengeCancelReason`

Recommended status values:

- `PENDING`
- `PLAYED`
- `DECLINED`
- `WITHDRAWN`
- `EXPIRED`
- `CANCELLED`

Recommended cancellation values:

- `DECLINED`
- `WITHDRAWN`
- `DECK_CHANGED`
- `EXPIRED`
- `CANCELLED`

Leave automatic expiration and deck-change invalidation as TODOs. `expiresAt` may be nullable for the initial implementation.

Use read timestamps rather than a single `isRead` field. `challengedReadAt` supports acknowledging received challenges and result items. `challengerReadAt` is useful for separating closed challenge views later.

### ChallengeDeckSnapshot

Create a separate deck snapshot entity instead of serializing raw JSON. Store:

- `id`
- `capturedAt`
- `god`
- `ascendantCardDefinition: CardDefinition`
- `cardSnapshots: List<ChallengeDeckCardSnapshot>`

This snapshot represents the challenger deck at challenge creation and the challenged deck at acceptance.

### ChallengeDeckCardSnapshot

Create a snapshot row for each creature card:

- `id`
- `challengeDeckSnapshot`
- `cardDefinition`
- `position`

Do not alter `Player`, `Deck`, or `PlayerCard` in this phase.

### Match

Create a `Match` entity for ACWP functionality:

- `id`
- `challenge`
- `challenger: Player`
- `challenged: Player`
- `challengerDeckSnapshot: ChallengeDeckSnapshot`
- `challengedDeckSnapshot: ChallengeDeckSnapshot`
- `status: MatchStatus`
- `winner: Player` or a nullable `MatchOutcome` enum
- `engineSeed`
- `enginePayload`
- `createdAt`
- `completedAt`

Recommended match statuses:

- `PENDING`
- `READY`
- `ENGINE_FAILED`

Recommended outcomes:

- `CHALLENGER_WIN`
- `CHALLENGED_WIN`
- `DRAW`

The engine payload is optional for the ACWP but useful for debugging and replay. It must not be the only source of the match result.

## Challenge API setup

Implement the minimum endpoints needed for the demonstration:

- `GET /api/challenges?box=TO_PLAY|SENT`
- `POST /api/challenges`
- `POST /api/challenges/{id}/accept`
- `POST /api/challenges/{id}/decline`
- `POST /api/challenges/{id}/withdraw`
- `POST /api/training`
- `GET /api/challenges/events` as an SSE endpoint

For the ACWP, `training` may use a fixed opponent deck and does not need a persisted challenge or rewards.

## Sending a challenge

On `POST /api/challenges`:

1. Require `opponentId`.
2. Reject the same player.
3. Reject an existing pending challenge between the same pair.
4. Validate the challenger deck at challenge creation.
5. Copy the current deck and faction into `ChallengeDeckSnapshot` entities.
6. Save the challenge with `PENDING` status.
7. Emit `CHALLENGE_RECEIVED` through SSE.

Do not add a deck identifier that is only a reference to the mutable current deck. Snapshot the deck needed for the match.

## Accepting a challenge

On `POST /api/challenges/{id}/accept`:

1. Verify that the challenge belongs to the authenticated challenged player.
2. Verify that the challenge is `PENDING`.
3. Validate the challenged player deck.
4. Copy the challenged deck and faction into a second `ChallengeDeckSnapshot`.
5. Create a `Match` and call the existing engine client synchronously.
6. Save the engine result and set `matchId`/match status.
7. Set the challenge status to `PLAYED`.
8. Emit `MATCH_READY` through SSE.

If the engine is unavailable:

- Keep the challenge valid.
- Return `503 ENGINE_UNAVAILABLE`.
- Leave a retryable match state, for example `ENGINE_FAILED`.

For the ACWP, `accept` may wait for the engine response and then return `{ "matchId": 88 }`.

## Challenge list contract

For `TO_PLAY`, include received pending challenges and recently played challenges awaiting acknowledgement.

For `SENT`, include pending challenges and recently closed challenges.

The challenge item should expose:

- `id`
- `status`
- `direction`
- `opponent` as a player reference
- `opponentStats`
- `createdAt`
- `expiresAt`
- `rewarded`
- `matchId`
- `cancelReason`

`rewarded` is a planned response field. Credit rewards may be TODO for the demo, with `rewarded` initially derived or set to a fixed value.

## SSE setup

Use a simple in-memory `SseEmitter` registry grouped by player ID for the ACWP.

Event types:

- `CHALLENGE_RECEIVED`
- `CHALLENGE_STATUS_CHANGED`
- `MATCH_READY`
- `MATCH_FAILED`

SSE is a notification transport only. Database entities remain authoritative, and clients should still reload challenge and match data through REST.

The challenge should not disappear merely because an SSE event was delivered. Read timestamps or acknowledgement endpoints remain the source of read state.

## TODO items deferred for the ACWP

- Automatic expiry and scheduled cancellation
- Challenger changing their deck after challenge creation
- Credit rewards and reward idempotency
- Duplicate reward protection
- Production SSE infrastructure or message broker
- Persisted emitter state across backend restarts
- Replay/debug UI
- Notification delivery guarantees
- Training match history and rewards

## Finished-product additions

After the ACWP, add:

- Database-backed challenge notifications
- Reward grants with exactly-once semantics
- Deck-change challenge cancellation
- Scheduled expiration
- Match history and replay
- Challenger and challenged read states
- Engine retry and idempotency policies
- SSE heartbeat and reconnection handling
- Concurrency constraints for duplicate pending challenges
- Unique pending pair constraints or database locking

## Entity restrictions

Create new challenge, snapshot, and match entities freely. Do not modify existing `Player`, `Deck`, or `PlayerCard` entities during this implementation. Any later changes to those entities require separate work and branch coordination.