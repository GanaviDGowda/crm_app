import { supabase } from '../supabase'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

export default function UserDashboard() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      supabase.from('customers')
        .select('*', { count:'exact', head:true })
        .eq('user_id', data.user.id)
        .then(r => setCount(r.count))
    })
  }, [])

  return (
    <>
      <Navbar role="User" />
      <div className="container mt-4">
        <h4>My Customers: {count}</h4>
      </div>
    </>
  )
}
