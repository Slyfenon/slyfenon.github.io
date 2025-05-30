import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, topTexture, frontTexture, rightTexture, backTexture, leftTexture, bottomTexture) {
        super(scene);
        this.quad = new MyQuad(scene);

        this.materials = {
            top: new CGFappearance(scene),
            front: new CGFappearance(scene),
            right: new CGFappearance(scene),
            back: new CGFappearance(scene),
            left: new CGFappearance(scene),
            bottom: new CGFappearance(scene)
        };

        this.materials.top.setTexture(topTexture);
        this.materials.front.setTexture(frontTexture);
        this.materials.right.setTexture(rightTexture);
        this.materials.back.setTexture(backTexture);
        this.materials.left.setTexture(leftTexture);
        this.materials.bottom.setTexture(bottomTexture);

        for (let key in this.materials) {
            this.materials[key].setTextureWrap('REPEAT', 'REPEAT');
        }

        //just to see better
        for (let key in this.materials) {
            this.materials[key].setAmbient(0.4, 0.4, 0.4, 1.0);
            this.materials[key].setDiffuse(1.0, 1.0, 1.0, 1.0);
            this.materials[key].setShininess(10.0);
        }

    }

    /**
     * Displays the cube with different textures on each face.
     * Each face is displayed using a quad with the corresponding texture applied.
     */
    display() {

        // Top face
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.materials.top.apply();
        //this.scene.updateTextureFiltering();
        this.quad.display();
        this.scene.popMatrix();

        // Front face
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.materials.front.apply();
        //this.scene.updateTextureFiltering();
        this.quad.display();
        this.scene.popMatrix();

        // Back face
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.materials.back.apply();
        //this.scene.updateTextureFiltering();
        this.quad.display();
        this.scene.popMatrix();

        // Left face
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.materials.left.apply();
        //this.scene.updateTextureFiltering();
        this.quad.display();
        this.scene.popMatrix();

        // Right face
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.materials.right.apply();
        //this.scene.updateTextureFiltering();
        this.quad.display();
        this.scene.popMatrix();

        // Bottom face
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.materials.bottom.apply();
        //this.scene.updateTextureFiltering();
        this.quad.display();
        this.scene.popMatrix();
    }
}

