import { StorageService } from './StorageService';

export interface Settings {
    language: "en" | "fr";
    showProduct: boolean;
    showList: boolean;
    prefScore: boolean;
    preferences: {
        nutriScore: string;
        novaScore: string;
        ecoScore: string;
        low_fat: string;
        low_salt: string;
        low_sugar: string;
        low_saturated_fat: string;
    };
}

export const defaultSettings: Settings = {
    language: "en",
    showProduct: true,
    showList: true,
    prefScore: true,
    preferences: {
        nutriScore: "not_important",
        novaScore: "not_important",
        ecoScore: "not_important",
        low_fat: "not_important",
        low_salt: "not_important",
        low_sugar: "not_important",
        low_saturated_fat: "not_important"
    }
};

export class SettingsService {
    private static instance: SettingsService;
    private StorageService = new StorageService();
    private defaultSettings = defaultSettings;

    constructor() {}
    
    public static getInstance(): SettingsService {
        if (!SettingsService.instance) {
            SettingsService.instance = new SettingsService();
        }
        return SettingsService.instance;
    }

    public static async init() {
        const instance = this.getInstance();
        const current = await instance.get();
        if (!current) {
            await instance.set(instance.defaultSettings);
            return instance.defaultSettings;
        }
        return current;
    }
    
    public async get() {
        return await this.StorageService.get('settings') as Settings | null;
    }
    
    public async set(settings: Settings) {
        await this.StorageService.set('settings', settings);
    }
}
