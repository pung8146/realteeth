// 1. 실제 API 함수들 export
export {
  getCurrentWeather,
  getWeatherForecast,
  processCurrentWeather,
  processForecast,
} from './weather'

// 2. 타입들 export
export type {
  CurrentWeatherResponse,
  ForecastResponse,
  ProcessedCurrentWeather,
  HourlyForecast,
  ProcessedForecast,
  Coord, 
} from './types'
