import { CGFobject, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPyramid } from "./MyPyramid.js";

export class MyFire extends CGFobject {
  constructor(scene, fireRadius = 6) {
    super(scene);
    this.shader = new CGFshader(scene.gl, "shaders/texture3anim.vert", "shaders/texture3anim.frag");
    this.shader.setUniformsValues({ uSampler2: 1, timeFactor: 0 });
    
    this.flames = [];
    this.positions = [];
    this.appearance = new CGFappearance(scene);


    const texture = new CGFtexture(scene, "textures/fogo.jpg");
    this.filterTexture = new CGFtexture(scene, "textures/filter.png");
    this.appearance.setTexture(texture);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    this.appearance.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.appearance.setShininess(1.0);

    this.maxHeight = 4;
    this.minHeight = 1;

    const densityBase =1; 
    const flameCount = Math.floor(Math.PI * fireRadius * fireRadius * densityBase);
    this.offsets = [];


    for (let i = 0; i < flameCount; i++) {
      this.offsets.push(Math.random() * 10.0);
      const pyramid = new MyPyramid(scene,5);
      this.flames.push(pyramid);

      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.sqrt(Math.random()) * fireRadius; 
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      const t = radius / fireRadius;
      const baseHeight = this.maxHeight - t * (this.maxHeight - this.minHeight);
      const randomFactor = 0.8 + Math.random() * 0.4;
      const height = baseHeight * randomFactor;

      this.positions.push({ x, z, height });
    }
  }

  display() {
    this.scene.setActiveShader(this.shader);

    this.scene.gl.activeTexture(this.scene.gl.TEXTURE0);
    this.appearance.texture.bind();

    this.scene.gl.activeTexture(this.scene.gl.TEXTURE1);
    this.filterTexture.bind();

    this.shader.setUniformsValues({
        uSampler: 0,                                 
        timeFactor: this.scene.timeFactor || 0
    });

    for (let i = 0; i < this.flames.length; i++) {
      const { x, z, height } = this.positions[i];

      this.shader.setUniformsValues({ flameOffset: this.offsets[i] });

      this.appearance.apply();
      this.scene.pushMatrix();
      this.scene.translate(x, 0, z);
      this.scene.scale(1.2, height * 1.3, 1.2);
      this.flames[i].display();
      this.scene.popMatrix();
    }

    this.scene.setActiveShader(this.scene.defaultShader);
}

}