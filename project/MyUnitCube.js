import { CGFobject } from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    /**
     * Initializes the buffers for the cube.
     * Creates vertices, normals, and indices for the cube.
     */
    initBuffers() {
        this.vertices = [
            // Front face
            0.5, 0.5, 0.5,	    //0
            -0.5, 0.5, 0.5,	    //1
            -0.5, -0.5, 0.5,	//2
            0.5, -0.5, 0.5,	    //3

            // Back face
            0.5, 0.5, -0.5,	    //4
            -0.5, 0.5, -0.5,	//5
            -0.5, -0.5, -0.5,	//6
            0.5, -0.5, -0.5,	//7
        ];

        this.normals = [
            // Front face
            0, 0, 1,    //0
            0, 0, 1,    //1
            0, 0, 1,    //2
            0, 0, 1,    //3

            // Back face
            0, 0, -1,   //4
            0, 0, -1,   //5
            0, 0, -1,   //6
            0, 0, -1,   //7

            // Top face
            0, 1, 0,    //4
            0, 1, 0,    //5
            0, 1, 0,    //1
            0, 1, 0,    //0

            // Bottom face
            0, -1, 0,   //2
            0, -1, 0,   //6
            0, -1, 0,   //3
            0, -1, 0,   //7

            // Right face
            1, 0, 0,    //0
            1, 0, 0,    //3
            1, 0, 0,    //7
            1, 0, 0,    //4

            // Left face
            -1, 0, 0,   //1
            -1, 0, 0,   //5
            -1, 0, 0,   //2
            -1, 0, 0,   //6
        ];


        //Counter-clockwise reference of vertices
        this.indices = [
            // Front face
            0, 1, 2,
            2, 3, 0,

            // Back face
            4, 6, 5,
            6, 4, 7,

            // Top face
            4, 5, 1,
            0, 4, 1,

            // Bottom face
            2, 6, 3,
            7, 3, 6,

            // Right face
            0, 3, 7,
            0, 7, 4,

            // Left face
            1, 5, 2,
            2, 5, 6

        ];


        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

