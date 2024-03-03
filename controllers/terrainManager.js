import * as THREE from 'three';

class TerrainManager {
    constructor(scene) {
        this.scene = scene;
    }

    createTerrain() {
        const terrainGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
        const terrainMaterial = new THREE.MeshBasicMaterial({ color: 'blue' , side: THREE.DoubleSide, wireframe: true });
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.rotation.x = -Math.PI / 1;
        terrain.position.y = -1;
        this.scene.add(terrain);
        return terrain;
    }
}

export default TerrainManager;