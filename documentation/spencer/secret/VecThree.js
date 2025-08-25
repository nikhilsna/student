import { camera } from './camThree.js';

var point = {
    x: 0,
    y: 0,
    z: 0
};

export function vec3(x, y, z) {
    point = {
        x: x || 0,
        y: y || 0,
        z: z || 0
    };
    return point;
};

export function rotate(x, y, angle) {
    const rad = (angle * Math.PI / 180) || 0;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
        x: x * cos - y * sin,
        y: x * sin + y * cos,
    };
};

export var focalLength = 0;

export function setUpEnvironment(screen) {
    const rads = (camera.FOV * Math.PI) / 180;
    focalLength = screen.width / (2 * Math.tan(rads / 2));
};

export function goTo(x, y, z) {
    vec3(x - camera.position.x, y - camera.position.y, z - camera.position.z);
    const rx = rotate(point.x, point.z, camera.rotation.x);
    vec3(rx.x, point.y, rx.y);
    const ry = rotate(point.y, point.z, camera.rotation.y);
    vec3(point.x, rx.y, ry.z);
    const rz = rotate(point.x, point.y, camera.rotation.z);
    vec3(rz.x, rz.y, point.z);
    if (point.z < 0.1) {
        return null;
    }
    vec3(focalLength * (point.x / point.z), focalLength * (point.y / point.z), point.z);
    return {x: point.x, y: point.y};
};