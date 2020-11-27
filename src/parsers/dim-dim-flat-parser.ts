import {
    AnyObject,
    Flat,
    FlatParser,
} from '../types';
import { assertNil } from '../assertions';

export class DimDimFlatParser implements FlatParser {
    private urlRegExp = /\/dimdim\.ua\/rent\/apartment\/(?<id>\d+)/;

    public is(url: string): boolean {
        return this.urlRegExp.test(url);
    }

    public parse(url: string): Flat {
        const flatId = this.retrieveFlatIdFromUrl(url);
        const res = this.fetch(flatId);

        return {
            address: res.address_raw,
            complex: '',
            coordinates: '',
            description: '',
            id: 0,
            images: [],
            info: '',
            link: '',
            price: '',
            rooms: 0
        };
    }

    private retrieveFlatIdFromUrl(url: string): number {
        const id = url.match(this.urlRegExp)?.groups?.id;
        assertNil(id, `DimDim: Can't retrieve Flat ID from the URL: ${ url }`);
        return +id;
    }

    // TODO: Add caching
    private fetch(flatId: number): AnyObject {
        const response = UrlFetchApp.fetch(`https://dimdim.wrenchtech.io/api/flats/?ids=${ flatId }`);
        const data = JSON.parse(response.getContentText()).results[0];
        assertNil(data, `DimDim: Can't fetch flat info by ID: ${ flatId }`);
        return data;
    }

}
