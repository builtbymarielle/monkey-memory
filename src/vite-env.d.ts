/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PASSWORD_RESET_REDIRECT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
