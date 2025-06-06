import { CGFappearance, CGFobject, CGFshader, CGFtexture } from '../lib/CGF.js';
import { MyPlane } from './MyPlane.js';

export class MyLake extends CGFobject {
  constructor(scene, waterTexture, heightMap) {
    super(scene);
    this.plane = new MyPlane(this.scene, 64);

    this.lakeTexture = waterTexture;
    this.heightMap = heightMap;

    this.waterShader = new CGFshader(
      this.scene.gl,
      "./shaders/lake.vert",
      "./shaders/lake.frag"
    );

    this.lakeMaterial = new CGFappearance(this.scene);
    this.lakeMaterial.setTexture(this.lakeTexture);

    this.waterShader.setUniformsValues({
      uSampler2: 1,
      uScaleFactor: 5,
      uTime: 0.0
    });

    this.time = 0.0;
  }

  /**
   * Updates the time uniform in the water shader.
   * The time is incremented based on the elapsed time since the last update.
   * @param {number} time - The elapsed time since the last update in milliseconds.
   */
  update(time) {
    this.time += time / 500 % 100;
    //console.log("Time: ", this.time);  
    this.waterShader.setUniformsValues({
      uTime: this.time
    });
  }

  /**
   * Displays the lake object.
   */
  display() {
    this.scene.pushMatrix();

    this.scene.translate(-19, 11, 17);
    this.scene.scale(100, 1, 100);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);

    this.scene.setActiveShader(this.waterShader);

    this.lakeTexture.bind(0);
    this.heightMap.bind(1);

    this.lakeMaterial.apply();

    this.plane.display();

    this.scene.setActiveShader(this.scene.defaultShader);

    this.scene.popMatrix();
  }
}
