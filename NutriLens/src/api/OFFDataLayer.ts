import { calculatePreferenceScore } from "../lib/PreferenceScore";
import { StorageService } from "../services/StorageService";
import { OFF_API } from "./OFF_API";

export class OFFDataLayer extends OFF_API {
    private storageService = new StorageService();
    private locale: string = 'en';

    constructor(private request: any) {
        super();
    }

    async fetch() {
        const cacheKey = this.getCacheKey();
        if (cacheKey) {
            const cachedData = await this.storageService.getCache(cacheKey);
            if (cachedData) {
                const prefResult = await calculatePreferenceScore(cachedData);
                return {
                    ...cachedData,
                    preferenceScore: prefResult.percentage,
                    preferenceLabel: prefResult.label,
                    preferenceColor: prefResult.color,
                };
            }
        }

        let data: any = null;
        if (this.request.barcode) {
            data = await this.fetchByBarcode(this.request.barcode, this.locale);
        }

        else if (this.request.query) {
            // move to adapter - bcoz walmart product name is already a combined version 
            data = await this.fetchBySearch(this.request.query, this.locale);  
        }

        if (data && cacheKey) {
            this.storageService.setCache(cacheKey, data);
        }

        if (data) {
            const prefResult = await calculatePreferenceScore(data);
            console.log(data, prefResult);
            return {
                ...data,
                preferenceScore: prefResult.percentage,
                preferenceLabel: prefResult.label,
                preferenceColor: prefResult.color,
            };
        }

        return null;
    }

    private getCacheKey(): string | null {
        if (this.request.barcode) {
            return `product_${this.request.barcode}_${this.locale}`;
        }

        return null;
    }
}