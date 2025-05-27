attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;
uniform float flameOffset;

varying vec2 vTextureCoord;

void main() {
    vec3 offset = vec3(0.0);

    vTextureCoord = aTextureCoord;

    float amp = 0.08;
	float wave = sin(aVertexPosition.y * 40.0 - timeFactor * 10.0 + flameOffset);
	float wave2 = cos(aVertexPosition.y * 50.0 - timeFactor * 8.0 + flameOffset);


    offset.x += aVertexPosition.y * amp * wave;
    offset.z += aVertexPosition.y * amp * wave2;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}
