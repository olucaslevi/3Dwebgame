import * as THREE from 'three';
import { HealthBarManager } from './healthBarManager';
import ModelController from './modelController';
class Player {
    constructor(scene, position, camera, renderer, team) {
        this.position = position;
        this.team = team;
        this.mesh = this.createMesh();
        scene.add(this.mesh);
        this.targetPosition = null;
        this.speed = 0.1;
        this.healthPoints = 100;
        this.damage = 10;
        this.camera = camera;
        this.renderer = renderer;
        this.attackRange = 10;
        this.target = null; // Inicialmente sem alvo
        this.cooldown = 60;
        // pintar attackRange
        const geometry = new THREE.CircleGeometry(this.attackRange, 32);
        const material = new THREE.LineBasicMaterial({ color: this.team });
        this.attackRadiusIndicator = new THREE.LineLoop(geometry, material);
        this.attackRadiusIndicator.position.copy(position);
        scene.add(this.attackRadiusIndicator);
        // player healthbar
        this.healthBarManager = new HealthBarManager(this, camera, renderer);
        this.model = null
        this.modelController = new ModelController(scene);
        this.modelController.createPlayer(this.position, this.team, model => {
            this.model = model;
        });

    }

    moveTo(position, target = null) {
        this.targetPosition = position.clone();
        if (target) {
        this.target = target;
        }
    }
  

    createMesh() {
        const geometry = new THREE.ConeGeometry(2, 2, 4);
        const material = new THREE.MeshBasicMaterial({ color: this.team,opacity: 0.5, transparent: true, side: THREE.DoubleSide, wireframe: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);
        return mesh;
    }

    takeDamage(damage) {
        if (this.healthPoints <= 0) {
            return;
        }
        this.healthPoints -= damage;
        if (this.healthPoints <= 0) {
            this.healthPoints = 0;
        }
        // Atualizar barra de vida
        this.healthBarManager.update();
    }

    attack(target) {
        if (this.cooldown > 0) {
            return;
        }
    
        const distance = this.mesh.position.distanceTo(target.position);
        if (distance <= this.attackRange) {
            target.takeDamage(this.damage);
        }
    
        this.cooldown = 60;
    }


    update() {
        // Atualizar raio de ataque
        this.attackRadiusIndicator.position.copy(this.mesh.position);
        if (this.model){
            this.model.position.copy(this.mesh.position);
            this.model.rotation.copy(this.mesh.rotation);
        }
        
        if (this.cooldown > 0) {
            this.cooldown--;
        }
    
        if (this.target) {
            // Verifica se o alvo está vivo
            if (!this.target.isAlive()) {
                this.target = null; // Define o alvo como null se o alvo estiver morto
                return;
            }
    
            // Verifica se o jogador está dentro do alcance de ataque
            const distanceToTarget = this.mesh.position.distanceTo(this.target.mesh.position);
            if (distanceToTarget <= this.attackRange) {
                this.attack(this.target);
                return; // O jogador já está atacando, então não precisa se mover
            }
            
            // Se o jogador não estiver no alcance de ataque, ele se move até o alvo
            const direction = new THREE.Vector3().subVectors(this.targetPosition, this.mesh.position).normalize();
            const distanceToMove = Math.min(this.speed, distanceToTarget); // Limita a distância do movimento
            this.mesh.position.addScaledVector(direction, distanceToMove);
    
            // Aplica a rotação em torno do eixo Y usando quaternions
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
            this.mesh.quaternion.copy(quaternion);
        } else if (this.targetPosition !== null) {
            // Se não houver um alvo e houver uma posição do alvo, o jogador se move até essa posição
            const direction = new THREE.Vector3().subVectors(this.targetPosition, this.mesh.position).normalize();
            const distanceToMove = Math.min(this.speed, this.mesh.position.distanceTo(this.targetPosition)); // Limita a distância do movimento
            this.mesh.position.addScaledVector(direction, distanceToMove);
            
            // Aplica a rotação em torno do eixo Y usando quaternions
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
            this.mesh.quaternion.copy(quaternion);
    
            // Verifica se o jogador chegou à posição do alvo
            if (this.mesh.position.distanceTo(this.targetPosition) < 0.3) {
                this.targetPosition = null; // Remove a posição do alvo quando o jogador chega lá
            }
        }
    }
    

    getPosition() {
        return this.mesh.position.clone();
    }

    isAlive() {
        return this.healthPoints > 0;
    }

    getTeam() {
        return this.team;
    }

    setTarget(target) {
        if (target && target.isAlive()) {
            this.target = target;
            console.log('target', target.position);
            this.targetPosition = target.position.clone(); // Define a posição do alvo como a posição do alvo atual
        } else {
            this.target = null; // Define o alvo como null se não houver um alvo válido
        }
    }
    getTarget() {
        return this.target ? this.target.position.clone() : null;
    }
    createHealthBar() {
        const geometry = new THREE.BoxGeometry(1, 0.2, 0.2);
        geometry.rotateY(Math.PI / 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const healthBar = new THREE.Mesh(geometry, material);
        healthBar.scale.set(this.healthPoints / 100, 0.1, 1); 
        
        return healthBar;
    }
    remove() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.scene.remove(this.mesh);
    }

    updateHealthText() {
        this.healthBar.scale.x = this.healthPoints / 100;
    }
    
}

export default Player;
