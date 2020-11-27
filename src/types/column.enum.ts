const columns = [
        'Id',
        'Complex',
        'Coordinates',
        'Address',
        'Money',
        'RoomCount',
        'Info',
        'Link',
        'Description',
        'Phone',
        'View',
        'Note',
        'Images',
] as const;

type Values<T> = T extends { [i: number]: infer K } ? K : never;

export type EColumn = Record<Values<typeof columns>, number>;
export const EColumn = columns.reduce((obj, key, i) => ({ ...obj, [key]: i + 1 }), {} as EColumn);
