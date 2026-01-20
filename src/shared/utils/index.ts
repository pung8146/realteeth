// 공통 유틸리티 함수들

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`
}

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
