import {CGFappearance, CGFobject} from '../lib/CGF.js';
import { MyUnitCube } from '../tp3/MyUnitCube.js';
import { MyCylinder } from "./MyCylinder.js";
import { MySphere } from './MySphere.js';

export class MyHelicopter extends CGFobject {
  constructor(scene) {
    super(scene);

    //Initial Parameters
    this.position = { x: 0, y: 0, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.orientation = 0; // ângulo em radianos
    this.speed = 0;
    this.tilt = 0;
    this.state = 'landed'; // landed, taking_off, flying, descending
    this.cruiseAltitude = 25;
    this.maxSpeed = 60; 



    this.cylinder = new MyCylinder(scene, 30, 20, 1, 2);
    this.tail = new MyCylinder(scene, 30, 20, 0.4, 2);
    this.sphere = new MySphere(scene, 20, 20, true, 1);
    this.skids1 = new MyUnitCube(scene);
    this.skids2 = new MyUnitCube(scene);

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

    // Tail
    this.scene.pushMatrix();
    this.scene.translate(1, 14, -8);
    this.scene.rotate(Math.PI / 10, 1, 0, 0);
    this.scene.scale(5, 5, 5);
    this.tail.display();
    this.scene.popMatrix();


    this.scene.popMatrix();

  }

  update(deltaTime) {
    const dt = deltaTime / 1000;
  
    this.position.x += this.velocity.x * dt;
    this.position.z += this.velocity.z * dt;
  
    if (this.state === 'taking_off') {
      this.position.y += 6 * dt;
      if (this.position.y >= this.cruiseAltitude) {
        this.position.y = this.cruiseAltitude;
        this.state = 'flying';
      }
    }
  
    if (this.state === 'descending') {
      this.position.y -= 6 * dt;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.speed = 0;
        this.state = 'landed';
      }
    }
  }


  turn(v) {
    this.orientation += v;
    const dir = Math.atan2(this.velocity.x, this.velocity.z);
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

      if(v < 0 && this.speed != 0){
        this.tilt = -0.1 * v; 
      }
    }
  }
  
  reset() {
    this.position = { x: 0, y: 0, z: 0 };
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
      this.state = 'descending';
    }
  }
  
  
}
