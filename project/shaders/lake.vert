precision mediump float;

attribute vec3 aVertexPosition; 
attribute vec2 aTextureCoord;   

uniform mat4 uMVMatrix;        
uniform mat4 uPMatrix;           
uniform float uScaleFactor;     
uniform sampler2D uSampler2;     
uniform float uTime;            

varying vec2 vTexCoord;          

void main() {
    vTexCoord = aTextureCoord;

    float height = texture2D(uSampler2, aTextureCoord).r;

    float wave = sin(uTime * 1.0 + aTextureCoord.x * 15.0 + aTextureCoord.y * 15.0) * 0.15;  

    float finalHeight = height + wave;

    // Z position as the terrain shader 
    vec3 displacedPosition = aVertexPosition;
    displacedPosition.z += finalHeight * uScaleFactor;

    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
}
