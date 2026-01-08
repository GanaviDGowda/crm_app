import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (mounted) {
        setUser(data?.user ?? null)
        setLoading(false)
      }
    }

    loadUser()

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) return <div className="text-center mt-5">Checking authentication...</div>

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
