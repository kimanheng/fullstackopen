import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const filter = state.filter.toLowerCase()
    return state.anecdotes
      .filter(anecdote => anecdote.content.toLowerCase().includes(filter))
      .sort((a, b) => b.votes - a.votes)
  })
  
  const dispatch = useDispatch()

  const handleVote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div style={{ marginTop: '20px' }}>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id} style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
          <div>{anecdote.content}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>has {anecdote.votes} votes</span>
            <button 
              onClick={() => handleVote(anecdote)}
              style={{ backgroundColor: '#475569', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
