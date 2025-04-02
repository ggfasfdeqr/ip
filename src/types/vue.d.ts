import 'vue'

declare module 'vue' {
  export interface ComponentCustomProperties {
    $refs: {
      [key: string]: HTMLElement | any
    }
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
} 