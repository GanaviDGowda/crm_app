import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value
    const role = e.target.role.value

    if (!role) {
      alert('Please select a role')
      return
    }

    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    // 2. Save role in profiles table
    const { error: roleError } = await supabase.from('profiles').insert({
      id: data.user.id,
      role: role,
    })

    if (roleError) {
      alert(roleError.message)
      return
    }

    alert('Signup successful. Please login.')
    navigate('/login')
  }

  return (
    <div className="container mt-5 col-md-4">
      <h3 className="mb-3">Create Account</h3>

      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          name="email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          className="form-control mb-2"
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        {/* 🔑 ROLE FIELD — THIS IS WHAT WAS MISSING */}
        <select
          className="form-select mb-3"
          name="role"
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <button className="btn btn-primary w-100">
          Sign Up
        </button>
      </form>
    </div>
  )
}
