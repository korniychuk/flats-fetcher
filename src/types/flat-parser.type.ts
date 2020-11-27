import { Flat } from './flat.type';

export interface FlatParser {
    is(url: string): boolean;
    parse(url: string): Flat;
}
