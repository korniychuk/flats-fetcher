import { FlatParser } from './flat-parser.type';

export class FlatParserStrategy {

    public constructor(
        private parsers: FlatParser[],
    ) {}

    public get(url: string): FlatParser | undefined {
        return this.parsers.find(parser => parser.is(url));
    }

}
