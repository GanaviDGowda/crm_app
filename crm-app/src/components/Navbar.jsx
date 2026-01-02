import { supabase } from '../supabase'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ role }) {
  const navigate = useNavigate()

  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <span className="navbar-brand fw-bold">CRM App</span>

      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/customers">Customers</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/customers/add">Add Customer</Link>
          </li>
        </ul>
        <li className="nav-item">
            <Link className="nav-link" to="/followups">
                Follow-Ups
            </Link>
            </li>


        <span className="badge bg-warning text-dark me-3">
          Role: {role}
        </span>

        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  )
}
