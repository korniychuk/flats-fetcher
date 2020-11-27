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
        const $ = this.fetchFlatInfo(flatId);

        const address = $('.pdf-info h3').text().replace(/^[^,]+,\s+([^,]+(?:,[^,]+)?),\s*([^,]+(?:,[^,]*\d[^,]*)?)$/i, '$2\n$1')
        const description = $('h3:contains("ДОПОЛНИТЕЛЬНАЯ") + .pdf-block').text();
        const complex = this.t.retrieveComplex(description) || '';

        // const coordinates = this.t.makeGMap([res.location_point.lat, res.location_point.lon]);
        const link = `https://crm-capital.realtsoft.net/estate-${ flatId }.html?t=${ new Date().toISOString() }/`;
        const images = $('.slider-item>img').toArray().map((img) => this.t.makeImage(img.attribs.src));
        const rooms = +$('th:contains("Кол. комнат")+td').text() || 0;

        let price = $('.pdf-header strong').first().text();
        const commission = this.t.retrieveCommissionInfo(description);
        if (commission) price += `\n${ commission }`;

        const area = this.t.makeArea(
            +$('th:contains("Площадь общая")+td').text() || undefined,
            +$('th:contains("Площадь жилая")+td').text() || undefined,
            +$('th:contains("Площадь кухни")+td').text() || undefined,

        );
        const floor = this.t.makeFloor(
            +$('th:contains("Этаж")+td').first().text() || undefined,
            +$('th:contains("Этажность")+td').text() || undefined,
        );
        const floorHeating = this.t.retrieveFloorHeating(description);
        const dishWasher = this.t.retrieveDishWasher(description);
        const info = [area, floor, floorHeating, dishWasher].join('\n');

        return {
            address,
            complex,
            coordinates: '',
            description,
            id: 0,
            images,
            info,
            link,
            price,
            rooms,
        };
    }

    private retrieveFlatIdFromUrl(url: string): number {
        const id = url.match(this.urlRegExp)?.groups?.id;
        assertNil(id, `CrmCapital: Can't retrieve Flat ID from the URL: ${ url }`);
        return +id;
    }

    private fetchFlatInfo(flatId: number): cheerio.Root {
        const data = this.http.fetchHtml(
            `https://crm-capital.realtsoft.net/estate-${ flatId }.html`,
            `CrmCapital: Can't fetch flat info by ID: ${ flatId }`,
        );
        return data;
    }

}
