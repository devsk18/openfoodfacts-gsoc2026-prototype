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
                return cachedData;
            }
        }

        let data: any = null;
        if (this.request.barcode) {
            data = await this.fetchByBarcode(this.request.barcode, this.locale);
        }

        else if (this.request.name) {
            // move to adapter - bcoz walmart product name is already a combined version 
            const query = `${this.request.brand} ${this.request.name} ${this.request.size}`.trim();
            data = await this.fetchBySearch(query, this.locale);  
        }

        if (data && cacheKey) {
            this.storageService.setCache(cacheKey, data);
            return data;
        }

        if (data) {
            return data;
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