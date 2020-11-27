import {
    FlatFillerService,
    FlatParserStrategyService,
} from './services';
import { DimDimFlatParser } from './parsers';

const storage = new Map();
storage.set(DimDimFlatParser, new DimDimFlatParser());
storage.set(FlatParserStrategyService, new FlatParserStrategyService([
    storage.get(DimDimFlatParser),
]));
storage.set(FlatFillerService, new FlatFillerService());

export const DI = {
    get: <T>(constr: { new(...args: any[]): T }): T => storage.get(constr),
}
