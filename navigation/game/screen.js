

export function checkOnscreen(x, y) {
    const temp = {x: x - camera.x, y: y - camera.y};
    if (Math.abs(temp.x) <= canvas.width / 2 && Math.abs(temp.y) <= canvas.height / 2) {
        return true;
    }
};