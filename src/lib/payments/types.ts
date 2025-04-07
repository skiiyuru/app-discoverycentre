type GlobalThis = typeof globalThis

type CustomGlobalThis = {
  [key: string]: ReadableStreamDefaultController | undefined
} & GlobalThis

export const typedGlobalThis = globalThis as CustomGlobalThis
