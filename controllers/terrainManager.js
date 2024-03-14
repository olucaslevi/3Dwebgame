import * as THREE from 'three';
import ModelController from './modelController';
class TerrainManager {
    constructor(scene) {
        this.scene = scene;
        this.model = null;
        this.modelController = new ModelController(this.scene);
        this.modelController.createTerrain(model => {
            this.model = model;
        });
    }

    createTerrain() {
        const terrainGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
        const terrainMaterial = new THREE.MeshBasicMaterial({ color: 'grey' , side: THREE.DoubleSide, wireframe: true });
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.position.y = -1;
        const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
        const ambientLight = new THREE.AmbientLight(0x404040, 20);
        directionalLight.position.set(0, 1, 0);
        this.scene.add(directionalLight);
        this.scene.add(ambientLight);

        this.scene.add(terrain);
        return terrain;
    }

    getHeightAtPoint() {
        return 0;
    }
}

export default TerrainManager;