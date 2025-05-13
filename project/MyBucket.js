import { MyCylinder } from "./MyCylinder.js";
import { CGFobject } from '../lib/CGF.js';


export class MyBucket extends CGFobject {
  constructor(scene) {
    super(scene);
    this.body = new MyCylinder(scene, 20, 20, 1, 2);
  }

  display() {
    this.scene.pushMatrix();
    this.scene.scale(1, 1.5, 1);
    this.body.display();
    this.scene.popMatrix();
  }
}
