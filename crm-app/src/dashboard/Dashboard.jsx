import { supabase } from '../supabase'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState({ customers: 0, interactions: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()

    const channel = supabase
      .channel('dashboard-stats')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        loadStats
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'interactions' },
        loadStats
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadStats = async () => {
    const { count: customers } = await supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })

    const { count: interactions } = await supabase
      .from('interactions')
      .select('id', { count: 'exact', head: true })

    setStats({
      customers: customers || 0,
      interactions: interactions || 0,
    })
    setLoading(false)
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
      <h4 className="mb-4">Dashboard Overview</h4>

      <div className="row">
        <StatCard title="Customers" value={stats.customers} color="primary" />
        <StatCard title="Interactions" value={stats.interactions} color="success" />
      </div>
    </div>
  )
}

function StatCard({ title, value, color }) {
  return (
    <div className="col-md-6 mb-3">
      <div className={`card border-${color} shadow-sm`}>
        <div className="card-body text-center">
          <h6 className="text-muted">{title}</h6>
          <h2 className={`text-${color}`}>{value}</h2>
        </div>
      </div>
    </div>
  )
}
