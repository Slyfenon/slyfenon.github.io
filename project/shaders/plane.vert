precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uScaleFactor;
uniform sampler2D uSampler2; 

varying vec2 vTexCoord;

void main() {
    vTexCoord = aTextureCoord;

    float height = texture2D(uSampler2, aTextureCoord).r;

    // We change the z axis because we need to rotate the plane -90 degress to become horizontal
    vec3 displacedPosition = aVertexPosition;
    displacedPosition.z += height * uScaleFactor; 

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
}