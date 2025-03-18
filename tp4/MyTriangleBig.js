import { CGFobject } from "../lib/CGF.js";

/**
 * MyTriangleBig
 * @constructor
 * @param scene
 */
export class MyTriangleBig extends CGFobject{
  constructor(scene){
    super(scene);
    this.initBuffers();
  }

  initBuffers(){
    this.vertices = [
      -2, 0, 0,
       0, 2, 0,
       2, 0, 0
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.indices = [
      0, 2, 1
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    
    this.initGLBuffers();
  }
}