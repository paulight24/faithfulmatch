export declare function geocodeUsZip(zip: string): Promise<{
    lat: number;
    lng: number;
} | null>;
export declare function haversineMiles(aLat: number, aLng: number, bLat: number, bLng: number): number;
