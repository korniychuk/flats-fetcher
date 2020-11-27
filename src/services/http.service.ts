import { AnyObject } from '../types';
import { assertNil } from '../assertions';

export class HttpService {

    public fetchHtml(url: string, errorMsg = `Can't fetch URL as HTML: ${ url }`): cheerio.Root {
        const htmlStr = this.fetchAsTex(url);

        if (!htmlStr?.trim()) throw new Error(`HttpService: ${ errorMsg }`);

        return Cheerio.load(htmlStr);
    }

    public fetchJSON<T = AnyObject>(url: string, errorMsg = `Can't fetch URL as JSON: ${ url }`): T[] {
        const text = this.fetchAsTex(url);

        const data = JSON.parse(text).results;
        assertNil(data, `HttpService: ${ errorMsg }`);

        return data;
    }

    private fetchAsTex(url: string): string {
        const cache = CacheService.getDocumentCache();
        const cacheKey = `GET:${ url }`;
        const cachedData = cache?.get(cacheKey);
        if (cachedData) return cachedData;

        const response = UrlFetchApp.fetch(url);
        const data = response.getContentText();
        cache?.put(cacheKey, data, 60 * 15);

        return data
    }
}
