import {CGFobject} from '../lib/CGF.js';
/**
* MyPyramid
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyPyramid extends CGFobject {
    constructor(scene, slices, stacks, drawBase = true) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.drawBase = drawBase;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        for(var i = 0; i < this.slices; i++){
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa=Math.sin(ang);
            var saa=Math.sin(ang+alphaAng);
            var ca=Math.cos(ang);
            var caa=Math.cos(ang+alphaAng);

            this.vertices.push(0,1,0);
            this.vertices.push(ca, 0, -sa);
            this.vertices.push(caa, 0, -saa);

            // triangle normal computed by cross product of two edges
            var normal= [
                saa-sa,
                ca*saa-sa*caa,
                caa-ca
            ];

            // normalization
            var nsize=Math.sqrt(
                normal[0]*normal[0]+
                normal[1]*normal[1]+
                normal[2]*normal[2]
                );
            normal[0]/=nsize;
            normal[1]/=nsize;
            normal[2]/=nsize;

            // push normal once for each vertex of this triangle
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);

            this.indices.push(3*i, (3*i+1) , (3*i+2) );

            ang+=alphaAng;
            
        }
        
        if (this.drawBase) {
            ang = 0;
            const baseCenterIndex = this.vertices.length / 3;
            this.vertices.push(0, 0, 0); // centro da base
            this.normals.push(0, -1, 0); // normal para baixo

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
        }
        this.texCoords = [];

        const repeatU = 4;
        const repeatV = 2;

        for (let i = 0; i < this.slices; i++) {
            const u0 = i * repeatU / this.slices;
            const u1 = (i + 1) * repeatU / this.slices;
            const uMid = (u0 + u1) / 2;

            this.texCoords.push(uMid, 0);
            this.texCoords.push(u0, repeatV); 
            this.texCoords.push(u1, repeatV); 
        }

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


