import { useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import MyBookings from './components/MyBookings'
import AdminView from './components/AdminView'

export default function App() {
  const [tab, setTab] = useState('dashboard')
  // Hackathon-scope stub: no real auth needed, just an employee identifier.
  const [employeeId] = useState('EMP-1024')

  return (
    <div className="app-shell">
      <Navbar active={tab} onChange={setTab} />
      {tab === 'dashboard' && <Dashboard employeeId={employeeId} />}
      {tab === 'mybookings' && <MyBookings employeeId={employeeId} />}
      {tab === 'admin' && <AdminView />}
    </div>
  )
}
