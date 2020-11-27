import {
    Flat,
    FlatParser,
} from '../types';

export class DimDimFlatParser implements FlatParser {

    public is(url: string): boolean {
        return /\/dimdim.ua\/rent\/apartment\//.test(url);
    }

    public parse(url: string): Flat {
        return {
            address: 0,
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
}
