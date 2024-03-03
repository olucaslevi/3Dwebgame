import * as THREE from 'three';
import { Vector3 } from 'three';
class HealthBarManager {
    constructor(player, camera, renderer) {
        this.player = player;
        this.camera = camera;
        this.renderer = renderer;
        this.healthBar = document.getElementById('player-health-bar-fill');
        this.healthBarText = document.getElementById('player-health-text');
    }

    update() {
        // Update health bar width
        this.healthBar.style.width = `${(this.player.healthPoints / 100) * 100}%`;
    
        // Convert the player's position from world coordinates to screen coordinates
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(this.player.cube.matrixWorld);
        vector.project(this.camera);
    
        // Convert from normalized device coordinates (-1 to +1) to pixel coordinates
        const widthHalf = 0.5 * this.renderer.domElement.clientWidth;
        const heightHalf = 0.5 * this.renderer.domElement.clientHeight;
    
        vector.x = (vector.x * widthHalf) + widthHalf;
        vector.y = -(vector.y * heightHalf) + heightHalf;
    
        // Update health bar text
        this.healthBarText.textContent = `${this.player.healthPoints} HP`;

        if (this.player.healthPoints <= 0) {
            this.healthBar.style.display = 'none';
            this.healthBarText.style.display = 'none';
        } else {
            this.healthBar.style.display = 'block';
            this.healthBarText.style.display = 'block';
        }

        // Update health bar position
        this.healthBar.style.top = `${vector.y}px`;
        this.healthBar.style.left = `${vector.x}px`;
        this.healthBarText.style.top = `${vector.y}px`;
        this.healthBarText.style.left = `${vector.x }px`;

        // Update health bar color

        if (this.player.healthPoints > 70) {
            this.healthBar.style.backgroundColor = 'green';
        } else if (this.player.healthPoints > 30) {
            this.healthBar.style.backgroundColor = 'yellow';
        } else {
            this.healthBar.style.backgroundColor = 'red';
        }
    }
}

export default HealthBarManager;