import { useEffect, useMemo, useState } from 'react'
import SlotCard from './SlotCard'
import BookingModal from './BookingModal'
import { api } from '../api/client'

export default function Dashboard({ employeeId }) {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ zone: '', floor: '', category: '' })
  const [bookingSlot, setBookingSlot] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getSlots(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      )
      setSlots(data)
    } catch (err) {
      setError('Could not reach the parking service. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 15000) // poll so auto-expiry shows up without a manual refresh
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const options = useMemo(() => {
    const zones = new Set()
    const floors = new Set()
    const categories = new Set()
    slots.forEach((s) => {
      zones.add(s.zone)
      floors.add(s.floor)
      categories.add(s.category)
    })
    return { zones: [...zones], floors: [...floors], categories: [...categories] }
  }, [slots])

  const freeCount = slots.filter((s) => s.status === 'FREE').length

  const handleConfirmBooking = async (payload) => {
    await api.createReservation(payload)
    setBookingSlot(null)
    load()
  }

  return (
    <div>
      <div className="hero">
        <div>
          <div className="hero-stat">
            <span>{freeCount}</span> / {slots.length}
          </div>
          <div className="hero-label">slots free right now</div>
        </div>
        <div className="hero-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--available)' }} />
            Free
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--reserved)' }} />
            Reserved
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: 'var(--occupied)' }} />
            Occupied
          </div>
        </div>
      </div>

      <div className="filters">
        <select
          className="filter-select"
          value={filters.zone}
          onChange={(e) => setFilters((f) => ({ ...f, zone: e.target.value }))}
        >
          <option value="">All zones</option>
          {options.zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={filters.floor}
          onChange={(e) => setFilters((f) => ({ ...f, floor: e.target.value }))}
        >
          <option value="">All floors</option>
          {options.floors.map((f) => (
            <option key={f} value={f}>
              Floor {f}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="">All categories</option>
          {options.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="banner">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading slots…</div>
      ) : slots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No slots match these filters</div>
          Try clearing a filter above.
        </div>
      ) : (
        <div className="slot-grid">
          {slots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} onBook={setBookingSlot} />
          ))}
        </div>
      )}

      {bookingSlot && (
        <BookingModal
          slot={bookingSlot}
          employeeId={employeeId}
          onClose={() => setBookingSlot(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  )
}
