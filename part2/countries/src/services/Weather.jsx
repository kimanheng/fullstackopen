import { useState, useEffect } from 'react'

const Weather = ({ capital, country }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    if (capital && apiKey) {
      setLoading(true)
      setError(null)
      
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Weather data not found')
          }
          return response.json()
        })
        .then(data => {
          setWeather(data)
          setLoading(false)
        })
        .catch(error => {
          setError(error.message)
          setLoading(false)
        })
    }
  }, [capital, apiKey])

  if (!apiKey) {
    return <div>Weather API key not configured</div>
  }

  if (loading) {
    return <div>Loading weather data...</div>
  }

  if (error) {
    return <div>Error loading weather: {error}</div>
  }

  if (!weather) {
    return <div>No weather data available</div>
  }

  return (
    <div className="weather-section">
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp}°C</p>
      <img 
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
        width="100"
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
