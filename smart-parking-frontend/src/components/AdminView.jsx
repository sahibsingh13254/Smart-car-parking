import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { formatTimeRange } from '../utils/time'

const STATUS_LABEL = {
  ACTIVE: 'Active',
  CHECKED_IN: 'Checked in',
  EXPIRED: 'Expired',
  CANCELLED: 'Cancelled',
}

export default function AdminView() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await api.getAllReservations()
        setReservations(data)
      } finally {
        setLoading(false)
      }
    }
    load()
    const id = setInterval(load, 15000)
    return () => clearInterval(id)
  }, [])

  const expiredCount = reservations.filter((r) => r.status === 'EXPIRED').length

  return (
    <div>
      <h2 className="section-heading">Admin — All Reservations</h2>
      <div className="banner">
        {expiredCount} no-show{expiredCount === 1 ? '' : 's'} auto-released back to the pool
        today.
      </div>
      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Slot</th>
              <th>Window</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.employeeId}</td>
                <td>{r.slotCode}</td>
                <td>{formatTimeRange(r.windowStart, r.windowEnd)}</td>
                <td>{STATUS_LABEL[r.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
