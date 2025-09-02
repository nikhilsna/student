export class Camera {
  constructor(x = 0, y = 0, zoom = 1, followSpeed = 0.08) {
      this.x = x;
      this.y = y;
      this.zoom = zoom;
      this.followSpeed = followSpeed;
      this.target = { x: this.x, y: this.y, zoom: this.zoom };
  }

  update() {
      this.x += this.followSpeed * (this.target.x - this.x);
      this.y += this.followSpeed * (this.target.y - this.y);
      this.zoom += this.followSpeed * (this.target.zoom - this.zoom);
  }

  setTarget(newTarget) {
      this.target = {
          x: newTarget.x,
          y: newTarget.y,
          zoom: newTarget.zoom ?? this.zoom
      };
  }
}
