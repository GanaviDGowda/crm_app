import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function AddCustomer() {
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return navigate('/login')

    const { error } = await supabase.from('customers').insert({
      user_id: user.id,
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      status: e.target.status.value,
      notes: e.target.notes.value,
    })

    if (error) {
      alert(error.message)
      return
    }

    navigate('/customers')
  }

  return (
    <div className="container mt-5 col-md-6">
      <div className="card">
        <div className="card-body">
          <h4>Add Customer</h4>

          <form onSubmit={submit}>
            <input className="form-control mb-2" name="name" placeholder="Name" required />
            <input className="form-control mb-2" name="email" placeholder="Email" />
            <input className="form-control mb-2" name="phone" placeholder="Phone" />

            <select className="form-select mb-2" name="status">
              <option>Lead</option>
              <option>Active</option>
              <option>Closed</option>
            </select>

            <textarea className="form-control mb-3" name="notes" placeholder="Notes" />

            <button className="btn btn-primary w-100">Save Customer</button>
          </form>
        </div>
      </div>
    </div>
  )
}
