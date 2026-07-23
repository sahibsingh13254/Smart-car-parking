export function formatCountdown(targetIso) {
  const diffMs = new Date(targetIso).getTime() - Date.now()
  if (diffMs <= 0) return 'expiring…'
  const totalSec = Math.floor(diffMs / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

export function formatTimeRange(startIso, endIso) {
  const opts = { hour: '2-digit', minute: '2-digit' }
  const start = new Date(startIso).toLocaleTimeString([], opts)
  const end = new Date(endIso).toLocaleTimeString([], opts)
  return `${start} – ${end}`
}
