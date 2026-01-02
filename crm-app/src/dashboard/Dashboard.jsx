import { supabase } from '../supabase'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const [role, setRole] = useState('')
  const [stats, setStats] = useState({
    customers: 0,
    interactions: 0,
  })

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
  
    // get role safely
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
  
    const role = profile?.role || 'user'
    setRole(role)
  
    // customers count
    let customersCount = 0
  
    if (role === 'admin') {
      const { count } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
  
      customersCount = count
    } else {
      const { count } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
  
      customersCount = count
    }
  
    // interactions count
    const { count: interactionsCount } = await supabase
      .from('interactions')
      .select('*', { count: 'exact', head: true })
  
    setStats({
      customers: customersCount,
      interactions: interactionsCount,
    })
  }
  
  

  return (
    <>
      <Navbar role={role} />

      <div className="container mt-4">
        <h4 className="mb-4">Dashboard Overview</h4>

        <div className="row">
          <StatCard title="Customers" value={stats.customers} color="primary" />
          <StatCard title="Interactions" value={stats.interactions} color="success" />
        </div>
      </div>
    </>
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
