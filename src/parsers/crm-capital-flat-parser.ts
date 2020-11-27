import {
    AnyObject,
    Flat,
    FlatParser,
} from '../types';
import {
    HttpService,
    TextEngineService,
} from '../services';
import { assertNil } from '../assertions';

export class CrmCapitalFlatParser implements FlatParser {
    private urlRegExp = /crm-capital\.realtsoft\.net\/estate-(?<id>\d+)\.html/;

    public constructor(
        private t: TextEngineService,
        private http: HttpService,
    ) {}

    public is(url: string): boolean {
        return this.urlRegExp.test(url);
    }

    public parse(url: string): Flat {
        const flatId = this.retrieveFlatIdFromUrl(url);
        const res = this.fetchFlatInfo(flatId);

        const address = `${ res.address_raw }\n${ res.district || '' }`;
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
        // const subways = this.prepareSubways(res.subways_distance || []).join('\n');
        const info = [area, floor, updatedAt, floorHeating, dishWasher].join('\n');

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

    private fetchFlatInfo(flatId: number): AnyObject {
        const data = this.http.fetchHtml(
            `https://crm-capital.realtsoft.net/estate-${ flatId }.html`,
            `Can't fetch flat info by ID: ${ flatId }`,
        );
        return data;
    }

}
