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

  /**
   * Initializes the buffers for the cylinder.
   * Creates vertices, normals, texture coordinates, and indices for both the outer wall and the top/bottom faces.
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const angleStep = (2 * Math.PI) / this.slices;

    // OUTER WALL
    for (let stack = 0; stack <= this.stacks; stack++) {
      const z = (stack / this.stacks) * this.height;

      for (let slice = 0; slice <= this.slices; slice++) {
        const angle = slice * angleStep;
        const x = Math.cos(angle) * this.radius;
        const y = Math.sin(angle) * this.radius;

        this.vertices.push(x, y, z);
        this.normals.push(x, y, 0); // outward normal
        this.texCoords.push(slice / this.slices, stack / this.stacks);
      }
    }

    const vertsPerRow = this.slices + 1;

    for (let stack = 0; stack < this.stacks; stack++) {
      for (let slice = 0; slice < this.slices; slice++) {
        const first = stack * vertsPerRow + slice;
        const second = first + vertsPerRow;

        this.indices.push(first, first + 1, second);
        this.indices.push(second, first + 1, second + 1);
      }
    }

    const baseIndex = this.vertices.length / 3;

    for (let stack = 0; stack <= this.stacks; stack++) {
      const z = (stack / this.stacks) * this.height;

      for (let slice = 0; slice <= this.slices; slice++) {
        const angle = slice * angleStep;
        const x = Math.cos(angle) * this.radius;
        const y = Math.sin(angle) * this.radius;

        this.vertices.push(x, y, z);
        this.normals.push(-x, -y, 0); // inward normal
        this.texCoords.push(slice / this.slices, stack / this.stacks);
      }
    }

    for (let stack = 0; stack < this.stacks; stack++) {
      for (let slice = 0; slice < this.slices; slice++) {
        const first = baseIndex + stack * vertsPerRow + slice;
        const second = first + vertsPerRow;

        this.indices.push(first, second, first + 1);
        this.indices.push(second, second + 1, first + 1);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }


}
