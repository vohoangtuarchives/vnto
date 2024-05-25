import { createI18n } from 'vue-i18n';
import appConfig from "@/configs/app.config";
/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */

function loadLocaleMessages() {

  const locales = import.meta.glob('./lang/*.json', {
    eager: true
  });

  const messages = {};

  for (const key in locales) {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales[key].default;
    }
  }
  console.log(messages);
  return messages;
}

const setDateTimeFormats = {
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  long: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
  },
};

const dateTimeFormats = {
  en: setDateTimeFormats,
  es: setDateTimeFormats,
  de: setDateTimeFormats,
  'en-GB': setDateTimeFormats,
};

export default createI18n({
  locale: appConfig.APP_LOCALE,
  fallbackLocale: appConfig.APP_FALLBACK_LOCALE,
  messages: loadLocaleMessages(),
  dateTimeFormats,
});