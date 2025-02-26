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
      1, 0, 4,
      1, 4, 5,

      //top
      2, 3, 7,
      2, 7, 6,

      //front
      4, 5, 6,
      5, 7, 6,

      //back
      0, 1, 3,
      0, 3, 2,

      //left
      6, 4, 0,
      6, 0, 2,

      //right
      1, 5, 7,
      1, 7, 3,


    ];

    //The defined indices (and corresponding vertices)
    //will be read in groups of three to draw triangles
    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }
}

