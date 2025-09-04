precision mediump float;

varying vec2 vUV;

uniform sampler2D uParticleTex;
uniform int uParticleCount;
uniform int uTexSize;

uniform float uAspect;

const vec3 baseColor = vec3(1.0, 0.8, 0.75);

vec3 tempToColor(float temp) {
    float t = clamp(temp, 1000.0, 40000.0) / 1.0;

    float r, g, b;

    if (t <= 66.0) {
        r = 1.0;
    } else {
        r = 1.292936186062745 * pow(t - 60.0, -0.1332047592);
        r = clamp(r, 0.0, 1.0);
    }

    if (t <= 66.0) {
        g = 0.3900815787690196 * log(t) - 0.6318414437886275;
    } else {
        g = 1.129890860895294 * pow(t - 60.0, -0.0755148492);
    }
    g = clamp(g, 0.0, 1.0);

    if (t >= 66.0) {
        b = 1.0;
    } else if (t <= 19.0) {
        b = 0.0;
    } else {
        b = 0.5432067891101961 * log(t - 10.0) - 1.19625408914;
        b = clamp(b, 0.0, 1.0);
    }

    return vec3(r, g, b);
}


void main() {
    vec3 color = vec3(0.0);

    vec2 uv = vUV;
    uv.x = (uv.x - 0.5) * uAspect + 0.5;

    for(int i = 0; i < 8000; i++) {
        if(i >= uParticleCount) break;

        // Get particle data from texture
        float fx = (mod(float(i), float(uTexSize)) + 0.5) / float(uTexSize);
        float fy = (floor(float(i)/float(uTexSize)) + 0.5) / float(uTexSize);
        vec4 data = texture2D(uParticleTex, vec2(fx, fy));

        vec2 pos = data.xy;

        float d = distance(uv, pos);
        float radius = 0.002;

        float intensity = data.w * 2.0;

        float edge = 0.002;
        float circle = smoothstep(radius, radius - edge, d);

        float falloff = exp(-d*d/(radius*radius*200.0));
        color += tempToColor(intensity) * (circle + falloff*intensity);
    }

    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
