import axios from 'axios'
import { IpApiResponse } from '@/types/ip'

export class IpApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = 'https://ipapi.co'
  }

  async lookupIp(ip: string): Promise<IpApiResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/${ip}/json/`)
      
      if (response.data.error) {
        throw new Error(response.data.reason || 'Failed to lookup IP')
      }

      return {
        countryCode: response.data.country_code,
        countryName: response.data.country_name,
        timezone: response.data.timezone
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to lookup IP')
      }
      throw new Error('Failed to lookup IP')
    }
  }
}

export const ipApiService = new IpApiService() 