import { supabase } from '../supabase'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const email = e.target.email.value
    const password = e.target.password.value

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMsg(error.message)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="container col-md-4 mt-5">
      <h3>Login</h3>

      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          name="email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          className="form-control mb-3"
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        {errorMsg && (
          <div className="alert alert-danger">
            {errorMsg}
          </div>
        )}

        <button
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center mt-3">
          New here?{' '}
          <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
