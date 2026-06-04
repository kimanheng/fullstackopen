import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Custom field hook
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// Custom country API hook (FSO Exercise 7.7)
const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
        setCountry({
          found: true,
          data: {
            name: response.data.name.common,
            capital: response.data.capital[0],
            population: response.data.population,
            flag: response.data.flags.png
          }
        })
      })
      .catch(() => {
        setCountry({ found: false })
      })
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div style={{ marginTop: '10px', color: 'red' }}>
        not found...
      </div>
    )
  }

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', maxWidth: '400px' }}>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`} style={{ marginTop: '10px', border: '1px solid #eee' }} />  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Search Countries (Custom Hooks)</h2>
      <form onSubmit={fetch}>
        <input {...nameInput} placeholder="type country name, e.g. finland" style={{ padding: '8px', width: '250px', marginRight: '10px' }} />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
