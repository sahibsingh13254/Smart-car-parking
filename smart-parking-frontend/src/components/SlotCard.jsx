import CountdownBadge from './CountdownBadge'

const STATUS_LABEL = {
  FREE: 'Free',
  RESERVED: 'Reserved',
  OCCUPIED: 'Occupied',
  EXPIRED: 'Expired',
}

export default function SlotCard({ slot, onBook }) {
  const statusClass = slot.status.toLowerCase()

  return (
    <div className="slot-card">
      <div className="slot-top">
        <div>
          <div className="slot-code">{slot.code}</div>
          <div className="slot-meta">
            {slot.zone} · Floor {slot.floor} · {slot.category}
          </div>
        </div>
        <span className={`status-pill ${statusClass}`}>{STATUS_LABEL[slot.status]}</span>
      </div>

      <div className="slot-footer">
        {slot.status === 'RESERVED' && slot.reservedUntil ? (
          <CountdownBadge targetIso={slot.reservedUntil} />
        ) : (
          <span />
        )}
        <button
          className="book-btn"
          disabled={slot.status !== 'FREE'}
          onClick={() => onBook(slot)}
        >
          {slot.status === 'FREE' ? 'Book slot' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}
