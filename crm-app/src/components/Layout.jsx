import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function components({ children }) {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const email = localStorage.getItem('email')

  const logout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div>
      {/* TOP NAVBAR */}
      <div style={{
        background: '#1e293b',
        color: 'white',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <strong>CRM Dashboard</strong>
        <span>{role?.toUpperCase()}</span>
      </div>

      {/* SIDEBAR */}
      <div style={{ display: 'flex' }}>
        <div style={{
          width: '220px',
          background: '#f1f5f9',
          padding: '15px',
          minHeight: '100vh'
        }}>
          <p><Link to="/dashboard">🏠 Dashboard</Link></p>
          <p><Link to="/customers">👥 Customers</Link></p>
          <p><Link to="/customers/add">➕ Add Customer</Link></p>

          {role === 'admin' && (
            <p><Link to="/admin">🛠 Admin Panel</Link></p>
          )}

          <button onClick={logout} style={{ marginTop: '20px' }}>
            Logout
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
