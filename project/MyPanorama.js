import {CGFappearance, CGFobject} from '../lib/CGF.js';
import { MySphere } from './MySphere.js';

export class MyPanorama extends CGFobject {
  constructor(scene, texture) {
    super(scene);
    this.sphere = new MySphere(scene, 20, 30, true, 200);
    this.material = new CGFappearance(this.scene);
    this.material.setTexture(texture);

    this.initBuffers();
  }

  display() {
    this.scene.pushMatrix();
    this.scene.translate(this.scene.camera.position[0], this.scene.camera.position[1], this.scene.camera.position[2]) 
    this.scene.scale(1,-1,1);
    this.material.apply();
    this.sphere.display();
    this.scene.popMatrix();
  }

}


