# ParkPass — Smart Car Parking (Frontend)

React + Vite + Axios. No third-party UI kit — plain CSS with a custom design system in
`src/styles/index.css`.

## Run it

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at the Spring Boot backend
npm run dev
```

Opens on `http://localhost:5173`.

## Screens
- **Availability** — live slot grid, filterable by zone/floor/category, book a slot with a time window
- **My Bookings** — check in or cancel an active reservation
- **Admin** — all reservations across employees, expired/no-show count

The dashboard and bookings views poll every 15s, so auto-expiry (a slot's reservation
lapsing and returning to FREE) shows up without a manual refresh — make sure that's visible
in the demo.

## API contract expected from the backend

See `src/api/client.js` for the exact calls. Summary:

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/api/slots?zone=&floor=&category=` | — | returns `ParkingSlot[]`, filters optional |
| GET | `/api/reservations?employeeId=` | — | current employee's reservations |
| GET | `/api/reservations/admin` | — | all reservations, for the admin view |
| POST | `/api/reservations` | `{ slotId, employeeId, windowStart, windowEnd }` | create booking |
| POST | `/api/reservations/{id}/checkin` | — | marks arrival |
| POST | `/api/reservations/{id}/cancel` | — | releases the slot early |

**ParkingSlot**: `{ id, code, zone, floor, category, status }`
`status` ∈ `FREE | RESERVED | OCCUPIED`. If `status = RESERVED`, also send `reservedUntil`
(ISO timestamp) so the UI can show a countdown.

**Reservation**: `{ id, slotId, slotCode, employeeId, windowStart, windowEnd, checkedInAt, status }`
`status` ∈ `ACTIVE | CHECKED_IN | EXPIRED | CANCELLED`

All timestamps: ISO-8601 strings, e.g. `2026-07-24T09:30:00`.

CORS: enable `http://localhost:5173` as an allowed origin on the Spring Boot side
(`@CrossOrigin` or a global `CorsConfigurationSource` bean).

## If the backend isn't ready yet
Point `VITE_API_BASE_URL` at a quick mock — `json-server` or a couple of `@RestController`
stub endpoints returning hardcoded arrays matching the shapes above — the frontend doesn't
care as long as the JSON shape matches.
