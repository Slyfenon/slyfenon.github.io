import { CGFobject, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyUnitCubeQuad } from "./MyUnitCubeQuad.js";
import { MyPlane } from "./MyPlane.js";

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

    const bricksTexture = new CGFtexture(scene, texturePath);

    this.appearance = new CGFappearance(scene);
    this.appearance.setTexture(bricksTexture);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    this.appearance.setAmbient(0.6, 0.6, 0.6, 1.0);
    this.appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.appearance.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.appearance.setShininess(10.0);

    this.cube = new MyUnitCubeQuad(scene, bricksTexture, bricksTexture, bricksTexture, bricksTexture, bricksTexture, bricksTexture);

    this.helipadAppearance = new CGFappearance(scene);
    this.helipadAppearance.setTexture(new CGFtexture(scene, "textures/helipad.png"));
    this.helipadAppearance.setTextureWrap('REPEAT', 'REPEAT');
    this.helipadAppearance.setAmbient(1, 1, 1, 1);
    this.helipadAppearance.setDiffuse(1, 1, 1, 1);
    this.helipadAppearance.setSpecular(0, 0, 0, 1);
    this.helipadAppearance.setShininess(1.0);

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


  }

  getHeight(){
    return this.numFloors * this.floorHeight;
  }

  display() {

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

    //Helipad
    this.scene.pushMatrix();
    this.helipadAppearance.apply();
    this.scene.translate(0, this.centralHeight + 0.1, 0); 
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);              
    this.scene.scale(this.moduleWidth * 0.7, this.centralDepth * 0.7, 1);
    this.helipad.display();
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
