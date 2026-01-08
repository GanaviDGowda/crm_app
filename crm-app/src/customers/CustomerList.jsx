import { supabase } from '../supabase'
import { useEffect, useState } from 'react'
import InteractionPanel from '../interactions/AddInteraction'

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomers()

    const channel = supabase
      .channel('customers-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        payload => {
          loadCustomers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    applySearch()
  }, [search, customers])

  const loadCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setCustomers(data || [])
      setFiltered(data || [])
    }
    setLoading(false)
  }

  const applySearch = () => {
    if (!search.trim()) {
      setFiltered(customers)
      return
    }

    const q = search.toLowerCase()
    setFiltered(
      customers.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
      )
    )
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Customers</h4>

      <input
        className="form-control mb-4"
        placeholder="Search by name, email, or phone"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {filtered.length === 0 && (
        <p className="text-muted">No customers found.</p>
      )}

      {filtered.map(c => (
        <div key={c.id} className="card mb-3 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h5>{c.name}</h5>
              <span className={`badge bg-${statusColor(c.status)}`}>
                {c.status}
              </span>
            </div>

            <p className="text-muted mb-1">{c.email}</p>
            <p className="text-muted mb-2">{c.phone}</p>

            <InteractionPanel customerId={c.id} />
          </div>
        </div>
      ))}
    </div>
  )
}

function statusColor(status) {
  if (status === 'Active') return 'success'
  if (status === 'Lead') return 'secondary'
  return 'dark'
}
