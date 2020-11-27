import {
    FlatFillerService,
    FlatParserStrategyService,
    HttpService,
    TextEngineService,
} from './services';
import {
    CrmCapitalFlatParser,
    DimDimFlatParser,
} from './parsers';

const storage = new Map();
storage.set(HttpService, new HttpService());
storage.set(TextEngineService, new TextEngineService());
storage.set(DimDimFlatParser, new DimDimFlatParser(storage.get(TextEngineService), storage.get(HttpService)));
storage.set(CrmCapitalFlatParser, new CrmCapitalFlatParser(storage.get(TextEngineService), storage.get(HttpService)));
storage.set(FlatParserStrategyService, new FlatParserStrategyService([
    storage.get(DimDimFlatParser),
    storage.get(CrmCapitalFlatParser),
]));
storage.set(FlatFillerService, new FlatFillerService(storage.get(TextEngineService)));

export const DI = {
    get: <T>(constr: { new(...args: any[]): T }): T => storage.get(constr),
}
