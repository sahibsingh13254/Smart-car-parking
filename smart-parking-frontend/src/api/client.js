import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const http = axios.create({
  baseURL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

/*
 * Expected backend contract (share this with backend teammate):
 *
 * GET    /slots?zone=&floor=&category=      -> ParkingSlot[]
 * GET    /reservations?employeeId=          -> Reservation[]
 * GET    /reservations/admin                -> Reservation[] (all, for admin view)
 * POST   /reservations   { slotId, employeeId, windowStart, windowEnd }
 * POST   /reservations/{id}/checkin
 * POST   /reservations/{id}/cancel
 *
 * ParkingSlot: { id, code, zone, floor, category, status }
 *   status: "FREE" | "RESERVED" | "OCCUPIED"
 *
 * Reservation: { id, slotId, slotCode, employeeId, windowStart, windowEnd,
 *                checkedInAt, status }
 *   status: "ACTIVE" | "CHECKED_IN" | "EXPIRED" | "CANCELLED"
 * Timestamps are ISO-8601 strings.
 */

export const api = {
  getSlots: (filters = {}) => http.get('/slots', { params: filters }).then((r) => r.data),

  getMyReservations: (employeeId) =>
    http.get('/reservations', { params: { employeeId } }).then((r) => r.data),

  getAllReservations: () => http.get('/reservations/admin').then((r) => r.data),

  createReservation: (payload) => http.post('/reservations', payload).then((r) => r.data),

  checkIn: (reservationId) =>
    http.post(`/reservations/${reservationId}/checkin`).then((r) => r.data),

  cancel: (reservationId) =>
    http.post(`/reservations/${reservationId}/cancel`).then((r) => r.data),
}
