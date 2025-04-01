import {CGFappearance, CGFobject} from '../lib/CGF.js';
import { MySphere } from './MySphere.js';

export class MyPanorama extends CGFobject {
  constructor(scene, texture) {
    super(scene);
    this.sphere = new MySphere(scene, 10, 20, true, 200);
    this.material = new CGFappearance(this.scene);
    this.material.setTexture(texture);

    this.initBuffers();
  }

  display() {
    this.scene.pushMatrix();
    //this.scene.translate(2, 2, 2);  // Adjusted to ensure visibility above terrain
    this.scene.scale(1,-1,1);
    this.material.apply();
    this.sphere.display();
    this.scene.popMatrix();
  }

}


