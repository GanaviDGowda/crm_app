import { supabase } from '../supabase'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

export default function FollowUps() {
  const [followUps, setFollowUps] = useState([])
  const [role, setRole] = useState('')

  useEffect(() => {
    loadFollowUps()
  }, [])

  const loadFollowUps = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const userRole = profile?.role || 'user'
    setRole(userRole)

    let baseQuery = supabase
      .from('interactions')
      .select(`
        id,
        type,
        note,
        follow_up_date,
        customers (
          name,
          user_id
        )
      `)
      .not('follow_up_date', 'is', null)
      .gte('follow_up_date', new Date().toISOString().split('T')[0])
      .order('follow_up_date', { ascending: true })

    const { data } = await baseQuery
    setFollowUps(data || [])
  }

  return (
    <>
      <Navbar role={role} />

      <div className="container mt-4">
        <h4 className="mb-3">Upcoming Follow-Ups</h4>

        {followUps.length === 0 && (
          <p className="text-muted">
            No upcoming follow-ups scheduled.
          </p>
        )}

        {followUps.map(f => (
          <div key={f.id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <strong>{f.customers?.name}</strong>
                <span className="badge bg-warning text-dark">
                  {f.follow_up_date}
                </span>
              </div>

              <div className="text-muted small">
                {f.type}
              </div>

              {f.note && (
                <div className="mt-1 small">
                  {f.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
