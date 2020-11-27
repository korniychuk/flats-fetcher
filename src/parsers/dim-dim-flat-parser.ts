import {
    AnyObject,
    Flat,
    FlatParser,
} from '../types';
import { assertNil } from '../assertions';
import { TextEngineService } from '../services';

interface Subway {
    id: number;
    is_active: boolean;
    location: { type: 'Point', coordinates: [number, number] }
    name: string;
    order: number
    subway_line: number;
}

export class DimDimFlatParser implements FlatParser {
    private urlRegExp = /\/dimdim\.ua\/rent\/apartment\/(?<id>\d+)/;

    public constructor(
        private t: TextEngineService,
    ) {}

    public is(url: string): boolean {
        return this.urlRegExp.test(url);
    }

    public parse(url: string): Flat {
        const flatId = this.retrieveFlatIdFromUrl(url);
        const res = this.fetchFlatInfo(flatId);

        const address = `${ res.address_raw }\n${ res.district }`;
        const description = `${ res.title }\n${ res.description }`;
        const complex = this.t.retrieveComplex(description) || '';
        const coordinates = this.t.makeGMap([res.location_point.lat, res.location_point.lon]);
        const link = `https://dimdim.ua/rent/apartment/${ flatId }/`;
        const images = res.images.map(this.t.makeImage.bind(this.t));

        let price = `${ res.price_usd } $`;
        const commission = res.is_owner ? 'От владельца' : this.t.retrieveCommissionInfo(description);
        if (commission) price += `\n${ commission }`;

        const area = this.t.makeArea(res.size_total, res.size_living, res.size_kitchen);
        const floor = this.t.makeFloor(res.floor, res.floors_total);
        const floorHeating = this.t.retrieveFloorHeating(description);
        const dishWasher = this.t.retrieveDishWasher(description);
        const updatedAt = this.t.makeUpdatedAt(new Date(res.updated_at));
        const subways = this.prepareSubways(res.subways_distance).join('\n');
        const info = [area, floor, updatedAt, floorHeating, dishWasher, subways].join('\n');

        return {
            address,
            complex,
            coordinates,
            description,
            id: 0,
            images,
            info,
            link,
            price,
            rooms: res.room,
        };
    }

    private retrieveFlatIdFromUrl(url: string): number {
        const id = url.match(this.urlRegExp)?.groups?.id;
        assertNil(id, `DimDim: Can't retrieve Flat ID from the URL: ${ url }`);
        return +id;
    }

    public prepareSubways(near: AnyObject[]): string[] {
        const indexed = _.keyBy(this.fetchSubways(), v => v.id);
        return near.map(subway => `м. ${ indexed[subway.subway_id]?.name } 🚶‍\u00a0${ subway.minutes } мин`);
    }

    private fetchFlatInfo(flatId: number): AnyObject {
        const data = this.fetchJSON(
            `https://dimdim.wrenchtech.io/api/flats/?ids=${ flatId }`,
            `Can't fetch flat info by ID: ${ flatId }`,
        )[0];
        return data;
    }

    private fetchSubways(): Subway[] {
        return this.fetchJSON<Subway>(`https://dimdim.wrenchtech.io/api/cities/1/subways/`);
    }

    private fetchJSON<T = AnyObject>(url: string, errorMsg = `DimDim: Can't fetch URL: ${ url }`): T[] {
        const cache = CacheService.getDocumentCache();
        const cachedData = cache?.get(url);
        if (cachedData) return JSON.parse(cachedData);

        const response = UrlFetchApp.fetch(url);
        const data = JSON.parse(response.getContentText()).results;
        assertNil(data, `DimDim: ${ errorMsg }`);
        cache?.put(url, JSON.stringify(data), 60 * 15);

        return data;
    }

}
