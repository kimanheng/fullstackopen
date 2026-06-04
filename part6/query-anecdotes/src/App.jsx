import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  // Mutation for updating votes
  const updateVoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      // Invalidate the cache to fetch updated list
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET', payload: `anecdote '${updatedAnecdote.content}' voted` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    updateVoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  }

  // Fetch anecdotes using React Query
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#f87171' }}>
        <h3>anecdote service not available due to problems in server</h3>
      </div>
    )
  }

  const anecdotes = result.data.sort((a, b) => b.votes - a.votes)

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'system-ui, sans-serif', padding: '0 20px', color: '#f8fafc', backgroundColor: '#0f172a', minHeight: '80vh', borderRadius: '8px', paddingBlock: '20px' }}>
      <h2>Anecdotes (React Query & Context)</h2>
      <Notification />
      <AnecdoteForm />
    
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
    </div>
  )
}

export default App
