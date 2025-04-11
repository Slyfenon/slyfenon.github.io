import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';

export class MyTree extends CGFobject {
    constructor(scene, tiltAngle, tiltAxis, trunkRadius, treeHeight, crownColor) {
        super(scene);
      
        this.trunkRadius = trunkRadius;
        this.treeHeight = treeHeight;
        this.tiltAngle = tiltAngle;
        this.tiltAxis = tiltAxis;
        this.trunkHeight = treeHeight * 0.8;  // altura interna do tronco
      
        this.trunk = new MyCone(scene, 20, 1); // raio=1, altura=1 (escalado)
      
        this.trunkAppearance = new CGFappearance(scene);
        this.trunkAppearance.setAmbient(0.3, 0.2, 0.1, 1);
        this.trunkAppearance.setDiffuse(0.4, 0.3, 0.2, 1);
        this.trunkAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.trunkAppearance.setShininess(5);

        // copa ocupa 80% da árvore
        this.crownHeight = treeHeight * 0.8;

        const minLayers = 2;
        const maxLayers = 6;

        // Número de pirâmides com base na altura da copa
        if (treeHeight <= 5) {
          this.numPyramids = 1;
        } else {
          this.numPyramids = Math.max(minLayers, Math.min(maxLayers, Math.round(
            minLayers + (treeHeight - 10) * (maxLayers - minLayers) / (50 - 10)
          )));
        }

        // Altura real de cada pirâmide (distribui a copa por igual)
        this.pyramidHeight = Math.max(1.5, this.crownHeight / this.numPyramids);

        // Criação dinâmica das pirâmides
        this.crownLayers = [];
        for (let i = 0; i < this.numPyramids; i++) {
            this.crownLayers.push(new MyPyramid(scene, 6)); // 6 lados = pirâmide hexagonal
        }

        // Aparência da copa
        this.crownAppearance = new CGFappearance(scene);
        this.crownAppearance.setAmbient(...crownColor, 1);
        this.crownAppearance.setDiffuse(...crownColor, 1);
        this.crownAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.crownAppearance.setShininess(2);
      }

      display() {
        this.scene.pushMatrix();

        // Aplicar inclinação com base no eixo
        if (this.tiltAxis.toUpperCase() === 'X') {
          this.scene.rotate(this.tiltAngle * Math.PI / 180, 1, 0, 0);
        } else if (this.tiltAxis.toUpperCase() === 'Z') {
          this.scene.rotate(this.tiltAngle * Math.PI / 180, 0, 0, 1);
        }

        this.trunkAppearance.apply();
        this.scene.pushMatrix();
        this.scene.scale(this.trunkRadius, this.trunkHeight * 0.85, this.trunkRadius);
        this.trunk.display();
        this.scene.popMatrix();


        this.crownAppearance.apply();

        const baseY = this.trunkHeight * 0.2;
        const baseScale = this.trunkRadius * 2.2;
        const reductionFactor = 0.80; // fator de redução por camada
        
        for (let i = 0; i < this.numPyramids; i++) {
          const y = baseY + i * this.pyramidHeight * 0.6; // sobreposição controlada
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
