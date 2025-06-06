import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyWindow } from "./MyWindow.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyTerrain } from "./MyTerrain.js";
import { MyHelicopter } from "./MyHelicopter.js";
import { MyLake } from "./MyLake.js";
import { MyTree } from "./MyTree.js";
import { MyForest } from './MyForest.js';
import { MyFire } from './MyFire.js';
import { MySphere } from "./MySphere.js";

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

    document.getElementById('counter').innerText = `Counter: ${this.counter}`;
    this.counter = 90;
    this.lastCounterUpdate = 0;


    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);

    this.buildingTextureList = {
      "Bricks": "textures/bricks.png",
      "Popcorn": "textures/popcorn.png",
      "Concrete": "textures/concrete.png"
    };

    this.selectedBuildingTexture = "textures/bricks.png"; // textura inicial

    this.terrainTextureList = {
      "Grass": "textures/grass.png",
      "Terrain 1": "textures/terrain1.png"
    };

    this.selectedTerrainTexture = this.terrainTextureList["Terrain 1"];

    this.season = "Summer";

    this.window = new MyWindow(this);
    this.building = new MyBuilding(this, 60, 3, 2, this.window, this.selectedBuildingTexture);

    this.terrain = new MyTerrain(this, this.selectedTerrainTexture, this.heightMap);
    this.panorama = new MyPanorama(this, this.panoramaTexture);

    this.lake = new MyLake(this, this.waterTexture, this.heightMap);

    this.sun = new MySphere(this, 30, 30, true, 12);

    this.speedFactor = 0.3;
    this.rotationSpeed = 0.06;

    this.lastUpdateTime = 0;

    //this.tree = new MyTree(this, 15, 'X', 2, 25, [0.2, 0.6, 0.2]);
    this.forest = new MyForest(this, 4, 5);

    this.fire = new MyFire(this);

    this.helicopter = new MyHelicopter(this, this.helicopterTexture, this.building, this.forest);


    this.displayTerrain = true;
    this.displayPanorama = true;
    this.displayBuilding = true;
    this.displayForest = true;
    this.displayAxis = true;
    this.displaySun = false;


    this.blendSpeed = 1; // quanto mais alto, mais rápida a transição
    this.blend = 0;


  }

  /**
   * Initializes the textures used in the scene.
   * Sets up the textures for the plane, panorama, helicopter, helipad, height map, and water.
   */
  initTextures() {
    this.planeTexture = new CGFtexture(this, "./textures/grass.png");
    this.panoramaTexture = new CGFtexture(this, "./textures/panorama2.jpg");
    this.helicopterTexture = new CGFtexture(this, "./textures/helicopter.jpg");
    this.helicenter = new CGFtexture(this, "./textures/helipad.png");
    this.dynamicTexture = new CGFtexture(this, "./textures/helipad.png");
    this.helicenterUPTexture = new CGFtexture(this, "./textures/upHelicenter.png");
    this.helicenterDownTexture = new CGFtexture(this, "./textures/downHelicenter.png");
    this.heightMap = new CGFtexture(this, "./textures/heightMap4.jpg");
    this.waterTexture = new CGFtexture(this, "./textures/waterTexture2.png");


    this.bodyAppearance = new CGFappearance(this);
    this.bodyAppearance.setTexture(null);
    this.bodyAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.bodyAppearance.setDiffuse(0.6, 0.6, 0.6, 1);
    this.bodyAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.bodyAppearance.setShininess(10);
  }

  /**
   * Initializes the lights in the scene.
   * Sets the position, diffuse color, and enables the first light.
    */
  initLights() {
    this.lights[0].setPosition(0, 150, 0, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  /**
   * Initializes the camera for the scene.
   * Sets the camera's field of view, near and far planes, and initial position and target.
   */
  initCameras() {
    this.camera = new CGFcamera(
      90,
      0.1,
      2000,
      vec3.fromValues(-100, 50.89, -100),
      vec3.fromValues(0, 0, 0)
    );
  }


  /**
   * Checks for key presses and updates the helicopter's state accordingly.
   * Handles acceleration, deceleration, turning, resetting the helicopter,
   * and camera position adjustments based on key inputs.
   */
  checkKeys() {


    let keyPressed = false;

    if (this.gui.isKeyPressed("KeyW")) {
      this.helicopter.accelerate(5 * this.speedFactor);
      keyPressed = true;
    }
    if (this.gui.isKeyPressed("KeyS")) {
      this.helicopter.decelerate(5 * this.speedFactor);
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
    if (this.gui.isKeyPressed("KeyO")) {
      this.helicopter.handleKeyPress("O");
      keyPressed = true;
    }

    if (this.gui.isKeyPressed("KeyL")) {
      this.helicopter.handleKeyPress("L");
      keyPressed = true;
    }

    if (this.gui.isKeyPressed("KeyP")) {
      this.helicopter.handleKeyPress("P");
      keyPressed = true;
    }

    if (this.gui.isKeyPressed("KeyC")) {
      this.camera.setPosition(vec3.fromValues(this.helicopter.position.x, this.helicopter.position.y + 40, this.helicopter.position.z + 40));
      this.camera.setTarget(vec3.fromValues(this.helicopter.position.x, this.helicopter.position.y, this.helicopter.position.z));
    }

    if (!keyPressed) {
      this.helicopter.decelerate(5 * this.speedFactor);
    }
  }


  /**
   * Updates the scene based on the elapsed time.
   * Calculates the time delta since the last update, checks for key presses,
   * updates the helicopter and lake, and manages the building's texture and yellow spheres.
   * Also limits the camera position to specific values.
   * @param {number} t - The current time in milliseconds.
   */
  update(t) {
    const deltaTime = t - this.lastUpdateTime;
    this.lastUpdateTime = t;
    const counterElement = document.getElementById('counter');
    if (counterElement) {
      const keys = ["KeyW", "KeyA", "KeyS", "KeyD", "KeyR", "KeyO", "KeyL", "KeyP", "KeyC"];
      let pressedKey = null;
      for (const key of keys) {
        if (this.gui.isKeyPressed(key)) {
          pressedKey = key.replace("Key", "");
          break;
        }
      }
      if (pressedKey)
        counterElement.innerText = `Key pressed: ${pressedKey}`;
    }

    this.checkKeys();
    this.helicopter.update(deltaTime);
    this.lake.update(deltaTime);

    this.timeFactor = (t / 1000) % 1000;

    if (this.helicopter.state === "rising" || this.helicopter.state === "landing") {
      this.building.displayYellowSpheres(this.timeFactor); // Passa o tempo
    } else {
      this.building.displayYellowSpheres(); // Sem pulsação
    }

    if (this.helicopter.state === "rising") {
      this.building.setDynamicTexture(this.helicenterUPTexture);
      this.blend = 0.5 + 0.5 * Math.sin(t / 1000 * this.blendSpeed * Math.PI);
    } else if (this.helicopter.state === "landing") {
      this.building.setDynamicTexture(this.helicenterDownTexture);
      this.blend = 0.5 + 0.5 * Math.sin(t / 1000 * this.blendSpeed * Math.PI);
    } else {
      this.blend = 0.0;
    }

    this.building.setBlendFactor(this.blend);


    // Limit the camera position to specific values
    if (this.camera.position[0] > 200 || this.camera.position[0] < -200 ||
      this.camera.position[1] > 150 || this.camera.position[1] < 10 ||
      this.camera.position[2] > 200 || this.camera.position[2] < -200) {
      const clampedX = Math.max(-200, Math.min(200, this.camera.position[0]));
      const clampedY = Math.max(10, Math.min(150, this.camera.position[1]));
      const clampedZ = Math.max(-200, Math.min(200, this.camera.position[2]));
      this.camera.setPosition(vec3.fromValues(clampedX, clampedY, clampedZ));
    }
  }


  /**
   * Sets the default appearance for the scene.
   * Applies ambient, diffuse, and specular colors, and sets the shininess.
   */
  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  /**
   * Updates the building's texture based on the selected texture.
   * Creates a new MyBuilding instance with the selected texture.
   */
  updateBuildingTexture() {
    this.building = new MyBuilding(this, 60, 3, 2, this.window, this.selectedBuildingTexture);
  }

  /**
   * Updates the terrain texture based on the selected texture.
   * Creates a new MyTerrain instance with the selected texture and height map.
   */
  updateTerrainTexture() {
    this.terrain = new MyTerrain(this, this.selectedTerrainTexture, this.heightMap);
  }

  /**
   * Updates the season of the forest.
   * Changes the crown texture based on the current season.
   * Creates a new MyForest instance with the updated crown texture.
   */
  updateForestSeason() {
    const crownTexturePath = this.season === "Fall" ? "textures/yellow_leaves.jpg" : "textures/green_leaves.jpg";
    this.forest = new MyForest(this, this.forest.rows, this.forest.cols, crownTexturePath);
  }

  /**
   * Displays all objects in the scene.
   */
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

    if (this.displaySun) {
      this.pushMatrix();
      this.translate(this.lights[0].position[0], this.lights[0].position[1], this.lights[0].position[2]);
      this.sun.display();
      this.popMatrix();
    }

    // Draw axis
    if (this.displayAxis) {
      this.pushMatrix();
      this.translate(0, -20, 0);
      this.axis.display();
      this.popMatrix();
    }

    this.setDefaultAppearance();

    //Plane Display
    if (this.displayTerrain) {
      this.terrain.display();
    }

    if (this.displayPanorama) {
      this.panorama.display();
    }

    this.lake.display();

    this.bodyAppearance.apply();
    this.helicopter.display();

    this.setActiveShader(this.defaultShader);

    if (this.displayBuilding) {
      this.pushMatrix();
      this.translate(-100, 4, -100); // 2º quadrante plano xz
      this.building.display();
      this.popMatrix();
    }

    if (this.displayForest) {
      this.pushMatrix();
      this.translate(25, 4, -125); // 2º quadrante plano xz
      this.forest.display();
      this.popMatrix();
    }

  }
}