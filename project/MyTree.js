import { CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';

export class MyTree extends CGFobject {
  constructor(scene, tiltAngle, tiltAxis, trunkRadius, treeHeight, crownColor, useTexture = true, crownTexturePath = "textures/green_leaves.jpg") {
      super(scene);
      
        this.trunkRadius = trunkRadius;
        this.treeHeight = treeHeight;
        this.tiltAngle = tiltAngle;
        this.tiltAxis = tiltAxis;
        this.trunkHeight = treeHeight * 0.8;
        this.useTexture = useTexture;
      
        this.trunk = new MyCone(scene, 20, 1); 
        this.trunkAppearance = new CGFappearance(scene);
        this.trunkAppearance.setAmbient(0.3, 0.2, 0.1, 1);
        this.trunkAppearance.setDiffuse(0.4, 0.3, 0.2, 1);
        this.trunkAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.trunkAppearance.setShininess(5);

        this.trunkTextureAppearance = new CGFappearance(scene);
        this.trunkTextureAppearance.setTexture(new CGFtexture(scene, "textures/trunk.jpg"));
        this.trunkTextureAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.trunkTextureAppearance.setAmbient(1, 1, 1, 1);
        this.trunkTextureAppearance.setDiffuse(1, 1, 1, 1);
        this.trunkTextureAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.trunkTextureAppearance.setShininess(5);

        this.crownHeight = treeHeight * 0.8;

        const minLayers = 2;
        const maxLayers = 6;

        if (treeHeight <= 5) {
          this.numPyramids = 1;
        } else {
          this.numPyramids = Math.max(minLayers, Math.min(maxLayers, Math.round(
            minLayers + (treeHeight - 10) * (maxLayers - minLayers) / (50 - 10)
          )));
        }

        this.pyramidHeight = Math.max(1.5, this.crownHeight / this.numPyramids);

        this.crownLayers = [];
        for (let i = 0; i < this.numPyramids; i++) {
            this.crownLayers.push(new MyPyramid(scene, 6));
        }

        this.crownAppearance = new CGFappearance(scene);
        this.crownAppearance.setAmbient(...crownColor, 1);
        this.crownAppearance.setDiffuse(...crownColor, 1);
        this.crownAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.crownAppearance.setShininess(2);

        this.crownTextureAppearance = new CGFappearance(scene);
        this.crownTextureAppearance.setTexture(new CGFtexture(scene, crownTexturePath));
        this.crownTextureAppearance.setTextureWrap('REPEAT', 'REPEAT');
        this.crownTextureAppearance.setAmbient(1, 1, 1, 1);
        this.crownTextureAppearance.setDiffuse(1, 1, 1, 1);
        this.crownTextureAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.crownTextureAppearance.setShininess(2);
      }

      display() {
        this.scene.pushMatrix();

        if (this.tiltAxis.toUpperCase() === 'X') {
          this.scene.rotate(this.tiltAngle * Math.PI / 180, 1, 0, 0);
        } else if (this.tiltAxis.toUpperCase() === 'Z') {
          this.scene.rotate(this.tiltAngle * Math.PI / 180, 0, 0, 1);
        }

        (this.useTexture ? this.trunkTextureAppearance : this.trunkAppearance).apply();
        this.scene.pushMatrix();
        this.scene.scale(this.trunkRadius, this.trunkHeight * 0.85, this.trunkRadius);
        this.trunk.display();
        this.scene.popMatrix();


        (this.useTexture ? this.crownTextureAppearance : this.crownAppearance).apply();

        const baseY = this.trunkHeight * 0.2;
        const baseScale = this.trunkRadius * 2.2;
        const reductionFactor = 0.80;
        
        for (let i = 0; i < this.numPyramids; i++) {
          const y = baseY + i * this.pyramidHeight * 0.6;
          const scaleXZ = baseScale * Math.pow(reductionFactor, i);
        
          this.scene.pushMatrix();
          this.scene.translate(0, y, 0);
          this.scene.scale(scaleXZ, this.pyramidHeight, scaleXZ);
          this.crownLayers[i].display();
          this.scene.popMatrix();
        }
        
        
        this.scene.popMatrix();

      }
}
