import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

export default function Signup() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const signup = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const email = e.target.email.value
    const password = e.target.password.value

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="container col-md-4">
      <div className="card p-4">
        <h3>Create Account</h3>

        <form onSubmit={signup}>
          <input
            className="form-control mb-3"
            name="email"
            placeholder="Email"
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            name="password"
            placeholder="Password"
            required
          />

          {errorMsg && (
            <div className="alert alert-danger">
              {errorMsg}
            </div>
          )}

          <button
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className="text-center mt-3">
            Already have an account?{' '}
            <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
