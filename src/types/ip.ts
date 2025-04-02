export interface IpRow {
  ip: string
  loading: boolean
  country: string | null
  countryName?: string
  flag?: string
  error: string | null
  time: string
  timeZone: string
}

export interface IpApiResponse {
  countryCode: string
  countryName: string
  timezone: string
}

export interface IpUpdateEvent {
  index: number
  value: string
} 