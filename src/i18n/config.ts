export const locales = ['it', 'en', 'ar', 'fr', 'es', 'de', 'pt', 'ro', 'uk', 'pl', 'sq', 'zh', 'hi', 'bn', 'tl', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'it'
