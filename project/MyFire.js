import { CGFobject, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyPyramid } from "./MyPyramid.js";

export class MyFire extends CGFobject {
  constructor(scene, fireRadius = 10) {
    super(scene);

    this.flames = [];
    this.positions = [];
    this.appearance = new CGFappearance(scene);

    const texture = new CGFtexture(scene, "textures/fogo.jpg");
    this.appearance.setTexture(texture);
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    this.appearance.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.appearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.appearance.setShininess(1.0);

    this.maxHeight = 7;
    this.minHeight = 1;

    const densityBase = 2; // número de pirâmides por unidade de área
    const flameCount = Math.floor(Math.PI * fireRadius * fireRadius * densityBase);

    for (let i = 0; i < flameCount; i++) {
      const pyramid = new MyPyramid(scene, 6);
      this.flames.push(pyramid);

      // Gera posição aleatória dentro do círculo
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.sqrt(Math.random()) * fireRadius; // distribuição mais densa no centro
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      // Altura depende da distância ao centro, com leve aleatoriedade
      const t = radius / fireRadius; // [0, 1]
      const baseHeight = this.maxHeight - t * (this.maxHeight - this.minHeight);
      const randomFactor = 0.8 + Math.random() * 0.4; // entre 0.8 e 1.2
      const height = baseHeight * randomFactor;

      this.positions.push({ x, z, height });
    }
  }

  display() {
    this.appearance.apply();

    for (let i = 0; i < this.flames.length; i++) {
      const { x, z, height } = this.positions[i];

      this.scene.pushMatrix();
      this.scene.translate(x, 0, z);
      this.scene.scale(0.8, height, 0.8);
      this.flames[i].display();
      this.scene.popMatrix();
    }
  }
}