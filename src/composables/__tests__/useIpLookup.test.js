import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useIpLookup } from '../useIpLookup'
import { ipApiService } from '@/services/ipApiService'

vi.mock('@/services/ipApiService')

describe('useIpLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    // Set fixed time in UTC
    vi.setSystemTime(new Date('2024-01-01T17:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with one empty row', () => {
    const { rows } = useIpLookup()
    expect(rows.value).toHaveLength(1)
    expect(rows.value[0]).toEqual({
      ip: '',
      loading: false,
      country: null,
      error: null,
      time: '',
      timeZone: ''
    })
  })

  it('should add a new row', () => {
    const { rows, addRow } = useIpLookup()
    addRow()
    expect(rows.value).toHaveLength(2)
    expect(rows.value[1]).toEqual({
      ip: '',
      loading: false,
      country: null,
      error: null,
      time: '',
      timeZone: ''
    })
  })

  it('should update IP address', () => {
    const { rows, updateIp } = useIpLookup()
    updateIp({ index: 0, value: '8.8.8.8' })
    expect(rows.value[0].ip).toBe('8.8.8.8')
  })

  it('should validate IP format', async () => {
    const { rows, lookupIp } = useIpLookup()
    rows.value[0].ip = 'invalid'
    
    await lookupIp(0)
    expect(rows.value[0].error).toBe('Invalid IP address format')
  })

  it('should successfully lookup IP', async () => {
    const mockResponse = {
      countryCode: 'US',
      countryName: 'United States',
      timezone: 'America/New_York'
    }
    vi.mocked(ipApiService.lookupIp).mockResolvedValueOnce(mockResponse)

    const { rows, lookupIp } = useIpLookup()
    rows.value[0].ip = '8.8.8.8'
    
    await lookupIp(0)
    
    expect(rows.value[0].country).toBe('US')
    expect(rows.value[0].countryName).toBe('United States')
    expect(rows.value[0].flag).toBe('https://flagcdn.com/w20/us.png')
    expect(rows.value[0].timeZone).toBe('America/New_York')
    expect(rows.value[0].error).toBeNull()
  })

  it('should handle lookup errors', async () => {
    vi.mocked(ipApiService.lookupIp).mockRejectedValueOnce(new Error('API Error'))

    const { rows, lookupIp } = useIpLookup()
    rows.value[0].ip = '8.8.8.8'
    
    await lookupIp(0)
    
    expect(rows.value[0].error).toBe('API Error')
    expect(rows.value[0].country).toBeNull()
  })

  it('should update time every second', async () => {
    const mockResponse = {
      countryCode: 'US',
      countryName: 'United States',
      timezone: 'America/New_York'
    }
    vi.mocked(ipApiService.lookupIp).mockResolvedValueOnce(mockResponse)

    const { rows, lookupIp } = useIpLookup()
    rows.value[0].ip = '8.8.8.8'
    
    await lookupIp(0)
    
    // Initial time update (UTC 17:00:00 = EST 12:00:00)
    expect(rows.value[0].time).toBe('12:00:00')
    
    // Advance time by 1 second
    vi.advanceTimersByTime(1000)
    expect(rows.value[0].time).toBe('12:00:01')
  })
}) 