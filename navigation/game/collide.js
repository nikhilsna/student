
const obj = {
    x: 0,
    y: 0,
    width: 50,
    height: 50
};

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function moveObj(obj, speed, angle) {
    obj.x += Math.cos(angle) * speed;
    obj.y += Math.sin(angle) * speed;
};

function updCollide(obj1,obj2) {
    const dist = distance(obj1.x, obj1.y, obj2.x, obj2.y);
    if (dist < (obj1.width + obj2.width) / 2) {
        const angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        const overlap = (obj1.width + obj2.width) / 2 - dist;
        
        obj1 = moveObj(obj1, overlap, angle);
        obj2 = moveObj(obj2, -overlap, angle);
    }
};