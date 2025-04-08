import {CGFappearance, CGFobject, CGFshader, CGFtexture} from '../lib/CGF.js';
import { MyPlane } from './MyPlane.js';
/**
* MyPlane
* @constructor
 * @param scene - Reference to MyScene object
 * @param nDivs - number of divisions in both directions of the surface
 * @param minS - minimum texture coordinate in S
 * @param maxS - maximum texture coordinate in S
 * @param minT - minimum texture coordinate in T
 * @param maxT - maximum texture coordinate in T
*/
export class MyTerrain extends CGFobject {
	constructor(scene) {
		super(scene);
		this.plane = new MyPlane(this.scene, 64);
    this.planeMaterial = new CGFappearance(this.scene);
    this.planeTexture = new CGFtexture(this.scene, "./textures/grass.png");
    this.planeMaterial.setTexture(this.planeTexture);
    this.terrainShader = new CGFshader(this.scene.gl, "./shaders/plane.vert", "./shaders/plane.frag");


		this.initBuffers();
	}

	display() {
    this.scene.pushMatrix();
    this.scene.scale(400, 1, 400);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.setActiveShader(this.terrainShader);
    this.planeTexture.bind(0);
    this.plane.display();
    this.scene.popMatrix();
  }

}


