import { CGFobject } from "../lib/CGF.js";

export class MySphere extends CGFobject {
  constructor(scene, slices, stacks, inside = false) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.inside = inside;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // Generate vertices, normals, and texture coordinates
    for (let stack = 0; stack <= this.stacks; stack++) {
      let phi = (stack * Math.PI) / this.stacks; // Latitude angle (0 to PI)
      let cosPhi = Math.cos(phi);
      let sinPhi = Math.sin(phi);

      for (let slice = 0; slice <= this.slices; slice++) {
        let theta = (slice * 2 * Math.PI) / this.slices; // Longitude angle (0 to 2*PI)
        let cosTheta = Math.cos(theta);
        let sinTheta = Math.sin(theta);

        let x = sinPhi * cosTheta;
        let y = cosPhi;
        let z = sinPhi * sinTheta;

        let nx = x;
        let ny = y;
        let nz = z;

        if (this.inside) {
          nx = -nx;
          ny = -ny;
          nz = -nz;
        }

        this.vertices.push(x, y, z);
        this.normals.push(nx, ny, nz);
        this.texCoords.push(slice / this.slices, 1 - stack / this.stacks);
      }
    }

    // Generate indices
    for (let stack = 0; stack < this.stacks; stack++) {
      for (let slice = 0; slice < this.slices; slice++) {
        let first = stack * (this.slices + 1) + slice;
        let second = first + this.slices + 1;

        this.indices.push(first, second, first + 1);
        this.indices.push(second, second + 1, first + 1);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}
