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

  }

  initTextures() {
    this.planeTexture = new CGFtexture(this, "./textures/grass.png");
    this.panoramaTexture = new CGFtexture(this, "./textures/panorama2.jpg");
    this.helicopterTexture = new CGFtexture(this, "./textures/helicopter.jpg");
    this.helicenter = new CGFtexture(this, "./textures/helipad.png");
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
      2000,
      vec3.fromValues(-100, 50.89, -100),
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

    if(this.gui.isKeyPressed("KeyC")){
      this.camera.setPosition(vec3.fromValues(this.helicopter.position.x, this.helicopter.position.y + 40, this.helicopter.position.z + 40));
      this.camera.setTarget(vec3.fromValues(this.helicopter.position.x, this.helicopter.position.y, this.helicopter.position.z)); 
    }

    if (!keyPressed) {
      this.helicopter.accelerate(-5 * this.speedFactor);
    }
  }
  

  update(t) {
    const deltaTime = t - this.lastUpdateTime;
    this.lastUpdateTime = t;
  
    if (t - this.lastCounterUpdate > 1000) { 
      if (this.forest.fires.size === 0 && this.counter > 0) {
        const counterElement = document.getElementById('counter');
        if (counterElement) {
          counterElement.innerText = `YOU WIN`;
        }
      }
      else {
        this.counter--;
        this.lastCounterUpdate = t;
  
        const counterElement = document.getElementById('counter');
        if (counterElement) {
          counterElement.innerText = `Counter: ${this.counter}`;
        }

        if (this.counter <= 0) {
          counterElement.innerText = `GAME OVER`;
          this.counter = 0;
        }
      }
    }
  
    this.checkKeys();
    this.helicopter.update(deltaTime);
    this.lake.update(deltaTime);
  
    this.timeFactor = (t / 1000) % 1000;
    this.fire.shader.setUniformsValues({ timeFactor: this.timeFactor });

    // Check if the helicopter is rising and alternate the building texture
    if (this.helicopter.state === "rising") {
      if (Math.floor(t / 1000) % 2 === 0) {
        this.building.setHelipadTexture(this.helicenterUPTexture);
      } else {
        this.building.setHelipadTexture(this.helicenter);
      }
    }

    if (this.helicopter.state === "landing") {
      if (Math.floor(t / 1000) % 2 === 0) {
        this.building.setHelipadTexture(this.helicenterDownTexture);
      } else {
        this.building.setHelipadTexture(this.helicenter);
      }
    }

    if( this.helicopter.state !== "rising" && this.helicopter.state !== "landing") {
      this.building.setHelipadTexture(this.helicenter);
    }
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

  updateTerrainTexture(){
    this.terrain = new MyTerrain(this, this.selectedTerrainTexture, this.heightMap);
  }
  updateForestSeason() {
    const crownTexturePath = this.season === "Fall" ? "textures/yellow_leaves.jpg" : "textures/green_leaves.jpg";
    this.forest = new MyForest(this, this.forest.rows, this.forest.cols, crownTexturePath);
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
    if(this.displayAxis){
      this.pushMatrix();
      this.translate(0,-20, 0);
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