import * as THREE from 'three';
import { Projectile } from './../controllers/projectileController';

class Tower {
    constructor(scene, position, attackRadius = 20, cooldown = 100, healthPoints = 100, damage = 10,camera,team) {

        this.scene = scene;
        this.position = position;
        this.attackRadius = attackRadius;
        this.cooldown = cooldown;
        this.cooldownCounter = 0;
        this.healthPoints = healthPoints;
        this.damage = damage;
        this.projectiles = [];
        this.camera = camera;
        this.healthBar = document.getElementById('player-health-bar-fill');
        this.healthText = document.getElementById('player-health-text');
        this.team = team;

        const geometry = new THREE.ConeGeometry(1, 10, 32);
        const material = new THREE.MeshBasicMaterial({ color: this.team });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(position.x, position.y, position.z+4);
        this.mesh.rotation.x = Math.PI / 2; // Rotate the cone to be parallel to the ground
        scene.add(this.mesh);


        // Create a circle to indicate the attack radius
        const circleGeometry = new THREE.CircleGeometry(this.attackRadius, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 'green', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        this.attackRadiusIndicator = new THREE.Mesh(circleGeometry, circleMaterial);
        this.attackRadiusIndicator.position.copy(position);
        this.attackRadiusIndicator.rotation.x = Math.PI / 1; // Rotate the circle to be parallel to the ground
        scene.add(this.attackRadiusIndicator);

        // Crie um novo elemento div para o texto do HP
        this.healthText = document.createElement('div');
        this.healthText.style.position = 'absolute';
        this.healthText.style.color = 'white';
        this.healthText.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.healthText.style.padding = '5px';
        this.healthText.style.borderRadius = '5px';
        document.body.appendChild(this.healthText); 
        
    }

    shoot(target) {
        const projectile = new Projectile(this.scene, this.position, target, 0.1);
        this.projectiles.push(projectile);
    }

    update(enemy) {
        const distance = this.position.distanceTo(enemy.cube.position);
        if (distance <= this.attackRadius && this.cooldownCounter === 0) {
            this.shoot(enemy.cube.position);
            this.cooldownCounter = this.cooldown;
        }

        if (this.cooldownCounter > 0) {
            this.cooldownCounter--;
        }

        // Update the projectiles and remove any that have hit the target
        this.projectiles = this.projectiles.filter(projectile => !projectile.update(enemy));

        // Update the health bar
        this.healthBar.style.width = `${this.healthPoints}%`;
        this.healthText.textContent = `Health: ${this.healthPoints}`;
        
        this.updateHPText();

    }

    updateHPText() {
        // Atualize a matriz do mundo da câmera
        this.camera.updateMatrixWorld();
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(this.mesh.matrixWorld);
        vector.project(this.camera);
    
        // Converta as coordenadas normalizadas (-1 a 1) para coordenadas de pixel
        const left = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const top = (vector.y * -0.5 + 0.5) * window.innerHeight;
    
        // Atualize a posição do texto do HP
        this.healthText.style.left = `${left}px`;
        this.healthText.style.top = `${top}px`; // Ajuste o deslocamento conforme necessário
    }

    takeDamage(damage) {
        this.healthPoints -= damage;
        if (this.healthPoints <= 0) {
            this.scene.remove(this.mesh);
            this.scene.remove(this.attackRadiusIndicator);
            this.healthText.remove();
        }
    }

    getDamage() {
        return this.damage;
    }

    getPosition() {
        return this.position;
    }

    getTeam() {
        return this.team;
    }

    isAlive() {
        return this.healthPoints > 0;
    }

    setPosition(position) {
        this.position = position;
        this.mesh.position.copy(position);
        this.attackRadiusIndicator.position.copy(position);
    }

    die() {
        this.scene.remove(this.mesh);
        this.scene.remove(this.attackRadiusIndicator);
        this.healthText.remove();
    }
    

}

export { Tower };