import { CGFobject } from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
  constructor(scene, slices = 20, stacks = 1, radius = 1, height = 1) {
    super(scene);
    this.slices = slices;     
    this.stacks = stacks;    
    this.radius = radius;     
    this.height = height;     

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const angleStep = (2 * Math.PI) / this.slices;
    
    for (let stack = 0; stack <= this.stacks; stack++) {
      const z = (stack / this.stacks) * this.height; 

      for (let slice = 0; slice <= this.slices; slice++) {
        const angle = slice * angleStep;
        const x = Math.cos(angle) * this.radius;  
        const y = Math.sin(angle) * this.radius;  

        this.vertices.push(x, y, z);

        if (z === 0) {
          this.normals.push(0, 0, -1);  
        } else if (z === this.height) {
          this.normals.push(0, 0, 1);   
        } else {
          this.normals.push(x, y, 0);   
        }

        this.texCoords.push(slice / this.slices, stack / this.stacks);
      }
    }

    for (let stack = 0; stack < this.stacks; stack++) {
      for (let slice = 0; slice < this.slices; slice++) {
        const first = stack * (this.slices + 1) + slice;
        const second = first + this.slices + 1;

        this.indices.push(first, second, first + 1);    
        this.indices.push(second, second + 1, first + 1);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
