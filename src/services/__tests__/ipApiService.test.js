import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ipApiService } from '../ipApiService'
import axios from 'axios'

vi.mock('axios')

describe('ipApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches IP data successfully', async () => {
    const mockResponse = {
      data: {
        country_code: 'US',
        country_name: 'United States',
        timezone: 'America/New_York'
      }
    }

    vi.mocked(axios.get).mockResolvedValueOnce(mockResponse)

    const result = await ipApiService.lookupIp('8.8.8.8')

    expect(result).toEqual({
      countryCode: 'US',
      countryName: 'United States',
      timezone: 'America/New_York'
    })
    expect(axios.get).toHaveBeenCalledWith('https://ipapi.co/8.8.8.8/json/')
  })

  it('handles API error', async () => {
    const mockError = {
      data: {
        error: true,
        reason: 'Invalid IP Address'
      }
    }

    vi.mocked(axios.get).mockResolvedValueOnce(mockError)

    await expect(ipApiService.lookupIp('invalid-ip')).rejects.toThrow('Invalid IP Address')
  })

  it('handles network error', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

    await expect(ipApiService.lookupIp('8.8.8.8')).rejects.toThrow('Network error')
  })
}) 