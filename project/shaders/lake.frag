precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uSampler;

void main() {
    vec4 texColor = texture2D(uSampler, vTexCoord);

    if (texColor.a < 0.8) discard;

    gl_FragColor = texColor;
}
