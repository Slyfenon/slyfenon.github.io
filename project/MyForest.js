import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
    constructor(scene, rows, cols, crownTexturePath = "textures/green_leaves.jpg") {
        super(scene);

        this.rows = rows;
        this.cols = cols;

        this.trees = [];

        for (let i = 0; i < rows; i++) {
            this.trees[i] = [];
            for (let j = 0; j < cols; j++) {
                const randomHeight = 10 + Math.random() * (30 - 10);
                const randomRadius = 0.8 + Math.random() * (2.0 - 0.8);
                const randomTilt = Math.random() * 20;
                const tiltAxis = Math.random() < 0.5 ? 'X' : 'Z';

                let crownColor;
                if (scene.season === "Fall") {
                    const fallVariants = [
                        [205 / 255, 133 / 255, 63 / 255],   
                        [218 / 255, 165 / 255, 32 / 255],   
                        [184 / 255, 134 / 255, 11 / 255],   
                        [139 / 255, 69 / 255, 19 / 255],    
                        [210 / 255, 105 / 255, 30 / 255],   
                        [255 / 255, 215 / 255, 0 / 255]     
                    ];
                    crownColor = fallVariants[Math.floor(Math.random() * fallVariants.length)];
                } else {
                    const greenVariants = [
                        [0 / 255, 100 / 255, 0 / 255],  
                        [0 / 255, 128 / 255, 0 / 255],     
                        [34 / 255, 139 / 255, 34 / 255],  
                        [50 / 255, 205 / 255, 50 / 255],   
                        [107 / 255, 142 / 255, 35 / 255],  
                        [85 / 255, 107 / 255, 47 / 255]    
                    ];
                    
                    crownColor = greenVariants[Math.floor(Math.random() * greenVariants.length)];
                }

                const offsetX = (Math.random() - 0.5) * 10;
                const offsetZ = (Math.random() - 0.5) * 10; 

                const useTexture = Math.random() < 0.5; 

                this.trees[i][j] = {
                    tree: new MyTree(scene, randomTilt, tiltAxis, randomRadius, randomHeight, crownColor, useTexture, crownTexturePath),
                    offsetX: offsetX,
                    offsetZ: offsetZ
                  };
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
    }
}
