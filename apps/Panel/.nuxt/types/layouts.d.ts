import type { ComputedRef, MaybeRef } from 'vue'

type ComponentProps<T> = T extends new(...args: any) => { $props: infer P } ? NonNullable<P>
  : T extends (props: infer P, ...args: any) => any ? P
  : {}

declare module 'nuxt/app' {
  interface NuxtLayouts {
    dashboard: ComponentProps<typeof import("C:/Users/jorge/OneDrive/Desktop/Pro/Ivent_app/apps/Panel/app/layouts/dashboard.vue").default>
    default: ComponentProps<typeof import("C:/Users/jorge/OneDrive/Desktop/Pro/Ivent_app/apps/Panel/app/layouts/default.vue").default>
    web: ComponentProps<typeof import("C:/Users/jorge/OneDrive/Desktop/Pro/Ivent_app/apps/Panel/app/layouts/web.vue").default>
  }
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false> | {
      [K in LayoutKey]: {
        name?: MaybeRef<K | false> | ComputedRef<K | false>
        props?: NuxtLayouts[K]
      }
    }[LayoutKey]
  }
}