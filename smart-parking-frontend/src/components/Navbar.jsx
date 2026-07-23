export default function Navbar({ active, onChange }) {
  const tabs = [
    { key: 'dashboard', label: 'Availability' },
    { key: 'mybookings', label: 'My Bookings' },
    { key: 'admin', label: 'Admin' },
  ]

  return (
    <div className="navbar">
      <div className="brand">
        <div className="brand-mark">P</div>
        <div>
          <div className="brand-name">ParkPass</div>
          <div className="brand-sub">Office Lot · Live</div>
        </div>
      </div>
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${active === t.key ? 'active' : ''}`}
            onClick={() => onChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
