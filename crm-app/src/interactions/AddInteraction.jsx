import { supabase } from '../supabase'
import { useEffect, useState } from 'react'

export default function InteractionPanel({ customerId }) {
  const [showForm, setShowForm] = useState(false)
  const [interactions, setInteractions] = useState([])

  useEffect(() => {
    loadInteractions()
  }, [])

  const loadInteractions = async () => {
    const { data } = await supabase
      .from('interactions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })

    setInteractions(data || [])
  }

  const saveInteraction = async (e) => {
    e.preventDefault()

    await supabase.from('interactions').insert({
      customer_id: customerId,
      type: e.target.type.value,
      note: e.target.note.value,
      follow_up_date: e.target.follow.value || null,
    })

    e.target.reset()
    setShowForm(false)
    loadInteractions()
  }

  return (
    <div className="interaction-box mt-3">
      <button
        className="btn btn-sm btn-outline-primary mb-2"
        onClick={() => setShowForm(!showForm)}
      >
        + Add Interaction
      </button>

      {/* ADD INTERACTION FORM */}
      {showForm && (
        <form onSubmit={saveInteraction} className="mb-3">
          <select className="form-select mb-2" name="type" required>
            <option value="">Interaction Type</option>
            <option>Call</option>
            <option>Email</option>
            <option>Meeting</option>
          </select>

          <input
            type="date"
            className="form-control mb-2"
            name="follow"
          />

          <textarea
            className="form-control mb-2"
            name="note"
            placeholder="Interaction notes"
            required
          />

          <button className="btn btn-sm btn-success">
            Save Interaction
          </button>
        </form>
      )}

      {/* 📜 INTERACTION HISTORY */}
      <div>
        <strong className="small">Interaction History</strong>

        {interactions.length === 0 && (
          <p className="text-muted small mb-0">
            No interactions logged yet.
          </p>
        )}

        {interactions.map(i => (
          <div
            key={i.id}
            className="border rounded p-2 mt-2 bg-light"
          >
            <div className="d-flex justify-content-between">
              <span className="badge bg-info text-dark">
                {i.type}
              </span>
              <span className="text-muted small">
                {new Date(i.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="small mt-1">
              {i.note}
            </div>

            {i.follow_up_date && (
              <div className="small text-warning mt-1">
                Follow-up: {i.follow_up_date}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
