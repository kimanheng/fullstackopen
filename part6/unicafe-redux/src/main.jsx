import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducer'

const store = createStore(counterReducer)

const App = () => {
  const good = () => {
    store.dispatch({ type: 'GOOD' })
  }

  const ok = () => {
    store.dispatch({ type: 'OK' })
  }

  const bad = () => {
    store.dispatch({ type: 'BAD' })
  }

  const zero = () => {
    store.dispatch({ type: 'ZERO' })
  }

  const state = store.getState()
  const total = state.good + state.ok + state.bad

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Unicafe Feedback (Redux)</h2>
      <button onClick={good}>good</button> 
      <button onClick={ok}>ok</button> 
      <button onClick={bad}>bad</button>
      <button onClick={zero}>reset stats</button>
      <div>good {state.good}</div>
      <div>ok {state.ok}</div>
      <div>bad {state.bad}</div>
      {total > 0 && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <div>all {total}</div>
          <div>average {(state.good - state.bad) / total}</div>
          <div>positive {(state.good / total) * 100} %</div>
        </div>
      )}
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
