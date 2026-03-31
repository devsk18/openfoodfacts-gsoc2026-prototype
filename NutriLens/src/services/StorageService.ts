import { CacheData } from "../lib/types";

export class StorageService {
    readonly CACHE_EXPIRY = 3 * 24 * 60 * 60 * 1000; // 3 days

    async get(key: string) {
        const data = await storage.getItem(`local:${key}`);
        return data;
    }

    async set(key: string, value: any) {
        await storage.setItem(`local:${key}`, value);
    }

    async remove(key: string) {
        await storage.removeItem(`local:${key}`);
    }

    async getCache(key: string) {
        const cacheData = await this.get(key) as CacheData;
        if (!cacheData) {
            return null;
        }

        if (Date.now() > cacheData.expiresAt) {
            this.remove(key);
            return null;
        }
        
        return cacheData.data;
    }

    async setCache(key: string, value: any) {
        const cacheData: CacheData = {
            data: value,
            expiresAt: Date.now() + this.CACHE_EXPIRY,
        };
        await this.set(key, cacheData);
    }
}


// TODO: better change to singleton 