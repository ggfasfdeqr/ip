import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import IpLookup from '../IpLookup.vue'
import { useIpLookup } from '@/composables/useIpLookup'

vi.mock('@/composables/useIpLookup')

describe('IpLookup', () => {
  const mockRows = [
    {
      ip: '8.8.8.8',
      loading: false,
      country: 'US',
      error: null,
      time: '12:00:00',
      timeZone: 'America/New_York'
    }
  ]

  const mockComposable = {
    rows: ref(mockRows),
    timers: ref([]),
    addRow: vi.fn(),
    updateIp: vi.fn(),
    lookupIp: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useIpLookup).mockReturnValue(mockComposable)
  })

  it('renders the component', () => {
    const wrapper = mount(IpLookup)
    
    expect(wrapper.find('.ip-lookup').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('IP Lookup')
    expect(wrapper.find('.description').text()).toBe('Enter one or more IP addresses and get their country')
    expect(wrapper.find('.add-button').text()).toBe('+ Add')
  })

  it('renders IpLookupRow components', () => {
    const wrapper = mount(IpLookup)
    
    const rows = wrapper.findAllComponents({ name: 'IpLookupRow' })
    expect(rows).toHaveLength(1)
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(IpLookup)
    
    await wrapper.find('.close-button').trigger('click')
    
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('calls addRow when add button is clicked', async () => {
    const wrapper = mount(IpLookup)
    
    await wrapper.find('.add-button').trigger('click')
    
    expect(mockComposable.addRow).toHaveBeenCalled()
  })

  it('passes correct props to IpLookupRow', () => {
    const wrapper = mount(IpLookup)
    
    const row = wrapper.findComponent({ name: 'IpLookupRow' })
    expect(row.props('row')).toEqual(mockRows[0])
    expect(row.props('index')).toBe(0)
  })

  it('handles update:ip event from IpLookupRow', async () => {
    const wrapper = mount(IpLookup)
    
    const row = wrapper.findComponent({ name: 'IpLookupRow' })
    await row.vm.$emit('update:ip', { index: 0, value: '1.1.1.1' })
    
    expect(mockComposable.updateIp).toHaveBeenCalledWith({ index: 0, value: '1.1.1.1' })
  })

  it('handles lookup event from IpLookupRow', async () => {
    const wrapper = mount(IpLookup)
    
    const row = wrapper.findComponent({ name: 'IpLookupRow' })
    await row.vm.$emit('lookup', 0)
    
    expect(mockComposable.lookupIp).toHaveBeenCalledWith(0)
  })
}) 