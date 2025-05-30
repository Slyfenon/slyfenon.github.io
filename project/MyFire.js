import { CGFobject, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyPyramid } from "./MyPyramid.js";

export class MyFire extends CGFobject {
  constructor(scene, fireRadius = 3) {
    super(scene);

    this.scene = scene;
    this.fireRadius = fireRadius;

    this.maxHeight = 9;
    this.minHeight = 2;
    this.positions = []; // posicao e altura de cada piramide
    this.rotations = []; // rotacao de cada piramide 
    this.appearances = []; // aparencia de cada piramide sem textura
    this.useTexture = Math.random() < 0.6;
    this.sharedPyramid = new MyPyramid(scene, 3, 1, false);

    if (this.useTexture) {
      this.initShaderAndTextures();
    }

    this.generateCenterFlame();
    this.generateRings();
  }

  /**
   * Initializes the shader and textures for the fire effect.
   * Sets up the shader with the fire texture and filter texture.
   * Sets the texture wrap mode to REPEAT for both textures.
   * Initializes the shader uniforms for time factor.
   */
  initShaderAndTextures() {
    this.shader = new CGFshader(this.scene.gl, "shaders/fire.vert", "shaders/fire.frag");
    this.shader.setUniformsValues({ uSampler2: 1, timeFactor: 0 });

    this.appearance = new CGFappearance(this.scene);

    this.texture = new CGFtexture(this.scene, "textures/resized_fogo.jpg");
    this.appearance.setTexture(this.texture);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');

    this.filterTexture = new CGFtexture(this.scene, "textures/resized_filter.png");
  }

  /**
   * Generates the center flame of the fire.
   * Adds a flame at the center position with maximum height.
   * Sets the appearance of the center flame to a bright yellow color.
   */
  generateCenterFlame() {
    this.positions.push({ x: 0, z: 0, height: this.maxHeight });
    this.rotations.push(Math.random() * 2 * Math.PI);

    const centerApp = new CGFappearance(this.scene);
    centerApp.setAmbient(1.0, 1.0, 0.0, 1.0);
    centerApp.setDiffuse(1.0, 1.0, 0.0, 1.0);
    centerApp.setSpecular(0.0, 0.0, 0.0, 1.0);
    centerApp.setShininess(1.0);
    this.appearances.push(centerApp);
  }

  /**
   * Generates the rings of flames around the center flame.
   * Creates 2 to 3 rings of flames, each with 2 to 3 flames.
   */
  generateRings() {
    // Anéis à volta
    const numRings = 2 + Math.floor(Math.random() * 2); // 2 a 3 aneis
    const maxAllowedHeight = this.maxHeight * 0.95;

    for (let ring = 1; ring <= numRings; ring++) {
      const ringSpacing = this.fireRadius / (numRings + 0.5);
      const radius = ring * ringSpacing;
      const flamesThisRing = 2 + Math.floor(Math.random() * 2); // 2 a 3 por anel

      for (let i = 0; i < flamesThisRing; i++) {
        const angle = (2 * Math.PI / flamesThisRing) * i + (Math.random() - 0.5) * 0.3;
        const offsetRadius = radius + (Math.random() - 0.5) * 0.3;

        const x = offsetRadius * Math.cos(angle);
        const z = offsetRadius * Math.sin(angle);
        let height = this.calculateHeight(offsetRadius, maxAllowedHeight);

        this.positions.push({ x, z, height });
        this.rotations.push(Math.random() * 2 * Math.PI);
        this.appearances.push(this.createFlameAppearance(ring / numRings));
      }
    }
  }

  /**
   * Calculates the height of a flame based on its distance from the center.
   * The height decreases as the distance from the center increases, with a random factor applied.
   * @param {number} offsetRadius - The distance of the flame from the center.
   * @param {number} maxAllowedHeight - The maximum height allowed for the flame.
   * @returns {number} - The calculated height of the flame.
   */
  calculateHeight(offsetRadius, maxAllowedHeight) {
    const falloff = Math.pow(offsetRadius / this.fireRadius, 1.5);
    const baseHeight = this.maxHeight * (1 - falloff) + this.minHeight;
    const randomFactor = 0.85 + Math.random() * 0.3;
    return Math.min(baseHeight * randomFactor, maxAllowedHeight);
  }

  /**
   * Creates the appearance of a flame based on its ring ratio.
   * The color of the flame varies based on its position in the ring.
   * @param {*} ringRatio 
   * @returns 
   */
  createFlameAppearance(ringRatio) {
    let r, g, b;
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
    const app = new CGFappearance(this.scene);
    app.setAmbient(r, g, b, 1.0);
    app.setDiffuse(r, g, b, 1.0);
    app.setSpecular(0.0, 0.0, 0.0, 1.0);
    app.setShininess(1.0);
    return app;
  }

  /**
   * Displays the fire effect.
   */
  display() {

    if (this.useTexture) {
      this.scene.setActiveShader(this.shader);
      this.scene.gl.activeTexture(this.scene.gl.TEXTURE0);
      this.appearance.texture.bind();
      this.scene.gl.activeTexture(this.scene.gl.TEXTURE1);
      this.filterTexture.bind();

      this.shader.setUniformsValues({
        uSampler: 0,
        timeFactor: this.scene.timeFactor || 0
      });
    } else {
      this.scene.setActiveShader(this.scene.defaultShader);
    }

    for (let i = 0; i < this.positions.length; i++) {
      const { x, z, height } = this.positions[i];
      const baseScale = 0.5 + height * 0.35; // aumenta base conforme altura

      if (this.useTexture) {
        this.appearance.apply();
      } else {
        this.appearances[i].apply();
      }

      this.scene.pushMatrix();
      this.scene.translate(x, 0, z);
      this.scene.rotate(this.rotations[i], 0, 1, 0); // rotação em Y
      this.scene.scale(baseScale, height, baseScale);
      this.sharedPyramid.display();
      this.scene.popMatrix();
    }

    this.scene.setActiveShader(this.scene.defaultShader);
  }

}