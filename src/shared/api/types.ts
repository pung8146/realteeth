/**
 * OpenWeatherMap API 응답 타입 정의
 */

// 공통 타입
export interface Coord {
  lat: number
  lon: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level?: number
  grnd_level?: number
}

export interface Wind {
  speed: number
  deg: number
  gust?: number
}

export interface Clouds {
  all: number
}

export interface Sys {
  type?: number
  id?: number
  country: string
  sunrise: number
  sunset: number
}

// 현재 날씨 API 응답 타입
export interface CurrentWeatherResponse {
  coord: Coord
  weather: Weather[]
  base: string
  main: Main
  visibility: number
  wind: Wind
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

// 5일/3시간 예보 API 응답 타입
export interface ForecastCity {
  id: number
  name: string
  coord: Coord
  country: string
  population: number
  timezone: number
  sunrise: number
  sunset: number
}

export interface ForecastItem {
  dt: number
  main: Main
  weather: Weather[]
  clouds: Clouds
  wind: Wind
  visibility: number
  pop: number // 강수 확률
  rain?: {
    '3h': number
  }
  snow?: {
    '3h': number
  }
  sys: {
    pod: string // 'd' = day, 'n' = night
  }
  dt_txt: string // "2024-01-21 12:00:00" 형식
}

export interface ForecastResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: ForecastCity
}

// 앱에서 사용하기 편한 가공된 타입들
export interface ProcessedCurrentWeather {
  cityName: string
  country: string
  temp: number
  tempMin: number
  tempMax: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  windSpeed: number
  sunrise: number
  sunset: number
  dt: number
  lat: number;
  lon: number;
}

export interface HourlyForecast {
  dt: number
  dtTxt: string
  temp: number
  tempMin: number
  tempMax: number
  feelsLike: number
  humidity: number
  description: string
  icon: string
  pop: number // 강수 확률
}

export interface ProcessedForecast {
  cityName: string
  country: string
  hourlyForecasts: HourlyForecast[]
}

// Geocoding API 응답 타입
export interface GeocodingResponse {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}
