import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      // Invalidate the cache to fetch updated list
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET', payload: `anecdote '${newAnecdote.content}' created` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    },
    onError: (error) => {
      dispatch({ type: 'SET', payload: `error: ${error.message}` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    if (content.length < 5) {
      dispatch({ type: 'SET', payload: 'too short anecdote, must have length 5 or more' })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
      return
    }

    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' placeholder="Write custom anecdote..." required />
        <button type="submit" style={{ marginLeft: '10px', backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          create
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm
