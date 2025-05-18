import {CGFappearance, CGFobject} from '../lib/CGF.js';
import { MyUnitCube } from '../tp3/MyUnitCube.js';
import { MyBucket } from './MyBucket.js';
import { MyCone } from './MyCone.js';
import { MyCylinder } from "./MyCylinder.js";
import { MySphere } from './MySphere.js';

export class MyHelicopter extends CGFobject {
  constructor(scene, texture, buildingHeigth) {
    super(scene);

    //Initial Parameters
    this.position = { x: -100, y: buildingHeigth + 4.5, z: -106 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.orientation = 0; // ângulo em radianos
    this.speed = 0;
    this.tilt = 0;
    this.state = 'landed'; // landed, taking_off, flying, descending
    this.cruiseAltitude = 50;
    this.maxSpeed = 60; 
    this.bucketRelease = false;


    this.cylinder = new MyCylinder(scene, 30, 20, 1, 2);
    this.tail = new MyCone(scene, 50, 100);
    this.sphere = new MySphere(scene, 20, 20, true, 1);
    this.skids1 = new MyUnitCube(scene);
    this.skids2 = new MyUnitCube(scene);
    this.skids3 = new MyUnitCube(scene);
    this.skids4 = new MyUnitCube(scene);
    this.bucket = new MyBucket(scene);

    this.topRotor = new MyUnitCube(scene); 
    this.topRotorAngle = 0;
    

    this.sideRotor = new MyUnitCube(scene); 
    this.sideRotorAngle = 0;
    


    this.helicopterMaterial = new CGFappearance(this.scene);
    this.helicopterMaterial.setTexture(texture);
    

    this.initBuffers();
  }

  display() {


    this.scene.pushMatrix();


    this.scene.translate(this.position.x, this.position.y, this.position.z);
    this.scene.rotate(this.orientation, 0, 1, 0);
    this.scene.rotate(this.tilt, 1, 0, 0);

    // Helicopter body
    this.scene.pushMatrix();
    this.scene.scale(5, 5, 5);
    this.scene.translate(0, 2, 0);
    this.helicopterMaterial.apply();
    this.cylinder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(2, 2, 2);
    this.scene.translate(0, 8.25, 3);
    this.scene.rotate(Math.PI / 2, 1, 0, 0);
    this.helicopterMaterial.apply();
    this.cylinder.display();
    this.scene.popMatrix();

    // Helicopter sphere
    this.scene.pushMatrix();
    this.scene.scale(5, 5, 5);
    this.scene.translate(0, 2, 2);
    this.sphere.display();
    this.scene.popMatrix();

    // Skids
    this.scene.pushMatrix();
    this.scene.translate(-3, 2, 6);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.scale(15, 0.4, 0.7);
    this.skids1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(3, 2, 6);
    this.scene.rotate(Math.PI / 2, 0, 1, 0);
    this.scene.scale(15, 0.4, 0.6);
    this.skids2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(3, 6, 6);
    this.scene.rotate(Math.PI, 1, 0, 0); // Rotate to make it vertical
    this.scene.scale(0.6, 7.7, 0.4); // Adjust scale to match vertical orientation
    this.skids3.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-3, 6, 6);
    this.scene.rotate(Math.PI, 1, 0, 0); // Rotate to make it vertical
    this.scene.scale(0.6, 7.7, 0.4); // Adjust scale to match vertical orientation
    this.skids4.display();
    this.scene.popMatrix();

    // Tail
    this.scene.pushMatrix();
    this.scene.translate(0, 10, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(5, 8, 5);
    this.tail.display();
    this.scene.popMatrix();


    // Top Rotor
    this.scene.pushMatrix();
    this.scene.translate(0, 16.75, 6); // position on top of the helicopter
    this.scene.rotate(this.topRotorAngle, 0, 1, 0); // spinning
    this.scene.scale(18, 0.3, 0.8); // further increased size: longer, thicker blade
    this.topRotor.display();
    this.scene.popMatrix();


    //Side Rotor
    this.scene.pushMatrix();
    this.scene.translate(0, 10, -7.5); // position on the side of the helicopter
    this.scene.rotate(this.sideRotorAngle, 1, 0, 0); // spinning around the x-axis
    this.scene.scale(0.3, 8, 0.8); // adjusted size for a side rotor
    this.sideRotor.display();
    this.scene.popMatrix();


    // BUCKET AND ROPE
    if (this.bucketRelease) {
      // Rope
      this.scene.pushMatrix();
      this.scene.translate(0, -2.5, 5);
      this.scene.scale(0.1, 5, 0.1);
      this.scene.rotate(-Math.PI, 1, 0, 0);
      this.cylinder.display();
      this.scene.popMatrix();

      // Bucket
      this.scene.pushMatrix();
      this.scene.translate(0, -5, 5);
      this.scene.rotate(-Math.PI / 2, 1, 0, 0);
      this.bucket.display();
      this.scene.popMatrix();
    }

    this.scene.popMatrix();

  }

  update(deltaTime) {

    //console.log(`Position: x=${this.position.x}, y=${this.position.y}, z=${this.position.z}`);
    //console.log(`Velocity: x=${this.velocity.x}, y=${this.velocity.y}, z=${this.velocity.z}`);
    //console.log(`Orientation: ${this.orientation}`);
    //console.log(`Speed: ${this.speed}`);
    //console.log(`Tilt: ${this.tilt}`);
    //console.log(`State: ${this.state}`);


    const dt = deltaTime / 1000;
  
    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;

    if (this.state !== 'landed') {
      this.topRotorAngle += deltaTime * 0.01; 
      this.sideRotorAngle += deltaTime * 0.02; 

    }
    
  
    if (this.state === 'taking_off') {
      this.position.y += 8 * dt;
      if (this.position.y >= this.cruiseAltitude) {
        this.position.y = this.cruiseAltitude;
        this.state = 'flying';
        this.bucketRelease = true;
      }
    }
  
    if (this.state === 'descending') {
      this.position.y -= 8 * dt;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.speed = 0;
        this.state = 'landed';
        this.bucketRelease = false;
      }
    }
  }


  turn(v) {
    this.orientation += v;
    const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
    this.velocity.x = speed * Math.sin(this.orientation);
    this.velocity.z = speed * Math.cos(this.orientation);
  }
  
  accelerate(v) {
    
    if (this.state === 'flying') {
      this.speed += v;
      this.speed = Math.min(Math.max(0, this.speed), this.maxSpeed);
      this.velocity.x = this.speed * Math.sin(this.orientation);
      this.velocity.z = this.speed * Math.cos(this.orientation);
      this.tilt = 0.1 * v; 

    }
  }
  
  reset() {
    this.position = { x: -100, y: 22.25, z: -106 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.orientation = 0;
    this.speed = 0;
    this.state = 'landed';
  }
  
  ascend() {
    if (this.state === 'landed') {
      this.state = 'taking_off';
    }
  }
  
  descend() {
    if (this.state === 'flying') {
      this.speed = 0;
      this.velocity = { x: 0, y: 0, z: 0 };
      this.tilt = -0.1;
      this.state = 'descending';
    }
  }
  
}
