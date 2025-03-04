import { CGFobject } from "../lib/CGF.js";

/**
 * MyParallelogram
 * @constructor
 * @param scene
 */
export class MyParallelogram extends CGFobject{
  constructor(scene){
    super(scene);
    this.initBuffers();
  }

  initBuffers(){
    this.vertices = [
      0, 0, 0, 
      1, 1, 0,
      3, 1, 0,
      2, 0, 0
    ];

    this.normals = [
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1
    ];

    this.indices = [
      0, 2, 1,
      0, 3, 2,
      0 ,1, 2,
      0, 2, 3
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    
    this.initGLBuffers();
  }
}