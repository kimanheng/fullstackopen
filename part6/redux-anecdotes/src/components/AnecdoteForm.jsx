import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const add = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
    dispatch(setNotification(`you created '${content}'`, 5))
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>create new</h3>
      <form onSubmit={add}>
        <div>
          <input name="anecdote" placeholder="Write custom anecdote..." required />
        </div>
        <button type="submit" style={{ backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          create
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm
