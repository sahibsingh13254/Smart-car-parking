import { useState } from 'react'
import { toLocalInputValue } from '../utils/time'

export default function BookingModal({ slot, employeeId, onClose, onConfirm }) {
  const now = new Date()
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000)

  const [start, setStart] = useState(toLocalInputValue(now))
  const [end, setEnd] = useState(toLocalInputValue(inOneHour))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    setError('')
    if (new Date(end) <= new Date(start)) {
      setError('End time must be after start time.')
      return
    }
    setSubmitting(true)
    try {
      await onConfirm({
        slotId: slot.id,
        employeeId,
        windowStart: new Date(start).toISOString(),
        windowEnd: new Date(end).toISOString(),
      })
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not book this slot. Try another window.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Book {slot.code}</h3>
        <p className="modal-sub">
          {slot.zone} · Floor {slot.floor} · {slot.category}
        </p>

        <div className="field-group">
          <label className="field-label">Arrival</label>
          <input
            type="datetime-local"
            className="field-input"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Leave by</label>
          <input
            type="datetime-local"
            className="field-input"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        {error && <div className="error-text">{error}</div>}

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Booking…' : 'Confirm booking'}
          </button>
        </div>
      </div>
    </div>
  )
}
