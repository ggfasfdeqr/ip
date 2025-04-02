import 'vue'

declare module 'vue' {
  export interface ComponentCustomProperties {
    $refs: {
      [key: string]: HTMLElement | unknown
    }
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
} 