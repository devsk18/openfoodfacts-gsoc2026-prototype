import { defaultSettings } from "../services/SettingsService";
import { en } from "./locales/en";
import { fr } from "./locales/fr";

type Locale = "en" | "fr";

export class I18n {
    private static currentLocale = defaultSettings.language;
    private static locale = { en, fr };

    static init(locale: Locale) {
        if (!this.locale[locale]) {
            console.error(`Locale ${locale} not found`);
            locale = defaultSettings.language;
        }
        this.currentLocale = locale;
    }

    static t(key: string) {
        const locale = this.locale[this.currentLocale];
        return locale?.[key as keyof typeof locale] ?? key;
    }
}