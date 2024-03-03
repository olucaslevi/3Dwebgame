import * as THREE from 'three';

export class Projectile {
    constructor(scene, position, target, speed = 0.2) {
        this.scene = scene;
        this.position = position.clone();
        this.target = target.clone(); // Save the target
        this.direction = new THREE.Vector3().subVectors(target, position).normalize();
        this.speed = speed;

        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        scene.add(this.mesh);
    }
    update(player) {
        this.target = player.cube.position.clone(); // Update the target to the player's current position
        this.direction = new THREE.Vector3().subVectors(this.target, this.position).normalize();

        // Calculate the distance to the target
        const distance = this.position.distanceTo(this.target);

        // Increase the speed as the projectile gets closer to the target
        const speed = this.speed * (2 + (1 / distance));

        // Check if the projectile has reached the target
        if (distance <= speed) {
            this.scene.remove(this.mesh); // Remove the projectile from the scene
            // Deal damage to the player
            player.takeDamage(10);
            return true; // Indicate that the projectile has hit the target
        }

        this.position.add(this.direction.clone().multiplyScalar(speed));
        this.mesh.position.copy(this.position);
        return false; // Indicate that the projectile has not yet hit the target
    }
}
