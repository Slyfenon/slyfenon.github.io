import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        this.initKeys();

        this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        this.gui.add(this.scene, 'displaySun').name('Display Sun');

        this.gui.add(this.scene, 'displayPanorama').name('DisplayPanorama');
        this.gui.add(this.scene, 'displayTerrain').name('DisplayTerrain');
        this.gui.add(this.scene, 'displayBuilding').name('DisplayBuilding');

        this.gui.add(this.scene, 'speedFactor', 0.1, 3.0).name('Speed Factor');
        this.gui.add(this.scene, 'rotationSpeed', 0.01, 0.2).name('Rotation Speed');

        this.gui.add(this.scene, 'displayForest').name('Display Forest');

        this.gui.add(this.scene, 'selectedBuildingTexture', this.scene.buildingTextureList)
            .name('Building Texture')
            .onChange(() => this.scene.updateBuildingTexture());

        this.gui.add(this.scene, 'selectedTerrainTexture', this.scene.terrainTextureList)
            .name('Terrain Texture')
            .onChange(() => this.scene.updateTerrainTexture());

        this.gui.add(this.scene, 'season', ["Summer", "Fall", "Winter"]).name("Season").onChange(() => {
            this.scene.updateForestSeason();
        });

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}