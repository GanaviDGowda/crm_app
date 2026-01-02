import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return alert(error.message)

    nav('/dashboard')
  }

  return (
    <div className="container col-md-4 mt-5">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <input className="form-control mb-2" name="email" />
        <input className="form-control mb-3" name="password" type="password" />
        <button className="btn btn-success w-100">Login</button>
      </form>
    </div>
  )
}
