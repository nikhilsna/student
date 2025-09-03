---
layout: base
title: The Universe
hide: true
---

<html lang="en">
<head>
<meta charset="UTF-8">
<title>3D Particle Physics Simulation</title>

<style>
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden; /* prevent scrollbars */
    height: 100%;
    width: 100%;
  }
  #glCanvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
</head>
<body>

<canvas id="glCanvas"></canvas>

<script type="module">
    import { PhysicsEngine } from './physics.js';

    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    // Enable float textures
    const ext = gl.getExtension('OES_texture_float');
    if (!ext) alert("OES_texture_float not supported!");

    // --- Canvas resize ---
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- Camera setup ---
    let cameraRadius = 1000;
    let cameraTheta = Math.PI/2;
    let cameraPhi = Math.PI/2;
    let isDragging = false;
    let lastMouseX = 0, lastMouseY = 0;

    canvas.addEventListener('mousedown', e => { isDragging = true; lastMouseX=e.clientX; lastMouseY=e.clientY; });
    canvas.addEventListener('mousemove', e => {
        if(!isDragging) return;
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        lastMouseX = e.clientX; lastMouseY = e.clientY;
        cameraTheta -= dx * -0.005;
        cameraPhi -= dy * -0.005;
        cameraPhi = Math.max(0.1, Math.min(Math.PI-0.1, cameraPhi));
    });
    canvas.addEventListener('mouseup', () => isDragging=false);
    canvas.addEventListener('mouseout', () => isDragging=false);
    canvas.addEventListener('wheel', e => {
        cameraRadius += e.deltaY*0.0005*cameraRadius;
        cameraRadius = Math.max(10,cameraRadius);
    });

    // --- Math helpers ---
    function subtract(a,b){ return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
    function cross(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
    function dot(a,b){ return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
    function normalize(v){ const l=Math.sqrt(dot(v,v)); return [v[0]/l,v[1]/l,v[2]/l]; }
    function lookAt(eye,center,up){
        const f=normalize(subtract(center,eye));
        const s=normalize(cross(f,up));
        const u=cross(s,f);
        return [
            s[0],u[0],-f[0],0, s[1],u[1],-f[1],0, s[2],u[2],-f[2],0,
            -dot(s,eye), -dot(u,eye), dot(f,eye),1
        ];
    }
    function perspective(fov,aspect,near,far){
        const f=1/Math.tan(fov/2);
        return [
            f/aspect,0,0,0,
            0,f,0,0,
            0,0,(far+near)/(near-far),-1,
            0,0,(2*far*near)/(near-far),0
        ];
    }
    function getViewMatrix(){
        const x=cameraRadius*Math.sin(cameraPhi)*Math.cos(cameraTheta);
        const y=cameraRadius*Math.cos(cameraPhi);
        const z=cameraRadius*Math.sin(cameraPhi)*Math.sin(cameraTheta);
        return lookAt([x,y,z],[0,0,0],[0,1,0]);
    }

    // --- Shader helpers ---
    async function loadShaderSource(url){ const r=await fetch(url); return await r.text(); }
    function compileShader(gl,type,source){ const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ console.error(gl.getShaderInfoLog(s)); return null;} return s; }
    function createProgram(gl,vSource,fSource){ const v=compileShader(gl,gl.VERTEX_SHADER,vSource); const f=compileShader(gl,gl.FRAGMENT_SHADER,fSource); if(!v||!f) return null; const p=gl.createProgram(); gl.attachShader(p,v); gl.attachShader(p,f); gl.linkProgram(p); if(!gl.getProgramParameter(p,gl.LINK_STATUS)){ console.error(gl.getProgramInfoLog(p)); return null;} return p; }

    // --- Main ---
    async function init(){
        const vSource = await loadShaderSource('vertex.glsl');
        const fSource = await loadShaderSource('fragment.glsl');
        const program = createProgram(gl,vSource,fSource);
        if(!program) return;
        gl.useProgram(program);

        const physics = new PhysicsEngine(1000);

        // Fullscreen quad
        const quadVerts = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
        const quadVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
        gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);
        const aPosition = gl.getAttribLocation(program,'aPosition');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition,2,gl.FLOAT,false,0,0);

        // --- Particle texture ---
        const particleTexSize = Math.ceil(Math.sqrt(physics.particles.length));
        const particleData = new Float32Array(particleTexSize*particleTexSize*4);
        const particleTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, particleTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const uParticleTex = gl.getUniformLocation(program,'uParticleTex');
        const uTexSize = gl.getUniformLocation(program,'uTexSize');
        const uParticleCount = gl.getUniformLocation(program,'uParticleCount');

        gl.uniform1i(uParticleTex,0);
        gl.uniform1i(uTexSize,particleTexSize);

        const uAspect = gl.getUniformLocation(program,'uAspect');
        gl.uniform1f(uAspect, canvas.width / canvas.height);

        // --- Project particle to UV + intensity ---
        function projectParticle(p){
            const view = getViewMatrix();
            const proj = perspective(Math.PI/4, canvas.width/canvas.height,0.1,10000);
            const x=p.pos[0], y=p.pos[1], z=p.pos[2];

            // View
            const vx=view[0]*x+view[4]*y+view[8]*z+view[12];
            const vy=view[1]*x+view[5]*y+view[9]*z+view[13];
            const vz=view[2]*x+view[6]*y+view[10]*z+view[14];
            const vw=view[3]*x+view[7]*y+view[11]*z+view[15];

            // Projection
            const sx=proj[0]*vx+proj[4]*vy+proj[8]*vz+proj[12]*vw;
            const sy=proj[1]*vx+proj[5]*vy+proj[9]*vz+proj[13]*vw;
            const sw=proj[3]*vx+proj[7]*vy+proj[11]*vz+proj[15]*vw;

            const uvx = sx/sw*0.5 + 0.5;
            const uvy = 1.0 - (sy/sw*0.5 + 0.5); // flip Y

            const camDist = Math.sqrt(vx*vx+vy*vy+vz*vz);
            const intensity = 1.0/(0.01 + camDist*0.01);

            return { uv: [uvx,uvy], intensity };
        }

        function updateParticleTexture(){
            for(let i=0;i<physics.particles.length;i++){
                const p=physics.particles[i];
                const {uv,intensity}=projectParticle(p);
                const idx=i*4;
                particleData[idx]=uv[0]; particleData[idx+1]=uv[1];
                particleData[idx+2]=p.radius*0.01; particleData[idx+3]=intensity;
            }
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, particleTexture);
            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,particleTexSize,particleTexSize,0,gl.RGBA,gl.FLOAT,particleData);
            gl.uniform1i(uParticleCount,physics.particles.length);
        }

        gl.clearColor(0,0,0,1);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE);

        function render(){
            gl.clear(gl.COLOR_BUFFER_BIT);
            physics.update();
            updateParticleTexture();
            gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
            requestAnimationFrame(render);
        }

        render();
    }

    init();
</script>
</body>
</html>