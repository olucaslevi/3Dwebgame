import * as THREE from 'three';

class Player {
    constructor(scene, camera, renderer,team,target) {
        const geometry = new THREE.BoxGeometry();
        this.team = team;
        const material = new THREE.MeshBasicMaterial({ color: team });
        this.position = new THREE.Vector3(0, 0, 0);
        this.cube = new THREE.Mesh(geometry, material);
        scene.add(this.cube);
        this.targetPosition = null;
        this.speed = 0.08; // Velocidade de movimento do jogador
        this.healthPoints = 100;
        this.damage = 10;
        this.camera = camera;
        this.renderer = renderer;
        this.targetObject = null;
        this.attackRange = 5;
        this.target = target;
    }

    moveTo(position) {
        this.targetPosition = position.clone();
    
        // Calcula a direção para a posição alvo
        const direction = new THREE.Vector3().subVectors(this.targetPosition, this.cube.position).normalize();
    
        // Orienta o cubo na direção do alvo
        this.cube.lookAt(this.targetPosition);
    }
    
    takeDamage(damage) {
        this.healthPoints -= damage;
        console.log('Player health:', this.healthPoints);
    }
    
    getDamage() {
        return this.damage;
    }

    attack(enemy) {
        const distance = this.cube.position.distanceTo(enemy.mesh.position);
        if (distance <= this.attackRange) {
            enemy.takeDamage(this.damage);
        }
    }

    update() {
        if (this.targetPosition && !this.cube.position.equals(this.targetPosition)) {
            const direction = new THREE.Vector3().subVectors(this.targetPosition, this.cube.position).normalize();
            this.cube.position.add(direction.multiplyScalar(this.speed));

            if (this.cube.position.distanceTo(this.targetPosition) < this.speed) { 
                this.cube.position.copy(this.targetPosition);
                this.targetPosition = null;
            }
        }
    }

    getPosition() {
        return this.cube.position;
    }

    isAlive() {
        return this.healthPoints > 0;
    }

    getTeam() {
        return this.team;
    }
}

export default Player;

