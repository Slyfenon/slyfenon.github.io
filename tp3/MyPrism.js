import {CGFobject} from '../lib/CGF.js';

export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        let deltaAngle = (2 * Math.PI) / this.slices;

        for (let i = 0; i < this.stacks; i++) {
            let z0 = i / this.stacks; 
            let z1 = (i + 1) / this.stacks; 

            for (let j = 0; j < this.slices; j++) {
                let angle = j * deltaAngle;
                let nextAngle = (j + 1) * deltaAngle;

                let x0 = Math.cos(angle);
                let y0 = Math.sin(angle);
                let x1 = Math.cos(nextAngle);
                let y1 = Math.sin(nextAngle);

                this.vertices.push(x0, y0, z0); 
                this.vertices.push(x1, y1, z0); 
                this.vertices.push(x0, y0, z1); 
                this.vertices.push(x1, y1, z1); 

                let nx = Math.cos(angle + deltaAngle / 2);
                let ny = Math.sin(angle + deltaAngle / 2);

                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);

                let baseIndex = (i * this.slices + j) * 4;

                this.indices.push(baseIndex, baseIndex + 3, baseIndex + 2); // Triangle 1
                this.indices.push(baseIndex, baseIndex + 1, baseIndex + 3); // Triangle 2
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
