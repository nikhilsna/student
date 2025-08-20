
const obj = {
    x: 0,
    y: 0,
    width: 50,
    height: 50
};

export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

function moveObj(obj, speed, angle) {
    obj.x += Math.cos(angle) * speed;
    obj.y += Math.sin(angle) * speed;
};

export function updCollide(obj1,obj2,radius) {
    const dist = distance(obj1.x, obj1.y, obj2.x, obj2.y);
    if (dist < radius) {
        return true;
    }
    return false;
};