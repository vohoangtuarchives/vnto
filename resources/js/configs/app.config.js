export default {
    APP_API: import.meta.env.VITE_APP_API,
    APP_URL: import.meta.env.VITE_APP_URL,
    APP_UPLOAD: import.meta.env.VITE_APP_UPLOAD,

    APP_LOCALE: import.meta.env.VITE_APP_I18N_LOCALE || 'vi',
    APP_FALLBACK_LOCALE: import.meta.env.FALLBACK_LOCALE | 'vi',
    APP_MAX_CONNECTION_TIME: import.meta.env.VITE_MAX_CONNECTION_TIME || 5000,
}