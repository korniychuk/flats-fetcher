import { FlatParser } from '../types/flat-parser.type';

export class FlatParserStrategyService {

    public constructor(
        private parsers: FlatParser[],
    ) {}

    public get(url: string): FlatParser | undefined {
        return this.parsers.find(parser => parser.is(url));
    }

}
