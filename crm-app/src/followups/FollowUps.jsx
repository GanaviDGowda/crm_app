import { supabase } from '../supabase'
import { useEffect, useState } from 'react'

export default function FollowUps() {
  const [items, setItems] = useState([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('interactions')
      .select('*, customers!inner(user_id, name)')
      .eq('customers.user_id', user.id)
      .not('follow_up_date', 'is', null)

    setItems(data || [])
  }

  return (
    <div className="container mt-4">
      <h4>Follow Ups</h4>

      {items.map(i => (
        <div key={i.id} className="card mb-2">
          <div className="card-body">
            <strong>{i.customers.name}</strong>
            <div>{i.follow_up_date}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
