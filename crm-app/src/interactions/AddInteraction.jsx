import { supabase } from '../supabase'
import { useEffect, useState } from 'react'

export default function InteractionPanel({ customerId }) {
  const [interactions, setInteractions] = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadInteractions()

    const channel = supabase
      .channel(`interactions-${customerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'interactions',
          filter: `customer_id=eq.${customerId}`,
        },
        payload => {
          loadInteractions()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [customerId])

  const loadInteractions = async () => {
    const { data } = await supabase
      .from('interactions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })

    setInteractions(data || [])
  }

  const saveInteraction = async e => {
    e.preventDefault()

    await supabase.from('interactions').insert({
      customer_id: customerId,
      type: e.target.type.value,
      note: e.target.note.value,
      follow_up_date: e.target.follow.value || null,
    })

    e.target.reset()
    setShowForm(false)
  }

  return (
    <div className="mt-3">
      <button
        className="btn btn-sm btn-outline-primary mb-2"
        onClick={() => setShowForm(!showForm)}
      >
        + Add Interaction
      </button>

      {showForm && (
        <form onSubmit={saveInteraction} className="mb-2">
          <select name="type" className="form-select mb-2" required>
            <option value="">Interaction Type</option>
            <option>Call</option>
            <option>Email</option>
            <option>Meeting</option>
          </select>

          <input type="date" name="follow" className="form-control mb-2" />

          <textarea
            name="note"
            className="form-control mb-2"
            placeholder="Notes"
            required
          />

          <button className="btn btn-success btn-sm">Save</button>
        </form>
      )}

      <strong className="small">Interaction History</strong>

      {interactions.length === 0 && (
        <p className="text-muted small">No interactions yet.</p>
      )}

      {interactions.map(i => (
        <div key={i.id} className="border rounded p-2 mt-2 bg-light">
          <span className="badge bg-info text-dark">{i.type}</span>
          <div className="small mt-1">{i.note}</div>
          {i.follow_up_date && (
            <div className="small text-warning">
              Follow-up: {i.follow_up_date}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
