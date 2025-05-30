import { CGFappearance, CGFobject } from '../lib/CGF.js';
import { MyUnitCube } from '../tp3/MyUnitCube.js';
import { MyBucket } from './MyBucket.js';
import { MyCircle } from './MyCircle.js';
import { MyCone } from './MyCone.js';
import { MyCylinder } from "./MyCylinder.js";
import { MySphere } from './MySphere.js';

export class MyHelicopter extends CGFobject {
  constructor(scene, texture, building, forest) {
    super(scene);

    this.building = building;
    this.buildingHeigth = building.getHeight();
    this.forest = forest;
    this.position = { x: -100, y: this.buildingHeigth + 8.5, z: -106 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.orientation = 0; // ângulo em radianos
    this.speed = 0;
    this.tilt = 0;
    this.state = 'idle'; // 'idle', 'lowering', 'filling', 'rising', 'ready'
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
    this.bucketCap = new MyCircle(scene, 20, 1, true, false);

    this.topRotor = new MyUnitCube(scene);
    this.topRotorAngle = 0;


    this.sideRotor = new MyUnitCube(scene);
    this.sideRotorAngle = 0;



    this.helicopterMaterial = new CGFappearance(this.scene);
    this.helicopterMaterial.setTexture(texture);


    //WATER LOGIC

    this.bucketFilled = false;
    this.bucketFillLevel = 0;
    this.filling = false;
    this.isOverLake = false;

    this.initBuffers();
  }



  /**
   * Displays the helicopter model.
   */
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
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.scene.scale(0.6, 7.7, 0.4);
    this.skids3.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-3, 6, 6);
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.scene.scale(0.6, 7.7, 0.4);
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
    this.scene.translate(0, 16.75, 6);
    this.scene.rotate(this.topRotorAngle, 0, 1, 0);
    this.scene.scale(18, 0.3, 0.8);
    this.topRotor.display();
    this.scene.popMatrix();

    // Cross Top Rotor
    this.scene.pushMatrix();
    this.scene.translate(0, 16.75, 6);
    this.scene.rotate(this.topRotorAngle + Math.PI / 2, 0, 1, 0);
    this.scene.scale(18, 0.3, 0.8);
    this.topRotor.display();
    this.scene.popMatrix();

    //Side Rotor
    this.scene.pushMatrix();
    this.scene.translate(0, 10, -7.5);
    this.scene.rotate(this.sideRotorAngle, 1, 0, 0);
    this.scene.scale(0.3, 8, 0.8);
    this.sideRotor.display();
    this.scene.popMatrix();


