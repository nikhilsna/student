
export function distance3D(x1, y1, z1, x2, y2, z2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
};

export function distance2D(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const physics = {
    GRAVITY: 9.81,
    SPEED_OF_LIGHT: 299792458,
};