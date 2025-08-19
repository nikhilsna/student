
const camera = {
  x: 0,
  y: 0,
  zoom: 1,
};

var followSpeed = 0.08;

const target = camera;

function updateCamera() {
    camera.x += followSpeed * (target.x - camera.x);
    camera.y += followSpeed * (target.y - camera.y);
    camera.zoom += followSpeed * (target.zoom - camera.zoom);
};

function setCameraTarget(newTarget) {
    target.x = newTarget.x;
    target.y = newTarget.y;
    target.zoom = newTarget.zoom || 1;
};