attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D waterMap;
uniform float timeFactor;
uniform float normScale;


varying vec2 vTextureCoord;

void main() {
    vec2 displacedCoord = aTextureCoord + vec2(0.01 * timeFactor, 0.0);

    float height = texture2D(waterMap, displacedCoord).b; 

    vec4 displacedPosition = vec4(aVertexPosition.x , aVertexPosition.y , aVertexPosition.z + height * 0.1, 1.0);

    gl_Position = uPMatrix * uMVMatrix * displacedPosition;

    vTextureCoord = aTextureCoord;
}
