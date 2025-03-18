import {CGFobject, CGFappearance} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        
        this.diamond = new MyDiamond(scene);
        this.triangle = new MyTriangle(scene);
        this.parallelogram = new MyParallelogram(scene);
        
        this.triangleSmall1 = new MyTriangleSmall(scene);
        this.triangleSmall2 = new MyTriangleSmall(scene);
        this.triangleSmall2.updateTexCoords = function(texCoords) {
            this.texCoords = texCoords;
            this.updateTexCoordsGLBuffers();
        };
        
        this.triangleBig1 = new MyTriangleBig(scene);
        this.triangleBig1.updateTexCoords = function(texCoords){
            this.texCoords = texCoords;
            this.updateTexCoordsGLBuffers();
        }
        this.triangleBig2 = new MyTriangleBig(scene);
        this.triangleBig2.updateTexCoords = function(texCoords){
            this.texCoords = texCoords;
            this.updateTexCoordsGLBuffers();
        }
        //Texture 
        this.texture = new CGFappearance(this.scene);
        this.texture.setAmbient(0.1, 0.1, 0.1, 1);
        this.texture.setDiffuse(0.9, 0.9, 0.9, 1);
        this.texture.setSpecular(0.1, 0.1, 0.1, 1);
        this.texture.setShininess(10.0);
        this.texture.loadTexture("images/tangram.png");
        this.texture.setTextureWrap('REPEAT', 'REPEAT');


        this.initMaterials();
    }

    initMaterials(){
        this.diamondMaterial = new CGFappearance(this.scene);
        this.diamondMaterial.setAmbient(0, 0, 0, 1);
        this.diamondMaterial.setDiffuse(0.0, 1.0, 0.0, 1); // Green diffuse
        this.diamondMaterial.setSpecular(0.1, 1.0, 0.1, 1);
        this.diamondMaterial.setShininess(10.0);

        this.triangleMaterial = new CGFappearance(this.scene);
        this.triangleMaterial.setAmbient(0, 0, 0, 1);
        this.triangleMaterial.setDiffuse(1.0, 0.0, 1.0, 1); // Pink diffuse
        this.triangleMaterial.setSpecular(1.0, 0.75, 0.8, 1);
        this.triangleMaterial.setShininess(10.0);

        this.parallelogramMaterial = new CGFappearance(this.scene);
        this.parallelogramMaterial.setAmbient(0, 0, 0, 1);
        this.parallelogramMaterial.setDiffuse(1.0, 1.0, 0.0, 1); // Yellow diffuse
        this.parallelogramMaterial.setSpecular(1.0, 1.0, 0.0, 1);
        this.parallelogramMaterial.setShininess(10.0);

        this.triangleSmall1Material = new CGFappearance(this.scene);
        this.triangleSmall1Material.setAmbient(0, 0, 0, 1);
        this.triangleSmall1Material.setDiffuse(1.0, 0.0, 0.0, 1); // Red diffuse
        this.triangleSmall1Material.setSpecular(1.0, 0.1, 0.1, 1);
        this.triangleSmall1Material.setShininess(10.0);

        this.triangleSmall2Material = new CGFappearance(this.scene);
        this.triangleSmall2Material.setAmbient(0, 0, 0, 1);
        this.triangleSmall2Material.setDiffuse(0.5, 0.0, 0.5, 1); // Purple diffuse
        this.triangleSmall2Material.setSpecular(0.5, 0.1, 0.5, 1);
        this.triangleSmall2Material.setShininess(10.0);

        this.triangleBig1Material = new CGFappearance(this.scene);
        this.triangleBig1Material.setAmbient(0, 0, 0, 1);
        this.triangleBig1Material.setDiffuse(1.0, 0.5, 0.0, 1); // Orange diffuse
        this.triangleBig1Material.setSpecular(1.0, 0.5, 0.0, 1);
        this.triangleBig1Material.setShininess(10.0);

        this.triangleBig2Material = new CGFappearance(this.scene);
        this.triangleBig2Material.setAmbient(0, 0, 0, 1);
        this.triangleBig2Material.setDiffuse(0.2, 0.2, 1.0, 1); // Blue diffuse
        this.triangleBig2Material.setSpecular(0.4, 0.4, 1.0, 1);
        this.triangleBig2Material.setShininess(10.0);
    
    }
    
    display(){        

        this.scene.pushMatrix();
        this.scene.translate(0.45,-0.45,0)
        this.scene.translate(1, Math.sqrt(8) + 2, 0);
        this.texture.apply();
        this.diamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.texture.apply();
        this.triangleSmall1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1, 0);
        this.triangleSmall2.updateTexCoords([0,0,0.25,0.25,0,0.5]);
        this.texture.apply();
        this.triangleSmall2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2, -2, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.texture.apply();
        this.parallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -2, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.texture.apply();
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1,-1,0);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.scene.translate(2,0,0);
        this.triangleBig1.updateTexCoords([1,1,0.5,0.5,1,0]);
        this.texture.apply();
        this.triangleBig1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, Math.sqrt(8) - 1, 0);
        this.triangleBig2.updateTexCoords([1,0,0.5,0.5,0,0]);
        this.texture.apply();
        this.triangleBig2.display();
        this.scene.popMatrix();


    }

    enableNormalViz(){
        this.diamond.enableNormalViz()
        this.triangle.enableNormalViz()
        this.triangleBig1.enableNormalViz()
        this.triangleBig2.enableNormalViz()
        this.triangleSmall1.enableNormalViz()
        this.triangleSmall2.enableNormalViz()
        this.parallelogram.enableNormalViz()
    }

    disableNormalViz(){
        this.diamond.disableNormalViz()
        this.triangle.disableNormalViz()
        this.triangleBig1.disableNormalViz()
        this.triangleBig2.disableNormalViz()
        this.triangleSmall1.disableNormalViz()
        this.triangleSmall2.disableNormalViz()
        this.parallelogram.disableNormalViz()
    }
}