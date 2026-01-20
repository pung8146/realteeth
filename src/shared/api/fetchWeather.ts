const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || ''

export interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  coord: {
    lat: number
    lon: number
  }
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('날씨 정보를 가져올 수 없습니다.')
  }
  
  return response.json()
}
