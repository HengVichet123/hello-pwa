import { useEffect, useState } from 'react'

// Open-Meteo: free weather API, no key needed. Toyohashi coordinates.
const API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=34.77&longitude=137.39&current=temperature_2m,wind_speed_10m&timezone=Asia%2FTokyo'

type Weather = {
  current: { time: string; temperature_2m: number; wind_speed_10m: number }
}

export default function App() {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`API answered ${res.status}`)
      setWeather(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <main>
      <h1>Hello PWA</h1>
      <h2>Toyohashi weather (live from an API)</h2>
      {error && <p className="error">Could not reach the API: {error}</p>}
      {weather && (
        <div className="card">
          <p className="temp">{weather.current.temperature_2m}°C</p>
          <p>Wind {weather.current.wind_speed_10m} km/h</p>
          <p className="muted">Updated {weather.current.time.replace('T', ' ')}</p>
        </div>
      )}
      <button onClick={load} disabled={loading}>
        {loading ? 'Asking the API…' : 'Refresh'}
      </button>
    </main>
  )
}
