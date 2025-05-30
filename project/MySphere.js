import { CGFobject } from "../lib/CGF.js";

/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - Number of divisions around the Y axis
 * @param stacks - Number of divisions HALF the sphere, from equator to pole
 * @param inside - Optional boolean, if true flips normals and winding order (default=false)
 * @param radius - Optional sphere radius (default=1)
 */
export class MySphere extends CGFobject {
  constructor(scene, slices, stacks, inside = false, radius = 1) {
    super(scene);
    this.slices = slices; // divisions around Y
    this.stacks = stacks; // divisions from equator to pole (half sphere)
    this.inside = inside; // render inside?
    this.radius = radius; // sphere radius

    this.initBuffers();
  }

  /**
   * Initializes the buffers for the sphere.
   * Creates vertices, normals, texture coordinates, and indices for the sphere.
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // Total number of stacks from North Pole to South Pole
    const totalStacks = this.stacks * 2;

    // Angle increment per stack (latitude)
    const deltaPhi = Math.PI / totalStacks; // Angle step from pole to pole (0 to PI)

    // Angle increment per slice (longitude)
    const deltaTheta = (2 * Math.PI) / this.slices; // Angle step around Y axis (0 to 2*PI)

    // Generate vertices, normals, and texture coordinates
    // Iterate from North Pole (stack = 0) to South Pole (stack = totalStacks)
    for (let j = 0; j <= totalStacks; j++) {
      const phi = j * deltaPhi; // Current latitude angle (0 at North Pole, PI at South Pole)
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      // Iterate around the Y axis
      for (let i = 0; i <= this.slices; i++) {
        const theta = i * deltaTheta; // Current longitude angle
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        // Calculate vertex position (radius is applied here)
        const x = this.radius * sinPhi * cosTheta;
        const y = this.radius * cosPhi; // Y is up/down
        const z = this.radius * sinPhi * sinTheta;
        this.vertices.push(x, y, z);

        let nx = x;
        let ny = y;
        let nz = z;

        // Flip normals if rendering the inside
        if (this.inside) {
          nx = -nx;
          ny = -ny;
          nz = -nz;
        }
        this.normals.push(nx, ny, nz);

        // Calculate texture coordinates
        // u corresponds to longitude (slices), v corresponds to latitude (stacks)
        const u = i / this.slices;
        const v = 1 - (j / totalStacks); // V goes from 1 (North Pole) to 0 (South Pole)
        this.texCoords.push(u, v);
      }
    }

    // Generate indices for triangles
    // Iterate through stacks (j) and slices (i) to form triangles/quads
    for (let j = 0; j < totalStacks; j++) { // Iterate up to totalStacks - 1
      for (let i = 0; i < this.slices; i++) { // Iterate up to slices - 1
        // Indices of the 4 vertices forming the current quad patch
        // v1---v4
        // | \ |
        // v2---v3
        const v1 = j * (this.slices + 1) + i;
        const v2 = (j + 1) * (this.slices + 1) + i;
        const v3 = (j + 1) * (this.slices + 1) + (i + 1);
        const v4 = j * (this.slices + 1) + (i + 1);

        // --- Handling Poles ---
        // Top Cap (j = 0): Form triangles connecting pole vertices (j=0) to the first ring (j=1)
        if (j === 0) {
          // Only need one triangle: (v1, v2, v3) -> connects pole vertex v1/v4 to v2, v3 on the ring below
           if (!this.inside) {
                this.indices.push(v1, v2, v3);
            } else {
                this.indices.push(v1, v3, v2); // Reverse winding for inside view
            }
        }
        // Bottom Cap (j = totalStacks - 1): Form triangles connecting the last ring (j=totalStacks-1) to pole vertices (j=totalStacks)
        else if (j === totalStacks - 1) {
           // Only need one triangle: (v1, v2, v4) -> connects v1, v4 on the ring above to pole vertex v2/v3
           // Note: v2 and v3 are distinct vertices at the south pole. We use v1, v2, v4.
            if (!this.inside) {
                this.indices.push(v1, v2, v4);
            } else {
                this.indices.push(v1, v4, v2); 
            }
        }
        else {
          if (!this.inside) {
            this.indices.push(v1, v2, v4);
            this.indices.push(v2, v3, v4);
          } else {
            this.indices.push(v1, v4, v2);
            this.indices.push(v2, v4, v3);
          }
        }
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}