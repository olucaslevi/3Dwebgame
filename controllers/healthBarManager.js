import * as THREE from 'three';

export class HealthBarManager {
    constructor(object, camera, renderer) {
        this.object = object;
        this.camera = camera;
        this.renderer = renderer;

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.texture = new THREE.CanvasTexture(this.canvas);

        this.material = new THREE.SpriteMaterial({ map: this.texture });

        this.sprite = new THREE.Sprite(this.material);
        this.object.mesh.add(this.sprite);
        // normalize the sprite size
        this.sprite.scale.set(2,1,1);
    }

    update() {
        const healthPercent = this.object.healthPoints / 100;
        this.drawHealthBar(healthPercent);
        this.texture.needsUpdate = true;
        this.sprite.position.set(0, this.object.mesh.position.z,0);
        this.sprite.quaternion.copy(this.camera.quaternion);
    }

    drawHealthBar(healthPercent) {
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the health bar background
        this.context.fillStyle = 'gray';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const color = healthPercent > 0.7 ? 'green' : healthPercent > 0.3 ? 'yellow' : 'red';
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, healthPercent * this.canvas.width, this.canvas.height);
        this.context.font = 'Bold 100px Arial';
        this.context.fillStyle = 'white';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(`${this.object.healthPoints}`, this.canvas.width / 2, this.canvas.height / 2);
    }
}

export default HealthBarManager;
