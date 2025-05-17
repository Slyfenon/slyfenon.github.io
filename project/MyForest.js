import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';
import { MyFire } from './MyFire.js';

export class MyForest extends CGFobject {
    constructor(scene, rows, cols, crownTexturePath = "textures/green_leaves.jpg") {
        super(scene);

        this.rows = rows;
        this.cols = cols;

        this.trees = [];
        this.fires = [];

        for (let i = 0; i < rows; i++) {
            this.trees[i] = [];
            for (let j = 0; j < cols; j++) {
                const randomHeight = 10 + Math.random() * (30 - 10);
                const randomRadius = 0.8 + Math.random() * (2.0 - 0.8);
                const randomTilt = Math.random() * 20;
                const tiltAxis = Math.random() < 0.5 ? 'X' : 'Z';
                let crownColor;

                if (scene.season === "Fall") {

                    crownColor = [0.6 + Math.random() * 0.4, 0.3 + Math.random() * 0.4, Math.random() * 0.2] ;
                } else {                   
                    crownColor = [Math.random() * 0.3, 0.4 + Math.random() * 0.5, Math.random() * 0.3];
                }

                const offsetX = (Math.random() - 0.5) * 10;
                const offsetZ = (Math.random() - 0.5) * 10; 

                const useTexture = Math.random() < 0.5; 

                this.trees[i][j] = {
                    tree: new MyTree(scene, randomTilt, tiltAxis, randomRadius, randomHeight, crownColor, useTexture, crownTexturePath),
                    offsetX: offsetX,
                    offsetZ: offsetZ
                  };
                const spacing = 15;

                if (i > 0 && j > 0 && Math.random() < 0.5) {
                    const fireX = (j - 0.5) * spacing;
                    const fireZ = (i - 0.5) * spacing;
                    const fire = new MyFire(this.scene, 3);
                    this.fires.push({ fire: fire, x: fireX, z: fireZ });
                }
            }
        }
    }

    display() {
        const spacing = 15;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.scene.pushMatrix();
                const treeData = this.trees[i][j];
                this.scene.translate(j * spacing + treeData.offsetX, 0, i * spacing + treeData.offsetZ);
                treeData.tree.display();
                this.scene.popMatrix();
            }
        }

        for (const fireData of this.fires) {
            this.scene.pushMatrix();
            this.scene.translate(fireData.x, 0, fireData.z);
            fireData.fire.display();
            this.scene.popMatrix();
        }
    }
}
