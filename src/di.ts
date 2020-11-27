import {
    FlatFiller,
    FlatParserStrategy,
} from './types';
import { DimDimFlatParser } from './parsers';

const storage = new Map();
storage.set(DimDimFlatParser, new DimDimFlatParser());
storage.set(FlatParserStrategy, new FlatParserStrategy([
    storage.get(DimDimFlatParser),
]));
storage.set(FlatFiller, new FlatFiller());

export const DI = {
    get: <T>(constr: { new(...args: any[]): T }): T => storage.get(constr),
}
