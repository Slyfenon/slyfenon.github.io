import { CGFobject, CGFappearance, CGFtexture, CGFshader } from "../lib/CGF.js";
import { MyUnitCubeQuad } from "./MyUnitCubeQuad.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";

export class MyBuilding extends CGFobject {
  constructor(scene, totalWidth, numFloors, windowsPerFloor, window, texturePath) {
    super(scene);

    this.totalWidth = totalWidth; // largura total do edifício
    this.numFloors = numFloors; // numero de andares dos blocos laterais
    this.windowsPerFloor = windowsPerFloor;
    this.window = window;

    //planos criados para o sign, porta e helipad
    this.helipad = new MyPlane(scene, 1);
    this.door = new MyPlane(scene, 1);
    this.sign = new MyPlane(scene, 1);

    this.moduleWidth = totalWidth / 3; // largura de cada bloco
    this.floorHeight = 6; //altura de cada piso
    this.centralFloors = numFloors + 1;

    this.centralHeight = this.centralFloors * this.floorHeight; // altura do bloco central numero de pisos * altura de cada piso
    this.centralDepth = 20; // valor da profundidade

    // Initialize position

    const bricksTexture = new CGFtexture(scene, texturePath);

    this.helipadShader = new CGFshader(this.scene.gl, "shaders/helipad.vert", "shaders/helipad.frag");
    this.helipadShader.setUniformsValues({
      blendFactor: 0.0
    });


    this.appearance = new CGFappearance(scene);
    this.appearance.setTexture(bricksTexture);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    this.appearance.setAmbient(0.6, 0.6, 0.6, 1.0);
    this.appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.appearance.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.appearance.setShininess(10.0);

    this.cube = new MyUnitCubeQuad(scene, bricksTexture, bricksTexture, bricksTexture, bricksTexture, bricksTexture, bricksTexture);

    //this.setHelipadTexture(this.scene.helicenter);

    this.doorAppearance = new CGFappearance(scene);
    this.doorAppearance.setTexture(new CGFtexture(scene, "textures/door.png"));
    this.doorAppearance.setTextureWrap('REPEAT', 'REPEAT');
    this.doorAppearance.setAmbient(1, 1, 1, 1);
    this.doorAppearance.setDiffuse(1, 1, 1, 1);
    this.doorAppearance.setSpecular(0, 0, 0, 1);
    this.doorAppearance.setShininess(1.0);


    this.signAppearance = new CGFappearance(scene);
    this.signAppearance.setTexture(new CGFtexture(scene, "textures/bombeiros.png"));
    this.signAppearance.setTextureWrap('REPEAT', 'REPEAT');
    this.signAppearance.setAmbient(1, 1, 1, 1);
    this.signAppearance.setDiffuse(1, 1, 1, 1);
    this.signAppearance.setSpecular(0, 0, 0, 1);
    this.signAppearance.setShininess(1.0);


    this.yellowSpheres = [];
    this.emissiveMaterial = new CGFappearance(scene);
    this.emissiveMaterial.setAmbient(0.1, 0.1, 0.0, 1.0);
    this.emissiveMaterial.setDiffuse(0.4, 0.4, 0.0, 1.0);
    this.emissiveMaterial.setSpecular(0.2, 0.2, 0.0, 1.0);
    this.emissiveMaterial.setEmission(1.0, 1.0, 0.0, 1.0); // emissive yellow
    this.emissiveMaterial.setShininess(10.0);

    this.isDisplayYellowSpheres = true;
    this.initYellowSpheres();
  }

