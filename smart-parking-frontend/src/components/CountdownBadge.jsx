import { useEffect, useState } from 'react'
import { formatCountdown } from '../utils/time'

export default function CountdownBadge({ targetIso }) {
  const [label, setLabel] = useState(() => formatCountdown(targetIso))

  useEffect(() => {
    const id = setInterval(() => setLabel(formatCountdown(targetIso)), 1000)
    return () => clearInterval(id)
  }, [targetIso])

  return <span className="countdown">expires in {label}</span>
}
