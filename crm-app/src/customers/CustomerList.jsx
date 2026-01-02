import { supabase } from '../supabase'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import InteractionPanel from '../interactions/AddInteraction'

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    applySearch()
  }, [search, customers])

  const loadCustomers = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = profile?.role || 'user'
    setRole(userRole)

    let query = supabase.from('customers').select('*')

    if (userRole !== 'admin') {
      query = query.eq('user_id', user.id)
    }

    const { data } = await query.order('created_at', { ascending: false })
    setCustomers(data || [])
    setFiltered(data || [])
  }

  const applySearch = () => {
    if (!search.trim()) {
      setFiltered(customers)
      return
    }

    const q = search.toLowerCase()

    const results = customers.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    )

    setFiltered(results)
  }

  return (
    <>
      <Navbar role={role} />

      <div className="container mt-4">
        <h4 className="mb-3">Customers</h4>

        {/* 🔍 SEARCH INPUT */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {filtered.length === 0 && (
          <p className="text-muted">
            No customers found.
          </p>
        )}

        {filtered.map(c => (
          <div key={c.id} className="card customer-card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5>{c.name}</h5>
                <span className={`badge bg-${statusColor(c.status)}`}>
                  {c.status}
                </span>
              </div>

              <p className="text-muted mb-1">{c.email}</p>
              <p className="text-muted mb-2">{c.phone}</p>

              {/* Interaction UI */}
              <InteractionPanel customerId={c.id} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function statusColor(status) {
  if (status === 'Active') return 'success'
  if (status === 'Lead') return 'secondary'
  return 'dark'
}