  /**
   * Initializes the yellow spheres at the top of the building.
   * These spheres are positioned at the corners of the helipad.
   * They can be displayed with a dynamic emissive effect when in maneuver.
   */
  initYellowSpheres() {
    const positions = [
      [7, 24, 7],
      [7, 24, -7],
      [-7, 24, 7],
      [-7, 24, -7]
    ];

    for (let pos of positions) {
      const sphere = new MySphere(this.scene, 20, 20, true, 0.3);
      sphere.position = { x: pos[0], y: pos[1], z: pos[2] };
      this.yellowSpheres.push(sphere);
    }

    this.baseMaterial = new CGFappearance(this.scene);
    this.baseMaterial.setAmbient(0.1, 0.1, 0.0, 1.0);
    this.baseMaterial.setDiffuse(0.4, 0.4, 0.0, 1.0);
    this.baseMaterial.setSpecular(0.2, 0.2, 0.0, 1.0);
    this.baseMaterial.setEmission(0.0, 0.0, 0.0, 1.0);
    this.baseMaterial.setShininess(10.0);

    this.dynamicEmissiveMaterial = new CGFappearance(this.scene);
    this.dynamicEmissiveMaterial.setAmbient(0.1, 0.1, 0.0, 1.0);
    this.dynamicEmissiveMaterial.setDiffuse(0.4, 0.4, 0.0, 1.0);
    this.dynamicEmissiveMaterial.setSpecular(0.2, 0.2, 0.0, 1.0);
    this.dynamicEmissiveMaterial.setShininess(10.0);
  }


  /**
   * Displays the yellow spheres at the top of the building.
   * If `timeFactor` is provided, it applies a dynamic emissive effect to the spheres.
   * @param {number} [timeFactor] - Optional time factor for dynamic emission.
   */
  displayYellowSpheres(timeFactor) {
    // Se estiver em manobra, aplicar emissão variável
    if (timeFactor !== undefined) {
      let speed = 2.0; // controla a velocidade da pulsação
      let emissionIntensity = Math.abs(Math.sin(speed * timeFactor));


      // Atualizar material emissivo dinamicamente
      this.dynamicEmissiveMaterial.setEmission(
        emissionIntensity, emissionIntensity, 0.0, 1.0);
      this.dynamicEmissiveMaterial.apply();
    } else {
      this.baseMaterial.apply();
    }


    for (let sphere of this.yellowSpheres) {
      this.scene.pushMatrix();
      this.scene.translate(sphere.position.x, sphere.position.y, sphere.position.z);
      this.dynamicEmissiveMaterial.apply();
      sphere.display();
      this.scene.popMatrix();
    }

  }




  /**
   * Returns the height of the building.
   */
  getHeight() {
    return this.numFloors * this.floorHeight;
  }

  /**
   * Sets the texture for the helipad.
   * This method creates a new CGFappearance for the helipad and applies the given texture.
   * The texture is set to repeat and the appearance properties are configured.
   * @param {*} texture 
   */
  setHelipadTexture(texture) {
    if (texture) {
      this.helipadAppearance = new CGFappearance(this.scene);
      this.helipadAppearance.setTexture(texture);
      this.helipadAppearance.setTextureWrap('REPEAT', 'REPEAT');
      this.helipadAppearance.setAmbient(1, 1, 1, 1);
      this.helipadAppearance.setDiffuse(1, 1, 1, 1);
      this.helipadAppearance.setSpecular(0, 0, 0, 1);
      this.helipadAppearance.setShininess(1.0);
    }
  }

  /**
   * Sets a dynamic texture for the building.
   * This method updates the dynamic texture used for the helipad.
   * @param {*} texture - The texture to be set as the dynamic texture.
   */
  setDynamicTexture(texture) {
    this.scene.dynamicTexture = texture;
  }

  /**
   * Sets the blend factor for the helipad shader.
   * This method updates the blend factor used in the helipad shader to control the blending effect.
   * @param {number} factor - The blend factor to be set.
   */
  setBlendFactor(factor) {
    this.currentBlendFactor = factor;
  }


  /**
   * Displays the building.
   * This method draws the central block, side blocks, door, sign, helipad, and windows.
   * It also displays the yellow spheres if they are enabled.
   */
  display() {


    if (this.isDisplayYellowSpheres)
      this.displayYellowSpheres();

    //Helipad
    this.scene.pushMatrix();
    this.scene.translate(0, this.centralHeight + 0.1, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(this.moduleWidth * 0.7, this.centralDepth * 0.7, 1);
    this.scene.setActiveShader(this.helipadShader);

    this.scene.helicenter.bind(0); // Texture H
    this.scene.dynamicTexture.bind(1); // Texture UP or DOWN

    this.helipadShader.setUniformsValues({
      uTexture1: 0,
      uTexture2: 1,
      blendFactor: this.currentBlendFactor
    });

    this.helipad.display();

    this.scene.setActiveShader(this.scene.defaultShader); // Restore
    this.scene.setDefaultAppearance(); // Restore default appearance
    this.scene.popMatrix();





    //Desenho do bloco central
    this.appearance.apply();

    this.scene.pushMatrix();
    this.scene.translate(0, this.centralHeight / 2, 0);
    this.scene.scale(this.moduleWidth, this.centralHeight, this.centralDepth);
    this.cube.display();
    this.scene.popMatrix();


    //Dimensao dos blocos laterais com 75% da profundidade do bloco central
    const sideDepth = this.centralDepth * 0.75;
    // altura dos blocos laterais
    const sideHeight = this.numFloors * this.floorHeight;

    //Bloco esquerdo
    this.scene.pushMatrix();
    this.scene.translate(-this.moduleWidth, sideHeight / 2, -(this.centralDepth - sideDepth) / 2);
    this.scene.scale(this.moduleWidth, sideHeight, sideDepth);
    this.cube.display();
    this.scene.popMatrix();

    //Bloco direito
    this.scene.pushMatrix();
    this.scene.translate(this.moduleWidth, sideHeight / 2, -(this.centralDepth - sideDepth) / 2);
    this.scene.scale(this.moduleWidth, sideHeight, sideDepth);
    this.cube.display();
    this.scene.popMatrix();

    //Porta
    this.scene.pushMatrix();
    this.doorAppearance.apply();
    this.scene.translate(0, 2, this.centralDepth / 2 + 0.1);
    this.scene.scale(3, 4, 1);
    this.door.display();
    this.scene.popMatrix();

    //Sinal
    this.scene.pushMatrix();
    this.signAppearance.apply();
    this.scene.translate(0, this.floorHeight * 0.9, this.centralDepth / 2 + 0.1);
    this.scene.scale(7, 2, 1);
    this.sign.display();
    this.scene.popMatrix();



    //Tamanho das janelas
    const windowWidth = 3;
    const windowHeight = 3;

    for (let i = 1; i < this.centralFloors; i++) {
      const y = i * this.floorHeight + this.floorHeight / 2;

      for (let j = 0; j < this.windowsPerFloor; j++) {
        const spacing = this.moduleWidth / (this.windowsPerFloor + 1);
        const x = -this.moduleWidth / 2 + (j + 1) * spacing;

        this.scene.pushMatrix();
        this.scene.translate(x, y, this.centralDepth / 2 + 0.1);
        this.scene.scale(windowWidth, windowHeight, 1);
        this.window.display();
        this.scene.popMatrix();
      }
    }


    for (let i = 0; i < this.numFloors; i++) {
      const y = i * this.floorHeight + this.floorHeight / 2;

      for (let j = 0; j < this.windowsPerFloor; j++) {
        const spacing = this.moduleWidth / (this.windowsPerFloor + 1);
        const x = -this.moduleWidth + (-this.moduleWidth / 2) + (j + 1) * spacing;

        this.scene.pushMatrix();
        this.scene.translate(x, y, -(this.centralDepth - sideDepth) / 2 + sideDepth / 2 + 0.1);
        this.scene.scale(windowWidth, windowHeight, 1);
        this.window.display();
        this.scene.popMatrix();
      }
    }

    for (let i = 0; i < this.numFloors; i++) {
      const y = i * this.floorHeight + this.floorHeight / 2;

      for (let j = 0; j < this.windowsPerFloor; j++) {
        const spacing = this.moduleWidth / (this.windowsPerFloor + 1);
        const x = this.moduleWidth + (-this.moduleWidth / 2) + (j + 1) * spacing;

        this.scene.pushMatrix();
        this.scene.translate(x, y, -(this.centralDepth - sideDepth) / 2 + sideDepth / 2 + 0.1);
        this.scene.scale(windowWidth, windowHeight, 1);
        this.window.display();
        this.scene.popMatrix();
      }
    }

  }
}
