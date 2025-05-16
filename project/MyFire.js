import { CGFobject, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPyramid } from "./MyPyramid.js";

export class MyFire extends CGFobject {
  constructor(scene, fireRadius = 3) {
    super(scene);
    //this.shader = new CGFshader(scene.gl, "shaders/texture3anim.vert", "shaders/texture3anim.frag");
    //this.shader.setUniformsValues({ uSampler2: 1, timeFactor: 0 });
    
    this.flames = [];
    this.positions = [];
    this.rotations = [];

    this.appearances = [];

    this.useTexture = Math.random() < 0.5

    this.appearance = new CGFappearance(scene);

    if (this.useTexture) {
      this.texture = new CGFtexture(scene, "textures/resized_fogo.jpg");
      this.appearance.setTexture(this.texture);
      this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    //this.filterTexture = new CGFtexture(scene, "textures/resized_filter.png");

    this.appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.appearance.setShininess(1.0);

    this.colorAppearance = new CGFappearance(scene);
    this.colorAppearance.setAmbient(1.0, 0.5, 0.0, 1.0); // Cor laranja
    this.colorAppearance.setDiffuse(1.0, 0.5, 0.0, 1.0);
    this.colorAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.colorAppearance.setShininess(1.0);

    this.maxHeight = 9;
    this.minHeight = 2;

    //const minRadius = 0.1;  // Limita o valor mínimo de dispersão
    //const maxRadius = fireRadius; // Limita o valor máximo de dispersão

    //const flameCount = Math.floor(Math.PI * fireRadius * fireRadius * densityBase);
    this.offsets = [];

    // Pirâmide central
    const pyramid = new MyPyramid(scene, 3, 1, false);
    this.flames.push(pyramid);
    this.positions.push({ x: 0, z: 0, height: this.maxHeight });
    this.rotations.push(Math.random() * 2 * Math.PI);

    const centerApp = new CGFappearance(scene);
    centerApp.setAmbient(1.0, 1.0, 0.0, 1.0); // amarelo
    centerApp.setDiffuse(1.0, 1.0, 0.0, 1.0);
    centerApp.setSpecular(0.0, 0.0, 0.0, 1.0);
    centerApp.setShininess(1.0);
    this.appearances.push(centerApp);

    // Anéis à volta
    const numRings = 2 + Math.floor(Math.random() * 2); // 2 a 3 aneis
    const maxAllowedHeight = this.maxHeight * 0.95;

    for (let ring = 1; ring <= numRings; ring++) {  
      const ringSpacing = fireRadius / (numRings + 0.5);
      const radius = ring * ringSpacing;
      const flamesThisRing = 2 + Math.floor(Math.random() * 2); // 2 a 3 por anel

      for (let i = 0; i < flamesThisRing; i++) {
        const angle = (2 * Math.PI / flamesThisRing) * i + (Math.random() - 0.5) * 0.3;
        const offsetRadius = radius + (Math.random() - 0.5) * 0.3;

        const x = offsetRadius * Math.cos(angle);
        const z = offsetRadius * Math.sin(angle);

        const falloff = Math.pow(offsetRadius / fireRadius, 1.5);
        const baseHeight = this.maxHeight * (1 - falloff) + this.minHeight;
        const randomFactor = 0.85 + Math.random() * 0.3;
        let height = baseHeight * randomFactor;
        height = Math.min(height, maxAllowedHeight);

        const pyramid = new MyPyramid(scene, 3, 1, false);
        this.flames.push(pyramid);
        this.positions.push({ x, z, height });
        this.rotations.push(Math.random() * 2 * Math.PI);


        let r, g, b;

        const ringRatio = ring / numRings;

        if (ringRatio < 0.34) {
          // Amarelo quente (centro)
          r = 0.95 + Math.random() * 0.05;   // 0.95 – 1.0
          g = 0.85 + Math.random() * 0.15;   // 0.85 – 1.0
          b = 0.0 + Math.random() * 0.05;    // 0.00 – 0.05
        } else if (ringRatio < 0.67) {
          // Laranja médio (meio)
          r = 0.95 + Math.random() * 0.05;   // 0.95 – 1.0
          g = 0.3 + Math.random() * 0.25;    // 0.30 – 0.55
          b = 0.0 + Math.random() * 0.05;    // 0.00 – 0.05
        } else {
          // Vermelho escuro (exterior)
          r = 0.7 + Math.random() * 0.25;    // 0.70 – 0.95
          g = 0.0 + Math.random() * 0.1;     // 0.00 – 0.10
          b = 0.0 + Math.random() * 0.05;    // 0.00 – 0.05
        }
        const app = new CGFappearance(scene);
        app.setAmbient(r, g, b, 1.0);
        app.setDiffuse(r, g, b, 1.0);
        app.setSpecular(0.0, 0.0, 0.0, 1.0);
        app.setShininess(1.0);
        this.appearances.push(app);
      }
    }
  }

  display() {
    //this.scene.setActiveShader(this.shader);

    //this.scene.gl.activeTexture(this.scene.gl.TEXTURE0);
    //this.appearance.texture.bind();

    //this.scene.gl.activeTexture(this.scene.gl.TEXTURE1);
    //this.filterTexture.bind();

    //this.shader.setUniformsValues({
    //    uSampler: 0,                                 
   //    timeFactor: this.scene.timeFactor || 0
   // });

    for (let i = 0; i < this.flames.length; i++) {
      const { x, z, height } = this.positions[i];
      const baseScale = 0.5 + height * 0.35; // aumenta base conforme altura

      //this.shader.setUniformsValues({ flameOffset: this.offsets[i] });

      if (this.useTexture) {
        this.appearance.apply();
      } else {
        this.appearances[i].apply();
      }


      this.scene.pushMatrix();
      this.scene.translate(x, 0, z);
      this.scene.rotate(this.rotations[i], 0, 1, 0); // rotação em Y
      this.scene.scale(baseScale, height, baseScale);
      this.flames[i].display();
      this.scene.popMatrix();
    }

    //this.scene.setActiveShader(this.scene.defaultShader);
}

}