"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeUsZip = geocodeUsZip;
exports.haversineMiles = haversineMiles;
async function geocodeUsZip(zip) {
    const cleaned = zip.trim().slice(0, 5);
    if (!/^\d{5}$/.test(cleaned))
        return null;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`https://api.zippopotam.us/us/${cleaned}`, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok)
            return null;
        const body = (await res.json());
        const place = body.places?.[0];
        if (!place)
            return null;
        const lat = parseFloat(place.latitude);
        const lng = parseFloat(place.longitude);
        if (Number.isNaN(lat) || Number.isNaN(lng))
            return null;
        return { lat, lng };
    }
    catch {
        return null;
    }
}
function haversineMiles(aLat, aLng, bLat, bLng) {
    const R = 3958.8;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(bLat - aLat);
    const dLng = toRad(bLng - aLng);
    const lat1 = toRad(aLat);
    const lat2 = toRad(bLat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
//# sourceMappingURL=geocode-zip.util.js.map