
// tile.js
import { camera } from './camera.js';
import { checkOnscreen } from './screen.js';

class Tile {
    constructor(x, y, type, col = 0, life = 0) {
        // Align to grid based on camera
        this.x = Math.floor((x - camera.x) / 20) * 20 - camera.x;
        this.y = Math.floor((y - camera.y) / 20) * 20 - camera.y;
        this.type = type;
        this.col = col;
        this.life = life;
    }
    // Example method: check if tile is onscreen
    isOnscreen() {
        return checkOnscreen(this.x, this.y);
    }
    // Example method: draw/update (placeholder)
    render(ctx) {
        ctx.fillStyle = this.col === 0 ? "gray" : "red";
        ctx.fillRect(this.x, this.y, 20, 20);
    }
}
class TileManager {
    constructor() {
        this.tiles = [];
        this.editorType = 1;
        this.actionEnabled = false;
    }
    addTile(x, y, type) {
        const newTile = new Tile(x, y, type);
        this.tiles.push(newTile);
        return newTile;
    }
    getTiles() {
        return this.tiles;
    }
    enableAction() {
        this.actionEnabled = true;
    }
    disableAction() {
        this.actionEnabled = false;
    }
}
export const tileManager = new TileManager();


// canvas.addEventListener("mousemove", (e) => {
//     const rect = canvas.getBoundingClientRect();
//     mouse = {x: e.clientX, y: e.clientY};
// });

// document.addEventListener("keydown", (e) => {
//     if (e.altKey && e.key === "0") {
//     actionEnabled = !actionEnabled;
//     console.log("Developer Mode:", actionEnabled);
//     }
// });

// canvas.addEventListener("click", (e) => {
//         const rect = canvas.getBoundingClientRect();
//         if (!actionEnabled) return;
//         addTile(mouse.x, mouse.y, editorType);
// });