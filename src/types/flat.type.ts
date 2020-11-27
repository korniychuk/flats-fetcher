export interface Flat {
    id: number;
    complex: string;
    address: string;
    coordinates: string;
    /** With sign */
    price: string;
    rooms: number;
    info: string;
    link: string;
    description: string;
    phone?: string;
    view?: string;
    note?: string;
    /** URLs list */
    images: string[];
}
