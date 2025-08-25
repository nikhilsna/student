---
layout: post
title: Particles
---

<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bumper Cars Game</title>
  <style>
    canvas {
      border: 1px solid #333;
      background: #000000ff;
      display: block;
      margin: 20px auto;
    }
  </style>
</head>
<body>
    <div style="position:relative; width:800px; height:600px; margin:0 auto;">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
    </div>
    <script type="module">
        import { particle, particles, setUpParticles, updateParticle } from './partThree.js';
        import { setUpEnvironment, goTo } from './VecThree.js';
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        function renderParts() {
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                updateParticle(i);
                const point = goTo(p.x,p.y,p.z);
                console.log(point);
                if (point !== null) {
                  ctx.fillStyle = 'white';
                  ctx.fillRect(point.x + (canvas.width/2), -point.y + (canvas.height/2), 10, 10)
                }
            }
        };
        setUpParticles(50);
        setUpEnvironment(canvas);
        function update() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            renderParts();
            requestAnimationFrame(update);
        };
        update();
    </script>
</body>
</html>