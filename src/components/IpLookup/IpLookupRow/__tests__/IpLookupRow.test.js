import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IpLookupRow from '../IpLookupRow.vue'

describe('IpLookupRow', () => {
  const defaultProps = {
    row: {
      ip: '',
      loading: false,
      country: null,
      error: null,
      time: '',
      timeZone: ''
    },
    index: 0
  }

  it('renders with default props', () => {
    const wrapper = mount(IpLookupRow, {
      props: defaultProps
    })
    
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('.spinner').exists()).toBe(false)
    expect(wrapper.find('.result').exists()).toBe(false)
    expect(wrapper.find('.error-message').exists()).toBe(false)
  })

  it('shows loading state', () => {
    const wrapper = mount(IpLookupRow, {
      props: {
        ...defaultProps,
        row: { ...defaultProps.row, loading: true }
      }
    })
    
    expect(wrapper.find('.spinner').exists()).toBe(true)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('shows error state', () => {
    const errorMessage = 'Invalid IP address'
    const wrapper = mount(IpLookupRow, {
      props: {
        ...defaultProps,
        row: { ...defaultProps.row, error: errorMessage }
      }
    })
    
    expect(wrapper.find('.error-message').text()).toBe(errorMessage)
    expect(wrapper.find('input').classes()).toContain('error')
  })

  it('shows result with country and time', () => {
    const wrapper = mount(IpLookupRow, {
      props: {
        ...defaultProps,
        row: {
          ...defaultProps.row,
          country: 'US',
          countryName: 'United States',
          flag: 'https://flagcdn.com/w20/us.png',
          time: '12:00:00'
        }
      }
    })
    
    const result = wrapper.find('.result')
    expect(result.exists()).toBe(true)
    expect(result.find('img').attributes('src')).toBe('https://flagcdn.com/w20/us.png')
    expect(result.find('img').attributes('alt')).toBe('United States')
    expect(result.find('.time').text()).toBe('12:00:00')
  })

  it('emits update:ip event on input', async () => {
    const wrapper = mount(IpLookupRow, {
      props: defaultProps
    })
    
    const input = wrapper.find('input')
    await input.setValue('8.8.8.8')
    
    const emitted = wrapper.emitted('update:ip')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([{ index: 0, value: '8.8.8.8' }])
  })

  it('emits lookup event on blur', async () => {
    const wrapper = mount(IpLookupRow, {
      props: defaultProps
    })
    
    const input = wrapper.find('input')
    await input.trigger('blur')
    
    const emitted = wrapper.emitted('lookup')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([0])
  })

  it('emits lookup event on enter key', async () => {
    const wrapper = mount(IpLookupRow, {
      props: defaultProps
    })
    
    const input = wrapper.find('input')
    await input.trigger('keyup.enter')
    
    const emitted = wrapper.emitted('lookup')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([0])
  })
}) 