/// <reference types="vite/client">

declare namespace NodeJS {
  interface ProcessEnv {
    TAURI_DEBUG?: string
  }
}

interface ImportMetaEnv {
  TAURI_DEBUG?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
