/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MODE?: 'development' | 'production';
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_MESSAGING_API_KEY?: string;
  readonly VITE_SMS_API_ENDPOINT?: string;
  readonly VITE_WHATSAPP_API_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
