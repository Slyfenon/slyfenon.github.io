attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTexCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTexCoords = aTextureCoord;
}
