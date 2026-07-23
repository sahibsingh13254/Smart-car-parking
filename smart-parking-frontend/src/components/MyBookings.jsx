import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { formatTimeRange } from '../utils/time'

const STATUS_LABEL = {
  ACTIVE: 'Active',
  CHECKED_IN: 'Checked in',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
}

export default function MyBookings({ employeeId }) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.getMyReservations(employeeId)
      setReservations(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 15000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCheckIn = async (id) => {
    await api.checkIn(id)
    load()
  }

  const handleCancel = async (id) => {
    await api.cancel(id)
    load()
  }

  return (
    <div>
      <h2 className="section-heading">My Bookings</h2>
      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No bookings yet</div>
          Head to Availability to reserve a slot.
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Window</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.slotCode}</td>
                <td>{formatTimeRange(r.windowStart, r.windowEnd)}</td>
                <td>{STATUS_LABEL[r.status]}</td>
                <td>
                  {r.status === 'ACTIVE' && (
                    <>
                      <button className="row-action checkin" onClick={() => handleCheckIn(r.id)}>
                        Check in
                      </button>
                      <button className="row-action cancel" onClick={() => handleCancel(r.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