    // BUCKET AND ROPE
    if (this.bucketRelease) {
      // Rope
      this.scene.pushMatrix();
      this.scene.translate(0, -2.5, 5);
      this.scene.scale(0.1, 5, 0.1);
      this.scene.rotate(-Math.PI / 2, 1, 0, 0);
      this.cylinder.display();
      this.scene.popMatrix();

      // Bucket
      this.scene.pushMatrix();
      this.scene.translate(0, -5, 5);
      this.scene.rotate(-Math.PI / 2, 1, 0, 0);
      this.bucket.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();
      this.scene.translate(0, -5, 5);
      this.scene.rotate(-Math.PI / 2, 1, 0, 0);
      this.scene.scale(1.1, 1.5, 1);
      this.bucketCap.display();
      this.scene.popMatrix();

      if (this.bucketFillLevel > 0) {
        this.scene.pushMatrix();
        this.scene.translate(0, -5, 5);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        // Water appearance
        const waterAppearance = new CGFappearance(this.scene);
        waterAppearance.setAmbient(0, 0, 0.2, 1);
        waterAppearance.setDiffuse(0.1, 0.3, 0.8, 0.7);
        waterAppearance.setSpecular(0.6, 0.8, 1, 1);
        waterAppearance.setShininess(120);
        waterAppearance.apply();

        // Water fill cylinder
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.01);
        this.scene.scale(1.0, 1.4, this.bucketFillLevel);
        const waterColumn = new MyCylinder(this.scene, 20, 1);
        waterColumn.display();
        this.scene.popMatrix();

        // Water top cap
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.bucketFillLevel);
        this.scene.scale(1.0, 1.4, 1);
        const waterTopCap = new MyCircle(this.scene, 20);
        waterTopCap.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
      }


    }

    this.scene.popMatrix();

  }

  /**
   * Updates the helicopter's position and state based on the elapsed time.
   * Handles different states such as taking off, flying, filling the bucket, and landing.
   * Updates the camera position and target based on the helicopter's state.
   * Checks if the helicopter is the lake.
   * 
   * 
   * @param {*} deltaTime 
   */
  update(deltaTime) {
    const dt = deltaTime / 1000;

    console.log("TILT: ", this.tilt);
    console.log("VELOCITY: ", this.velocity.x, this.velocity.z);


    this.isOverLake = (
      this.position.x > -50 && this.position.x < 10 &&
      this.position.z > 0 && this.position.z < 40
    );

    console.log(this.state);
    console.log(`Position: x=${this.position.x}, y=${this.position.y}, z=${this.position.z}`);
    if (this.isOverLake) {
      console.log("WATER");
    }

    switch (this.state) {
      case 'taking_off':
        this.velocity = { x: 0, y: 10, z: 0 };
        this.position.y += this.velocity.y * dt;
        if (this.position.y >= this.cruiseAltitude) {
          this.position.y = this.cruiseAltitude;
          this.velocity = { x: 0, y: 0, z: 0 };
          this.state = 'flying';
        }
        break;

      case 'lowering':
        this.velocity = { x: 0, y: -8, z: 0 };
        this.position.y += this.velocity.y * dt;
        if (this.position.y <= 18) {
          this.position.y = 18;
          this.state = 'filling';
          this.bucketFillLevel = 0;
        }
        break;

      case 'filling':
        this.scene.camera.setPosition(vec3.fromValues(
          this.position.x,
          this.position.y + 3,
          this.position.z + 2
        ));
        this.scene.camera.setTarget(vec3.fromValues(
          this.position.x,
          this.position.y - 5,
          this.position.z + 5
        ));

        this.bucketFillLevel += dt;
        if (this.bucketFillLevel >= 1.4) {
          this.bucketFillLevel = 1.4;
          this.bucketFilled = true;
          this.state = 'filled';
          this.scene.camera.setPosition(vec3.fromValues(this.position.x, this.position.y + 40, this.position.z + 40));
          this.scene.camera.setTarget(vec3.fromValues(this.position.x, this.position.y, this.position.z));
        }
        break;

      case 'filled':
        break;

      case 'rising':
        this.velocity = { x: 0, y: 8, z: 0 };
        this.position.y += this.velocity.y * dt;
        if (this.position.y >= this.cruiseAltitude) {
          this.position.y = this.cruiseAltitude;
          this.velocity = { x: 0, y: 0, z: 0 };
          this.state = 'flying';
        }
        break;

      case 'landing':
        if (this.velocity.y === 0) {
          this.velocity = { x: 0, y: -8, z: 0 };
        }

        this.position.y += this.velocity.y * dt;

        if (this.position.y <= 26.25) {
          this.position.y = 26.25;
          this.velocity = { x: 0, y: 0, z: 0 };
          this.state = 'landed';
          this.bucketRelease = false;
          this.orientation = 0;
        }
        break;


      case 'flying':
        if (this.velocity.x === 0 && this.velocity.z === 0) {
          this.tilt = 0;
        }
        // movimentação ativa permitida
        this.position.x += this.velocity.x * dt;
        this.position.z += this.velocity.z * dt;
        this.bucketRelease = true;
        break;

      case 'landed':
      case 'idle':
        // parado no heliporto
        break;
      case 'returning':
        const targetPosition = { x: -100, y: this.cruiseAltitude, z: -106 };

        const dx = targetPosition.x - this.position.x;
        const dz = targetPosition.z - this.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        // Rotate to face direction of movement
        if (distance > 0.5) {
          this.orientation = Math.atan2(dx, dz); // rotate to face target
          const moveSpeed = 15; // constant speed for return
          const vx = (dx / distance) * moveSpeed;
          const vz = (dz / distance) * moveSpeed;

          this.velocity = { x: vx, y: 0, z: vz };
          this.position.x += vx * dt;
          this.position.z += vz * dt;
        } else {
          // Reached helicenter
          this.position.x = targetPosition.x;
          this.position.z = targetPosition.z;
          this.velocity = { x: 0, y: 0, z: 0 };
          this.state = 'landing'; // descend when arrived
        }
        break;
    }

    if (this.state !== 'idle') {
      this.topRotorAngle += deltaTime * 0.01;
      this.sideRotorAngle += deltaTime * 0.05;
    }
  }



  /**
    * Turns the helicopter by a given angle.
    * @param {number} v - The angle in radians to turn the helicopter.
   */
  turn(v) {
    this.orientation += v;
    const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
    this.velocity.x = speed * Math.sin(this.orientation);
    this.velocity.z = speed * Math.cos(this.orientation);
  }

  /**
   * Accelerates the helicopter by a given speed.
   * If the helicopter is in the 'flying' state, it increases the speed
   * and updates the velocity based on the current orientation.
   * The speed is clamped between 0 and the maximum speed.
   * The tilt is adjusted based on the current speed.
   * @param {number} v - The speed to accelerate by.
   */
  accelerate(v) {
    if (this.state === 'flying') {
      this.speed += v;
      this.speed = Math.min(Math.max(0, this.speed), this.maxSpeed);
      this.velocity.x = this.speed * Math.sin(this.orientation);
      this.velocity.z = this.speed * Math.cos(this.orientation);

      // Linearly interpolate tilt from 0 to 0.4 as speed increases
      if (this.speed > 0) {
        this.tilt = 0.4 * (this.speed / this.maxSpeed);
      } else {
        this.tilt = 0;
      }
    }
  }

  /**
   * Decelerates the helicopter by a given speed.
   * If the helicopter is in the 'flying' state, it decreases the speed
   * and updates the velocity based on the current orientation.
   * The speed is clamped between 0 and the maximum speed.
   * The tilt is adjusted based on the current speed.
   * @param {number} v - The speed to decelerate by.
   */
  decelerate(v) {
    if (this.state === 'flying') {
      this.speed -= v;
      this.speed = Math.max(0, this.speed);
      this.velocity.x = this.speed * Math.sin(this.orientation);
      this.velocity.z = this.speed * Math.cos(this.orientation);

      // Vary tilt based on speed (tilt decreases as speed decreases)
      if (this.speed > 0) {
        this.tilt = 0.4 * (this.speed / this.maxSpeed);
      } else {
        this.tilt = 0;
      }
    }
  }

  /**
   * Resets the helicopter's position, velocity, orientation, speed, bucket state, and state.
   * This method is typically called when the helicopter needs to be reset to its initial state.
   */
  reset() {
    this.position = { x: -100, y: 26.25, z: -106 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.orientation = 0;
    this.speed = 0;
    this.bucketFilled = false;
    this.bucketFillLevel = 0;
    this.filling = false;
    this.state = 'landed';
  }

  /**
   * Ascends the helicopter from the 'landed' state to the 'taking_off' state.
   * This method is typically called when the helicopter needs to take off.
   */
  ascend() {
    if (this.state === 'landed') {
      this.state = 'taking_off';
    }
  }

  /**
   * Descends the helicopter from the 'flying' state to the 'descending' state.
   * This method is typically called when the helicopter needs to descend.
   */
  descend() {
    if (this.state === 'flying') {
      this.speed = 0;
      this.velocity = { x: 0, y: 0, z: 0 };
      this.tilt = -0.1;
      this.state = 'descending';
    }
  }

  /**
   * Eliminates nearby fires within a specified radius from the helicopter's position.
   * This method filters out fires that are within the specified radius from the helicopter's position.
   * It logs the initial and final fire counts, as well as the positions of the fires before and after elimination.
   * @param {number} radius - The radius within which to eliminate fires.
   * @returns {boolean} - Returns true if any fires were eliminated, false otherwise.
   */
  eliminateNearbyFires(radius) {
    console.log("Eliminating nearby fires...");
    console.log(`Current position: x=${this.position.x}, z=${this.position.z}`);
    console.log(`Radius: ${radius}`);
    console.log("Fires before elimination:", this.forest.fires);

    const initialFireCount = this.forest.fires.length;

    this.forest.fires = this.forest.fires.filter(fire => {
      const dx = (fire.x + 25) - this.position.x;
      const dz = (fire.z - 125) - this.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      console.log(`Fire position: x=${fire.x}, z=${fire.z}, distance=${distance}`);
      return distance > radius;
    });

    const finalFireCount = this.forest.fires.length;

    console.log("Fires after elimination:", this.forest.fires);
    console.log(`Fires remaining: ${this.forest.fires.length}`);

    return initialFireCount !== finalFireCount;
  }


  /**
   * Handles key presses for helicopter controls.
   * This method processes key inputs to control the helicopter's state and actions.
   *  
   * @param {string} key - The key that was pressed.
   * */
  handleKeyPress(key) {
    switch (key) {
      case 'L':
        if (this.isOverLake && this.speed === 0 && !this.bucketFilled) {
          this.state = 'lowering';
          this.bucketRelease = true;
        } else if (this.state != 'returning') {
          this.state = 'returning';
          this.speed = 0; // Stop any current movement
          this.velocity = { x: 0, y: 0, z: 0 }; // Clear velocity
          console.log("Helicopter initiated return to base.");
        }
        break;
      case 'P':
        if (this.state === 'filling' || this.state === 'filled' || this.state === 'landed' || this.state === 'idle') {
          this.state = 'rising';
        } else if (this.state === 'landed') {
          this.state = 'taking_off';
        }
        break;

      case 'O':
        if (this.bucketFilled && this.state === 'flying') {
          console.log("EXTINGUISH");
          const radius = 30;
          if (this.eliminateNearbyFires(radius)) {
            console.log("RESETING");
            this.bucketFilled = false;
            this.bucketFillLevel = 0;
            this.bucketRelease = false;
          }
        }
        break;
    }
  }

}
