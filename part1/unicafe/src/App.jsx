import { useState } from 'react'

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad

  if (props.good + props.neutral + props.bad === 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <p>No feedback given</p>
      </div>
    )
  } else {
    return (
      <div>
        <h2>Statistics</h2>
        <table>
          <tbody>
            <StatisticLine text="good" value={props.good}/>
            <StatisticLine text="neutral" value={props.neutral}/>
            <StatisticLine text="bad" value={props.bad}/>
            <StatisticLine text="all" value={all}/>
            <StatisticLine text="average" value={(props.good*1 + props.bad*(-1))/all}/>
            <StatisticLine text="positive" value={props.good*100/all + " %"} />
          </tbody>
        </table>
      </div>
    )
  }
}
  

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Feedback for Unicafe</h1>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App