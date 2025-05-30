precision mediump float;

uniform sampler2D uTexture1;  // H texture
uniform sampler2D uTexture2;  // UP or DOWN texture
uniform float blendFactor;    // Between 0.0 and 1.0

varying vec2 vTexCoords;

void main() {
    vec4 tex1 = texture2D(uTexture1, vTexCoords);
    vec4 tex2 = texture2D(uTexture2, vTexCoords);
    gl_FragColor = mix(tex1, tex2, blendFactor);
}
