import {CGFobject} from '../lib/CGF.js';

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
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        for(var i = 0; i < this.slices; i++){

            this.vertices.push(Math.cos(ang), 0, -Math.sin(ang));
            this.indices.push(i, (i+1) % this.slices, this.slices);
            this.normals.push(Math.cos(ang), Math.cos(Math.PI/4.0), -Math.sin(ang));
            ang+=alphaAng;
        }
        this.vertices.push(0,1,0);
        this.normals.push(0,1,0);

        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0); // centro da base
        this.normals.push(0, -1, 0); // normal para baixo

        ang = 0;
        for (let i = 0; i < this.slices; i++) {
            const x = Math.cos(ang);
            const z = -Math.sin(ang);
            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0);
            ang += alphaAng;
        }

        for (let i = 0; i < this.slices; i++) {
            const center = baseCenterIndex;
            const v1 = baseCenterIndex + 1 + i;
            const v2 = baseCenterIndex + 1 + ((i + 1) % this.slices);
            this.indices.push(center, v2, v1); // sentido horário invertido
        }

        this.texCoords = [];

    for (let i = 0; i < this.slices; i++) {
        this.texCoords.push(i / this.slices, 1);
    }
    this.texCoords.push(0.5, 0);

    this.texCoords.push(0.5, 0.5);

    ang = 0;
    for (let i = 0; i < this.slices; i++) {
        const x = Math.cos(ang);
        const z = -Math.sin(ang);
        this.texCoords.push(0.5 + x * 0.5, 0.5 + z * 0.5);
        ang += alphaAng;
    }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
    
}


