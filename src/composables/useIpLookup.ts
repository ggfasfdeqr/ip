import { ref } from 'vue'
import { ipApiService } from '@/services/ipApiService'
import { IpRow, IpUpdateEvent } from '@/types/ip'

const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

export function useIpLookup() {
  const rows = ref<IpRow[]>([{ ip: '', loading: false, country: null, error: null, time: '', timeZone: '' }])
  const timers = ref<NodeJS.Timeout[]>([])

  const addRow = (): void => {
    rows.value.push({ ip: '', loading: false, country: null, error: null, time: '', timeZone: '' })
  }

  const updateIp = ({ index, value }: IpUpdateEvent): void => {
    rows.value[index].ip = value
  }

  const updateTime = (index: number): void => {
    if (!rows.value[index].timeZone) return
    
    const time = new Date().toLocaleTimeString('en-US', {
      timeZone: rows.value[index].timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    rows.value[index].time = time
  }

  const lookupIp = async (index: number): Promise<void> => {
    const row = rows.value[index]
    if (!row.ip || row.loading) return
    
    // Clear previous error and results
    row.error = null
    row.country = null
    row.time = ''
    
    // Validate IP format
    if (!ipRegex.test(row.ip)) {
      row.error = 'Invalid IP address format'
      return
    }
    
    row.loading = true
    
    try {
      const result = await ipApiService.lookupIp(row.ip)
      
      row.country = result.countryCode
      row.countryName = result.countryName
      row.flag = `https://flagcdn.com/w20/${result.countryCode.toLowerCase()}.png`
      row.timeZone = result.timezone
      
      // Start updating time
      updateTime(index)
      const timer = setInterval(() => updateTime(index), 1000)
      timers.value[index] = timer
      
    } catch (error) {
      if (error instanceof Error) {
        row.error = error.message
      } else {
        row.error = 'An unknown error occurred'
      }
    } finally {
      row.loading = false
    }
  }

  return {
    rows,
    timers,
    addRow,
    updateIp,
    lookupIp
  }
} 