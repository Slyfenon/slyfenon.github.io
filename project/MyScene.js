import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyWindow } from "./MyWindow.js"; 
import { MyBuilding } from "./MyBuilding.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyTerrain } from "./MyTerrain.js";
import { MyTree } from "./MyTree.js";

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

    this.tree = new MyTree(this, 15, 'Z', 2, 10, [0.2, 0.6, 0.2]);

    this.displayTerrain = true;
    this.displayPanorama = true;
    this.displayBuilding = true;
  }

  initTextures(){
    this.planeTexture = new CGFtexture(this, "./textures/grass.png");
    this.panoramaTexture = new CGFtexture(this, "./textures/panorama2.jpg")
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
      vec3.fromValues(200, 200, 200),
      vec3.fromValues(0, 0, 0)
    );
  }
  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
    }
    if (keysPressed)
      console.log(text);
  }

  update(t) {
    this.checkKeys();
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
    if(this.displayTerrain){
      this.terrain.display();
    }

    if(this.displayPanorama){
      this.panorama.display();
    }
    
    this.setActiveShader(this.defaultShader);

    if (this.displayBuilding) {
      this.pushMatrix();
      this.translate(-100, 0, -100); // 2º quadrante plano xz
      this.building.display();
      this.popMatrix();    
    }
    this.pushMatrix();
    this.tree.display();
    this.popMatrix();    


  }
}
