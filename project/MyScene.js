import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyWindow } from "./MyWindow.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyTerrain } from "./MyTerrain.js";
import { MyHelicopter } from "./MyHelicopter.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);


    this.enableTextures(true);
    this.initTextures();
    this.appearance = new CGFappearance(this);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');


    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);

    this.buildingTextureList = {
      "Bricks": "textures/bricks.png",
      "Popcorn": "textures/popcorn.png",
      "Concrete": "textures/concrete.png"
    };

    this.selectedBuildingTexture = "textures/bricks.png"; // textura inicial

    this.window = new MyWindow(this);
    this.building = new MyBuilding(this, 60, 3, 2, this.window, this.selectedBuildingTexture);

    this.terrain = new MyTerrain(this);
    this.panorama = new MyPanorama(this, this.panoramaTexture);


    this.helicopter = new MyHelicopter(this);
    this.speedFactor = 0.3;
    this.rotationSpeed = 0.06;

    this.lastUpdateTime = 0;


    this.displayTerrain = true;
    this.displayPanorama = true;
    this.displayBuilding = true;
  }

  initTextures() {
    this.planeTexture = new CGFtexture(this, "./textures/grass.png");
    this.panoramaTexture = new CGFtexture(this, "./textures/panorama2.jpg")

    this.bodyAppearance = new CGFappearance(this);
    this.bodyAppearance.setTexture(null);
    this.bodyAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.bodyAppearance.setDiffuse(0.6, 0.6, 0.6, 1);
    this.bodyAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.bodyAppearance.setShininess(10);
  }

  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      90,
      0.1,
      1000,
      vec3.fromValues(-10.79, 50.89, 26.54),
      vec3.fromValues(0, 0, 0)
    );
  }

  
  checkKeys() {


    let keyPressed = false;

    if (this.gui.isKeyPressed("KeyW")) {
      this.helicopter.accelerate(5 * this.speedFactor);
      keyPressed = true;
    }
    if (this.gui.isKeyPressed("KeyS")) {
      this.helicopter.accelerate(-5 * this.speedFactor);
      keyPressed = true;
    }
    if (this.gui.isKeyPressed("KeyA")) {
      this.helicopter.turn(this.rotationSpeed);
      keyPressed = true;
    }
    if (this.gui.isKeyPressed("KeyD")) {
      this.helicopter.turn(-this.rotationSpeed);
      keyPressed = true;
    }
    if (this.gui.isKeyPressed("KeyR")) {
      this.helicopter.reset();
      keyPressed = true;
    }
    if (this.gui.isKeyPressed("KeyP")) {
      this.helicopter.ascend();
      keyPressed = true;
    }
    if (this.gui.isKeyPressed("KeyL")) {
      this.helicopter.descend();
      keyPressed = true;
    }

    if (!keyPressed) {
      this.helicopter.accelerate(-5 * this.speedFactor);
    }
  }
  

  update(t) {
    const deltaTime = t - this.lastUpdateTime;
    this.lastUpdateTime = t;

    this.checkKeys();
    this.helicopter.update(deltaTime);
    //Adjusting camera position
    //console.log("Camera position:", this.camera.position);
  }


  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  updateBuildingTexture() {
    this.building = new MyBuilding(this, 60, 3, 2, this.window, this.selectedBuildingTexture);
  }

  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    this.axis.display();

    this.setDefaultAppearance();

    //Plane Display
    if (this.displayTerrain) {
      this.terrain.display();
    }

    if (this.displayPanorama) {
      this.panorama.display();
    }

    this.bodyAppearance.apply();
    this.helicopter.display();

    this.setActiveShader(this.defaultShader);

    if (this.displayBuilding) {
      this.pushMatrix();
      this.translate(-100, 0, -100); // 2º quadrante plano xz
      this.building.display();
      this.popMatrix();
    }

  }
}
