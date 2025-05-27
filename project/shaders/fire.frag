#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;

void main() {
	vec2 uv = fract(vTextureCoord + vec2(timeFactor * 0.2, 0.0));
	vec4 color = texture2D(uSampler, uv);	
	vec4 filter = texture2D(uSampler2, uv);

	if (filter.b > 0.5)
		//laranja brilhante - vec4(1.0, 0.5, 0.0, 1.0)
		//amarelo quento - vec4(1.0, 0.85, 0.2, 1.0)
		color=vec4(1.0, 0.85, 0.2, 1.0);
	
	gl_FragColor = color;
}
