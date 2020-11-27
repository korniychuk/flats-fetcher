import {
    FlatFillerService,
    FlatParserStrategyService,
    TextEngineService,
} from './services';
import { DimDimFlatParser } from './parsers';

const storage = new Map();
storage.set(TextEngineService, new TextEngineService());
storage.set(DimDimFlatParser, new DimDimFlatParser(storage.get(TextEngineService)));
storage.set(FlatParserStrategyService, new FlatParserStrategyService([
    storage.get(DimDimFlatParser),
]));
storage.set(FlatFillerService, new FlatFillerService(storage.get(TextEngineService)));

export const DI = {
    get: <T>(constr: { new(...args: any[]): T }): T => storage.get(constr),
}
