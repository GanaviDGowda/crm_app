import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const [role, setRole] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setRole(data?.user?.user_metadata?.role || '')
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  // 🔹 reusable link style
  const linkStyle = {
    display: 'block',
    padding: '10px',
    color: '#0f172a',
    textDecoration: 'none',
    borderRadius: '6px',
    marginBottom: '6px',
    fontWeight: 500,
  }

  const linkHover = {
    backgroundColor: '#e2e8f0',
  }

  return (
    <div>
      {/* TOP BAR */}
      <div style={{ background: '#1e293b', color: 'white', padding: '12px 20px' }}>
        <strong>CRM Dashboard</strong>
        <span style={{ float: 'right' }}>{role.toUpperCase()}</span>
      </div>

      <div style={{ display: 'flex' }}>
        {/* SIDEBAR */}
        <div style={{ width: '220px', background: '#f1f5f9', padding: '15px', minHeight: '100vh' }}>
          <Link
            to="/dashboard"
            style={linkStyle}
            onMouseOver={e => Object.assign(e.target.style, linkHover)}
            onMouseOut={e => Object.assign(e.target.style, linkStyle)}
          >
            Dashboard
          </Link>

          <Link
            to="/customers"
            style={linkStyle}
            onMouseOver={e => Object.assign(e.target.style, linkHover)}
            onMouseOut={e => Object.assign(e.target.style, linkStyle)}
          >
            Customers
          </Link>

          <Link
            to="/customers/add"
            style={linkStyle}
            onMouseOver={e => Object.assign(e.target.style, linkHover)}
            onMouseOut={e => Object.assign(e.target.style, linkStyle)}
          >
            Add Customer
          </Link>

          <Link
            to="/followups"
            style={linkStyle}
            onMouseOver={e => Object.assign(e.target.style, linkHover)}
            onMouseOut={e => Object.assign(e.target.style, linkStyle)}
          >
            Follow-Ups
          </Link>

          <button
            onClick={logout}
            style={{ marginTop: '20px', padding: '8px 12px' }}
          >
            Logout
          </button>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
