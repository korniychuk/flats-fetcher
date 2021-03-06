export class TextEngineService {

    public prepareAddress(str: string): string {
        return str.replace(/ *(?<![а-я])(ул(ица)?|вул(иця)?)\.? */ig, '');
    }

    public prepareComplex(str: string): string {
        return str.replace(/\s+/g, '')
               ? str.replace(/^ *(ЖК *)?/ig, 'ЖК ').replace(/["']/g, '')
               : '';
    }

    public retrieveComplex(str: string): string | undefined {
        const regex = /(?<complex>Ж(?:ил[а-я]*)?\s*К(?:омплекс[а-я]*)?|Клубн[а-я]*\s+дом[а-я]*)\s*(?<name>(?:(?:(['"]).+?\3)|(?:«.+?»)|(?:“.+?”)|[a-zа-яі'"«»]+\d*(?:(?! [св])\s+(?!(ул|вул|\d+-))[a-zа-яі\d'"«»]+){0,4}))/ig;
        const values = [];
        let res;
        while (res = regex.exec(str)) {
            values.push(res);
        }
        let name = values.find(v => /ЖК/i.test(v.groups?.complex || ''))?.groups?.name;
        if (!name) name = values.find(v => /Жил/i.test(v.groups?.complex || ''))?.groups?.name;
        return name ? `ЖК ${ name }` : values[0]?.groups?.name;
    }

    public retrieveFloorHeating(str: string): string {
        return 'Подогрев пола: ' + (/[^а-я]пол[ыова]{0,2}[^а-я]/i.test(str) ? 'Да' : '?');
    }

    public retrieveDishWasher(str: string): string {
        return 'Посудомойка: ' + (/посуд(?!а [^а-я])/i.test(str) ? 'Да' : '?');
    }

    public retrieveCommissionInfo(str: string): string | undefined {
        return /без\s*комм?исс?и?и/i.test(str) ? 'Без комиссии' :
               /(?:от\s*)?(?:владель?ца|хозяина?)/i.test(str) ? 'От владельца' :
               undefined;

    }

    public makeGMap(coordinates: number[]): string {
        return `=HYPERLINK("https://www.google.com/maps/dir//${ coordinates }"; "GMap")`;
    }

    public makeImage(src: string): string {
        return `=IMAGE("${ src }")`;
    }

    public makeArea(total?: number, living?: number, kitchen?: number): string {
        return `${ total || '-' } / ${ living || '-' } / ${ kitchen || '-' } м²`;
    }

    public makeFloor(floor?: number, floorsTotal?: number): string {
        return `${ floor || '?' } этаж из ${ floorsTotal || '?' }`;
    }

    public makeUpdatedAt(d: Date): string {
        const z = (n: number, len = 2) => String(n).padStart(len, '0');
        return 'Обновл.: ' +
            `${ z(d.getDate()) }.${ z(d.getMonth()) }.${ d.getFullYear() } ${ z(d.getHours()) }:${ z(d.getMinutes()) }`;

    }

}
