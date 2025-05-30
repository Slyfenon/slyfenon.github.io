import { CGFobject } from '../lib/CGF.js';

export class MyCircle extends CGFobject {
  constructor(scene, slices = 32, radius = 1) {
    super(scene);
    this.slices = slices;
    this.radius = radius;
    this.initBuffers();
  }

  /**
   * Initializes the buffers for the circle.
   * Creates vertices, normals, texture coordinates, and indices for both front and back faces.
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    const angleStep = (2 * Math.PI) / this.slices;

    // Center vertex
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    // Circle vertices
    for (let i = 0; i <= this.slices; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;

      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1);
      this.texCoords.push(0.5 + 0.5 * x / this.radius, 0.5 + 0.5 * y / this.radius);
    }

    // Indices for the front face
    for (let i = 1; i <= this.slices; i++) {
      this.indices.push(0, i, i + 1);
    }

    // Add vertices, normals, and texCoords for the back face
    const offset = this.vertices.length / 3; // Offset for back face indices
    this.vertices.push(0, 0, 0); // Center vertex for back face
    this.normals.push(0, 0, -1);
    this.texCoords.push(0.5, 0.5);

    for (let i = 0; i <= this.slices; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * this.radius;
      const y = Math.sin(angle) * this.radius;

      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, -1);
      this.texCoords.push(0.5 + 0.5 * x / this.radius, 0.5 + 0.5 * y / this.radius);
    }

    // Indices for the back face
    for (let i = 1; i <= this.slices; i++) {
      this.indices.push(offset, offset + i + 1, offset + i);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

}
