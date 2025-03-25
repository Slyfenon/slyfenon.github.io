attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float normScale;
uniform float timeFactor;

varying vec4 vert;

void main() {
    float offsetX = sin(timeFactor) + normScale;
    vec4 animatedPosition = vec4(aVertexPosition.x + offsetX, aVertexPosition.y, aVertexPosition.z, 1.0);
    gl_Position = uPMatrix * uMVMatrix * animatedPosition;
    vert = gl_Position;
}