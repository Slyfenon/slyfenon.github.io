import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';

export class MyTree extends CGFobject {
    constructor(scene, tiltAngle, tiltAxis, trunkRadius, treeHeight, crownColor) {
        super(scene);
      
        this.trunkRadius = trunkRadius;
        this.treeHeight = treeHeight;
        this.trunkHeight = treeHeight * 0.8; // 20% da altura total
      
        this.trunk = new MyCone(scene, 20, 1); // raio=1, altura=1 (escalado)
      
        this.trunkAppearance = new CGFappearance(scene);
        this.trunkAppearance.setAmbient(0.3, 0.2, 0.1, 1);
        this.trunkAppearance.setDiffuse(0.4, 0.3, 0.2, 1);
        this.trunkAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.trunkAppearance.setShininess(5);

        // Altura da copa (80% da árvore)
        this.crownHeight = treeHeight * 0.8;

        // Três pirâmides para a copa
        this.pyramid1 = new MyPyramid(scene, 6);
        this.pyramid2 = new MyPyramid(scene, 6);
        this.pyramid3 = new MyPyramid(scene, 6);

        // Aparência da copa
        this.crownAppearance = new CGFappearance(scene);
        this.crownAppearance.setAmbient(...crownColor, 1);
        this.crownAppearance.setDiffuse(...crownColor, 1);
        this.crownAppearance.setSpecular(0.1, 0.1, 0.1, 1);
        this.crownAppearance.setShininess(2);
      }

      display() {
        this.scene.pushMatrix();
        this.trunkAppearance.apply();
        this.scene.scale(this.trunkRadius, this.trunkHeight, this.trunkRadius);
        this.trunk.display();
        this.scene.popMatrix();


        this.crownAppearance.apply();

        const baseY = this.crownHeight * 0.4;
        const spacing = baseY / 1.2; // sobreposição entre as pirâmides
        const crownSection = this.crownHeight / 3;
        
        // Pirâmide 1 (base)
        this.scene.pushMatrix();
        this.scene.translate(0, baseY, 0);
        this.scene.scale(this.trunkRadius * 2, crownSection * 2, this.trunkRadius * 2);
        this.pyramid1.display();
        this.scene.popMatrix();

        // Pirâmide 2 (meio) — sobe menos que crownSection para sobrepor
        this.scene.pushMatrix();
        this.scene.translate(0, baseY + spacing, 0); // sobreposição
        this.scene.scale(this.trunkRadius * 2, crownSection * 2, this.trunkRadius * 2);
        this.pyramid2.display();
        this.scene.popMatrix();

        // Pirâmide 3 (topo) — mais sobreposição
        this.scene.pushMatrix();
        this.scene.translate(0, baseY + spacing*2 , 0);
        this.scene.scale(this.trunkRadius * 2, crownSection * 2, this.trunkRadius * 2);
        this.pyramid3.display();
        this.scene.popMatrix();

        

      }
}
