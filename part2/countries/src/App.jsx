import { useState, useEffect } from 'react'
import Weather from './services/Weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => response.json())
      .then(data => setCountries(data))
  }, [])

  useEffect(() => {
    if (search) {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredCountries(filtered)
    } else {
      setFilteredCountries([])
    }
  }, [search, countries])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const showCountry = (country) => {
    setFilteredCountries([country])
  }

  if (filteredCountries.length > 10) {
    return (
      <div className="app-container">
        <div className="search-section">
          <span className="search-label">find countries</span>
          <input value={search} onChange={handleSearchChange} />
        </div>
        <div className="too-many-matches">Too many matches, specify another filter</div>
      </div>
    )
  }

  if (filteredCountries.length > 1) {
    return (
      <div className="app-container">
        <div className="search-section">
          <span className="search-label">find countries</span>
          <input value={search} onChange={handleSearchChange} />
        </div>
        <div className="countries-list">
          {filteredCountries.map(country => (
            <div key={country.name.common} className="country-item">
              <span className="country-name">{country.name.common}</span>
              <button onClick={() => showCountry(country)}>show</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    return (
      <div className="app-container">
        <div className="search-section">
          <span className="search-label">find countries</span>
          <input value={search} onChange={handleSearchChange} />
        </div>
        <div className="country-details">
          <h1>{country.name.common}</h1>
          <p>capital {country.capital?.[0]}</p>
          <p>area {country.area}</p>
          <h3>languages:</h3>
          <ul>
            {Object.values(country.languages || {}).map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img 
            src={country.flags.png} 
            alt={`flag of ${country.name.common}`} 
            width="200" 
            className="flag-image"
          />
          <Weather capital={country.capital?.[0]} country={country.name.common} />
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="search-section">
        <span className="search-label">find countries</span>
        <input value={search} onChange={handleSearchChange} />
      </div>
    </div>
  )
}

export default App