
precision mediump float;

varying vec2 vUV;

uniform sampler2D uParticleTex;
uniform int uParticleCount;
uniform int uTexSize;

uniform float uAspect;

void main() {
    vec3 color = vec3(0.0);

    vec2 uv = vUV;
    uv.x = (uv.x - 0.5) * uAspect + 0.5;

    float smallCircleRadius = 0.005;
    float smoothRadiusThreshold = 0.02;

    for(int i = 0; i < 1000; i++) {
        if(i >= uParticleCount) break;

        float fx = (mod(float(i), float(uTexSize)) + 0.5) / float(uTexSize);
        float fy = (floor(float(i)/float(uTexSize)) + 0.5) / float(uTexSize);
        vec4 data = texture2D(uParticleTex, vec2(fx, fy));

        vec2 pos = data.xy;
        float radius = data.z;
        float intensity = data.w;

        float d = distance(uv, pos);

        if(d < smoothRadiusThreshold * 10.0) {
            float falloff = exp(-d*d/(radius*radius));
            color += vec3(1.0) * falloff * intensity;
        } else if (d < smallCircleRadius * 0.1) {
            color += intensity;
        }
    }

    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
