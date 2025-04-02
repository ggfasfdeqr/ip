<template>
  <div class="ip-row">
    <span class="row-number">{{ index + 1 }}</span>
    <div class="input-wrapper">
      <input
        :value="row.ip"
        :disabled="row.loading"
        @input="$emit('update:ip', { index, value: ($event.target as HTMLInputElement).value })"
        @blur="$emit('lookup', index)"
        @keyup.enter="$emit('lookup', index)"
        placeholder="Enter IP address"
        :class="{ error: row.error }"
      />
      <div v-if="row.loading" class="spinner"></div>
      <div v-if="row.country" class="result">
        <img :src="row.flag" :alt="row.countryName" class="flag" />
        <span class="time">{{ row.time }}</span>
      </div>
    </div>
    <div v-if="row.error" class="error-message">{{ row.error }}</div>
  </div>
</template>

<script setup lang="ts">
import { IpRow } from '@/types/ip'
import './styles.css'

const props = defineProps<{
  row: IpRow
  index: number
}>()

const emit = defineEmits<{
  'update:ip': [{ index: number, value: string }]
  'lookup': [index: number]
}>()

// Expose props and emit to template
defineExpose({
  props,
  emit
})
</script> 