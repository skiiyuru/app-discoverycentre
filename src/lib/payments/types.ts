type CustomGlobalThis = {
  [key: string]: ReadableStreamDefaultController | undefined
} & typeof globalThis

export const typedGlobalThis = globalThis as CustomGlobalThis
