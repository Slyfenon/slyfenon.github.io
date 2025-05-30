import { CGFobject } from '../lib/CGF.js';

/**
* MyCone
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyCone extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    /**
     * Initializes the buffers for the cone.
     * Creates vertices, normals, texture coordinates, and indices for the cone.
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let alphaAng = 2 * Math.PI / this.slices;
        let index = 0;

        for (let i = 0; i < this.slices; i++) {
            let ang = i * alphaAng;
            let nextAng = ang + alphaAng;

            let x1 = Math.cos(ang);
            let z1 = -Math.sin(ang);
            let x2 = Math.cos(nextAng);
            let z2 = -Math.sin(nextAng);

            this.vertices.push(x1, 0, z1);
            this.vertices.push(x2, 0, z2);
            this.vertices.push(0, 1, 0);

            let normalize = (v) => {
                let len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
                return v.map((c) => c / len);
            };

            let normal1 = normalize([x1, Math.cos(Math.PI / 4), z1]);
            let normal2 = normalize([x2, Math.cos(Math.PI / 4), z2]);
            let normalTop = normalize([(x1 + x2) / 2, Math.cos(Math.PI / 4), (z1 + z2) / 2]);

            this.normals.push(...normal1);
            this.normals.push(...normal2);
            this.normals.push(...normalTop);

            let u0 = i / this.slices;
            let u1 = (i + 1) / this.slices;
            this.texCoords.push(u0, 1);
            this.texCoords.push(u1, 1);
            this.texCoords.push((u0 + u1) / 2, 0);

            this.indices.push(index, index + 1, index + 2);
            index += 3;
        }

        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);

        let ang = 0;
        for (let i = 0; i < this.slices; i++) {
            let x = Math.cos(ang);
            let z = -Math.sin(ang);
            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0);
            this.texCoords.push(0.5 + x * 0.5, 0.5 + z * 0.5);
            ang += alphaAng;
        }

        for (let i = 0; i < this.slices; i++) {
            let center = baseCenterIndex;
            let v1 = baseCenterIndex + 1 + i;
            let v2 = baseCenterIndex + 1 + ((i + 1) % this.slices);
            this.indices.push(center, v2, v1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }

}


