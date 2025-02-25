import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }
  
  initBuffers() {
    this.vertices = [
      -0.5, -0.5, -0.5,	//0 F1
      0.5, -0.5, -0.5,	//1 F1
      -0.5, 0.5, -0.5,	//2 F1
      0.5, 0.5, -0.5,//3 F1


      -0.5, -0.5, 0.5,	//4
      0.5, -0.5, 0.5,	//5
      -0.5, 0.5, 0.5,	//6
      0.5, 0.5, 0.5,		//7
    ];

    //Counter-clockwise reference of vertices
    this.indices = [

      //bottom
      0, 1, 2,
      1, 3, 2,

      //top
      4, 5, 6,
      5, 7, 6,

      //front
      0, 1, 4,
      1, 5, 4,

      //back
      2, 3, 6,
      3, 7, 6,

      //left
      0, 2, 4,
      2, 6, 4,

      //right
      1, 3, 5,
      3, 7, 5,


    ];

    //The defined indices (and corresponding vertices)
    //will be read in groups of three to draw triangles
    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }
}

