import type {
  CurrentWeatherResponse,
  ForecastResponse,
  ProcessedCurrentWeather,
  ProcessedForecast,
  HourlyForecast,
  GeocodingResponse,
  Coord,
} from './types'
import type { District } from '@entities/district'

const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || ''

/**
 * 현재 날씨 정보를 가져옵니다.
 * @param lat 위도
 * @param lon 경도
 * @returns 현재 날씨 데이터
 */
export const getCurrentWeather = async (
  lat: number,
  lon: number
): Promise<CurrentWeatherResponse> => {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`날씨 정보를 가져올 수 없습니다. (${response.status})`)
  }

  return response.json()
}

/**
 * 5일/3시간 예보 정보를 가져옵니다.
 * @param lat 위도
 * @param lon 경도
 * @returns 5일간 3시간 간격의 날씨 예보 데이터
 */
export const getWeatherForecast = async (
  lat: number,
  lon: number
): Promise<ForecastResponse> => {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`날씨 예보를 가져올 수 없습니다. (${response.status})`)
  }

  return response.json()
}

/**
 * 현재 날씨 응답을 앱에서 사용하기 편한 형태로 가공합니다.
 */
export const processCurrentWeather = (
  data: CurrentWeatherResponse
): ProcessedCurrentWeather => {
  return {
    cityName: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    description: data.weather[0]?.description || '',
    icon: data.weather[0]?.icon || '',
    windSpeed: data.wind.speed,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    dt: data.dt,
    lat: data.coord.lat,
    lon: data.coord.lon,
  }
}

/**
 * 예보 응답을 앱에서 사용하기 편한 형태로 가공합니다.
 */
export const processForecast = (data: ForecastResponse): ProcessedForecast => {
  const hourlyForecasts: HourlyForecast[] = data.list.map((item) => ({
    dt: item.dt,
    dtTxt: item.dt_txt,
    temp: Math.round(item.main.temp),
    tempMin: Math.round(item.main.temp_min),
    tempMax: Math.round(item.main.temp_max),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    description: item.weather[0]?.description || '',
    icon: item.weather[0]?.icon || '',
    pop: Math.round(item.pop * 100), // 백분율로 변환
  }))

  return {
    cityName: data.city.name,
    country: data.city.country,
    hourlyForecasts,
  }
}

/**
 * 행정구역 이름으로 좌표를 검색합니다.
 * @param district 행정구역 객체
 * @returns 좌표 (lat, lon)
 */
export const getCoordsByDistrictName = async (
  district: District
): Promise<Coord> => {
  // 검색 쿼리 생성: "시도 시군구 읍면동" 형태
  const queryParts: string[] = [district.sido]
  if (district.sigungu) queryParts.push(district.sigungu)
  if (district.eupmyeondong) queryParts.push(district.eupmyeondong)
  
  const query = queryParts.join(' ')
  const encodedQuery = encodeURIComponent(query)
  
  const url = `${GEO_URL}/direct?q=${encodedQuery},KR&limit=1&appid=${API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`좌표를 가져올 수 없습니다. (${response.status})`)
  }

  const data: GeocodingResponse[] = await response.json()

  if (data.length === 0) {
    throw new Error(`"${query}"에 대한 좌표를 찾을 수 없습니다.`)
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
  }
}
