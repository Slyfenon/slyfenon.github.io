import {CGFobject} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";

/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {

	

	constructor(scene) {
		super(scene);
		
		this.diamond = new MyDiamond(scene);
    this.triangle = new MyTriangle(scene);
    this.parallelogram = new MyParallelogram(scene);
    this.triangleSmall = new MyTriangleSmall(scene);
    this.triangleSmall2 = new MyTriangleSmall(scene);
    this.triangleBig = new MyTriangleBig(scene);



	}
	
	

	display(){

		this.scene.pushMatrix();
    this.scene.translate(1.3,4.2,0);
    this.diamond.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
    this.scene.rotate(90 * (Math.PI/180) , 0,0,1);
    this.scene.translate(0,-1,0);
    this.triangleSmall.display();
    this.scene.popMatrix();
  

    this.scene.pushMatrix();
    this.scene.rotate(0 * (Math.PI/180) , 0,0,1);
    this.scene.translate(0,-1,0);
    this.triangleSmall2.display();
    this.scene.popMatrix();
  

    this.scene.pushMatrix();
    this.scene.rotate(45 * (Math.PI/180) , 0,0,1);
    this.scene.translate(0.6,0,0);
    this.triangleBig.display();
    this.scene.popMatrix();
  
    this.scene.pushMatrix();
    this.scene.rotate(180 * (Math.PI/180) , 0,0,1);
    this.scene.translate(0,2,0);
    this.triangle.display();
    this.scene.popMatrix();
  

    this.scene.pushMatrix();
    this.scene.rotate(180 * (Math.PI/180) , 0,0,1);
    this.scene.translate(0,2,0);
    this.triangle.display();
    this.scene.popMatrix();
  

    this.scene.pushMatrix();
    this.scene.translate(1,-3,0);
    this.scene.rotate(180 * (Math.PI/180) , 0,0,1);
    this.scene.scale(1,-1,1)
    this.parallelogram.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(1, 1.82,0);
    this.triangleBig.display();
    this.scene.popMatrix();
  
	}
}

