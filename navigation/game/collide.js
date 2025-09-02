export class GameObject {
    constructor(x = 0, y = 0, width = 50, height = 50) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    move(speed, angle) {
        this.x += Math.cos(angle) * speed;
        this.y += Math.sin(angle) * speed;
    }

    static collide(obj1, obj2, size) {
        return (
            obj1.x < obj2.x + size &&
            obj1.x + size > obj2.x &&
            obj1.y < obj2.y + size &&
            obj1.y + size > obj2.y
        );
    }
}
