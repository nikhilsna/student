precision highp float;

varying vec3 vColor;
varying float vRadius;
varying float vTemp;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);

    float alpha = smoothstep(0.5, 0.0, dist);

    float emissive = clamp(vTemp / 5000.0, 0.2, 5.0); 
    vec3 glowColor = vColor * emissive;

    gl_FragColor = vec4(glowColor, alpha);

    if (gl_FragColor.a < 0.01) discard;
}
