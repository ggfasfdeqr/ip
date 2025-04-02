<template>
  <div class="ip-lookup">
    <div class="header">
      <h1>IP Lookup</h1>
      <button class="close-button" @click="$emit('close')">×</button>
    </div>
    
    <p class="description">Enter one or more IP addresses and get their country</p>
    
    <button class="add-button" @click="addRow">
      + Add
    </button>

    <div class="ip-rows">
      <IpLookupRow
        v-for="(row, index) in rows"
        :key="index"
        :row="row"
        :index="index"
        @update:ip="updateIp"
        @lookup="lookupIp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import IpLookupRow from './IpLookupRow/IpLookupRow.vue'
import { useIpLookup } from '@/composables/useIpLookup'
import './styles.css'

const { rows, timers, addRow, updateIp, lookupIp } = useIpLookup()

// Expose variables to template
defineExpose({
  rows,
  addRow,
  updateIp,
  lookupIp
})

onMounted(() => {
  // Clear any existing timers
  timers.value.forEach(timer => clearInterval(timer))
  timers.value = []
})

onUnmounted(() => {
  // Clean up timers
  timers.value.forEach(timer => clearInterval(timer))
})
</script> 