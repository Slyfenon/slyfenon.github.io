import { CGFobject, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";

export class MyWindow extends CGFobject {
  constructor(scene) {
    super(scene);

    this.plane = new MyPlane(scene, 1);

    this.appearance = new CGFappearance(scene);
    this.appearance.setAmbient(0.4, 0.4, 0.4, 1.0);
    this.appearance.setDiffuse(0.8, 0.8, 0.8, 1.0);
    this.appearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.appearance.setShininess(1.0);
    this.appearance.setTexture(new CGFtexture(scene, "textures/window.jpg"));
    this.appearance.setTextureWrap('REPEAT', 'REPEAT');
  }

  /**
   * Displays the window.
   * Applies the appearance and then displays the plane.
   */
  display() {
    this.appearance.apply();
    this.plane.display();
  }
}
