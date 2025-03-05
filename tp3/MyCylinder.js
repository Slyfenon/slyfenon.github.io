import {CGFobject} from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];

        let deltaAngle = (2 * Math.PI) / this.slices;
        let stackHeight = 1 / this.stacks; // Para manter a altura total = 1

        for (let i = 0; i < this.stacks; i++) {
            let z0 = i * stackHeight; 
            let z1 = (i + 1) * stackHeight; 

            for (let j = 0; j < this.slices; j++) {
                let angle = j * deltaAngle;
                let nextAngle = (j + 1) * deltaAngle;

                let x0 = Math.cos(angle);
                let y0 = Math.sin(angle);
                let x1 = Math.cos(nextAngle);
                let y1 = Math.sin(nextAngle);

                let baseIndex = (i * this.slices + j) * 4;

                this.vertices.push(x0, y0, z0); 
                this.vertices.push(x1, y1, z0); 
                this.vertices.push(x0, y0, z1); 
                this.vertices.push(x1, y1, z1); 

                let nx0 = Math.cos(angle);
                let ny0 = Math.sin(angle);
                let nx1 = Math.cos(nextAngle);
                let ny1 = Math.sin(nextAngle);
                
                this.normals.push(nx0, ny0, 0);
                this.normals.push(nx1, ny1, 0);
                this.normals.push(nx0, ny0, 0);
                this.normals.push(nx1, ny1, 0);

                this.indices.push(baseIndex, baseIndex + 3, baseIndex + 2);
                this.indices.push(baseIndex, baseIndex + 1, baseIndex + 3);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
