interface ImportMetaEnv {
  readonly RSBUILD_ENTRY_URL: string; // RSBUILD_ENTRY_URL 타입을 정의
  readonly RSBUILD_SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
