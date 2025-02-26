import {CGFobject} from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";


/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {

	

	constructor(scene) {
		super(scene);
		
    this.quad = new MyQuad(scene);


	}
	
	

	display(){
      // Front face
      this.scene.pushMatrix();
      this.scene.translate(0, 0, 0.5);
      this.quad.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0, 0, -0.5);
      this.quad.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(-0.5, 0, 0);
      this.scene.rotate(-90 * (Math.PI/180) , 0,1,0);
      this.quad.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0.5, 0, 0);
      this.scene.rotate(90 * (Math.PI/180) , 0,1,0);
      this.quad.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0, 0.5, 0);
      this.scene.rotate(-90 * (Math.PI/180) , 1,0,0);
      this.quad.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0, -0.5, 0);
      this.scene.rotate(90 * (Math.PI/180) , 1,0,0);
      this.quad.display();
      this.scene.popMatrix();







     

	}
}

