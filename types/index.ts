import type { RecaptchaVerifier } from "firebase/auth"

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier
    grecaptcha: any
    widgetId: number
  }
}

window.recaptchaVerifier = window.recaptchaVerifier || {}

export type FileWithPrview = File & {
  path: string
  preview: string
}

export type ValueType<T> = T extends Promise<infer U> ? U : T
