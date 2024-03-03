import * as THREE from 'three';

class Soldier {
    constructor(scene, position,target, attackRadius = 0.4,followRadius = 12, moveSpeed = 0.1, cooldown = 100, healthPoints = 100, damage = 10, team='blue') {
        this.scene = scene;
        this.position = position;
        this.target = target;
        this.healthPoints = 100;
        this.team = team;
        this.mesh = this.createMesh();
        this.scene.add(this.mesh);
        this.attackRadius = attackRadius;
        this.cooldown = cooldown;
        this.cooldownCounter = 0;
        this.healthPoints = healthPoints;
        this.damage = damage;
        this.followRadius = followRadius;
        this.moveSpeed = moveSpeed;

        // Adicione um pequeno valor aleatório à posição
        this.position.x += Math.random() * 4 - 1;
        this.position.y += Math.random() * 4 - 1;

        // apenas pinta um círculo ao redor do soldado attackRadius
        const circleGeometry = new THREE.CircleGeometry(this.attackRadius, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: 'green', side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        this.attackRadiusIndicator = new THREE.Mesh(circleGeometry, circleMaterial);
        this.attackRadiusIndicator.position.copy(position);
        this.attackRadiusIndicator.rotation.x = Math.PI / 1; // Rotate the circle to be parallel to the ground
        scene.add(this.attackRadiusIndicator);

        // apenas pinta um círculo ao redor do soldado followRadius
        this.followRadius = followRadius;
        this.outOfRangeCounter = 0;
        const followCircleGeometry = new THREE.CircleGeometry(this.followRadius, 32);
        const followCircleMaterial = new THREE.MeshBasicMaterial({ color: 'yellow', side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
        this.followRadiusIndicator = new THREE.Mesh(followCircleGeometry, followCircleMaterial);
        this.followRadiusIndicator.position.copy(position);
        this.followRadiusIndicator.rotation.x = Math.PI / 1; // Rotate the circle to be parallel to the ground
        scene.add(this.followRadiusIndicator);
        
    }
    update(player, soldiers, towers) {
        let target = null;
        if (!Array.isArray(soldiers)) {
            console.error('Invalid soldiers argument passed to update. Expected an array.');
            return;
        }
        const separationForce = new THREE.Vector3();
        for (const otherSoldier of soldiers) {
            if (otherSoldier !== this && otherSoldier.isAlive() && this.position.distanceTo(otherSoldier.position) < 1) {
                const force = new THREE.Vector3().subVectors(this.position, otherSoldier.position).normalize().multiplyScalar(0.05);
                separationForce.add(force);
            }
        }
        this.position.add(separationForce);
        // Encontra a torre inimiga mais próxima
        let targetTower = null;
        for (const tower of towers) {
            if (tower.getTeam() !== this.getTeam()) {
                if (!targetTower || this.position.distanceTo(tower.getPosition()) < this.position.distanceTo(targetTower.getPosition())) {
                    targetTower = tower.getPosition();
                }
            }
        }
        
        // Move em direção à torre inimiga mais próxima, se houver uma
        if (targetTower) {
            const direction = new THREE.Vector3().subVectors(targetTower, this.position).normalize().multiplyScalar(this.moveSpeed);
            const newPosition = new THREE.Vector3().addVectors(this.position, direction);
            this.move(newPosition);
        } 
        if (target && target.position && this.position && this.position.distanceTo(target.position) > this.attackRadius) {
            const direction = new THREE.Vector3().subVectors(target.position, this.position).normalize().multiplyScalar(this.moveSpeed);
            const newPosition = new THREE.Vector3().addVectors(this.position, direction);
            this.move(newPosition);
        }
        
        // Find the closest soldier or player within follow radius
        for (const soldier of soldiers) {
            if (this.position && soldier.position) {
                const distance = this.position.distanceTo(soldier.position);
                if (distance <= this.followRadius && soldier.getTeam() !== this.getTeam()) {
                    if (soldier !== this && soldier.isAlive() && (!target || distance < this.position.distanceTo(target.position))) {
                        target = soldier;
                        break;
                }

            }

        }
   
        }
      
        // If no soldier found, check if player is within follow radius
        if (!target && this.position && player.position) {
            const distanceToPlayer = this.position.distanceTo(player.position);
            if (distanceToPlayer <= this.followRadius) {
                target = player;
            }
        }
      
        // Move towards the target if not within attack radius
        if (target && target.position && this.position && this.position.distanceTo(target.position) > this.attackRadius) {
            const direction = new THREE.Vector3().subVectors(target.position, this.position).normalize().multiplyScalar(this.moveSpeed);
            const newPosition = new THREE.Vector3().addVectors(this.position, direction);
            this.move(newPosition);
        }
      
        // Attack the target if within attack radius
        if (target && target.position && this.position && this.position.distanceTo(target.position) <= this.attackRadius && this.cooldownCounter === 0) {
            console.log('Attacking target:', target);
            this.attack(target);
            this.cooldownCounter = this.cooldown;
        }
    
        for (const soldier of soldiers) {
            if (soldier !== this && soldier.isAlive() && soldier.getTeam() !== this.getTeam() && this.position.distanceTo(soldier.position) <= this.attackRadius && this.cooldownCounter === 0) {
                this.attack(soldier);
                this.cooldownCounter = this.cooldown;
            }
        }
        
        
    
        if (this.cooldownCounter > 0) {
            this.cooldownCounter--;
        }
    }
    
    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshBasicMaterial({ color: this.team });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);
        return mesh;
    }

    takeDamage(amount) {
        this.healthPoints -= amount;
        console.log(`Soldier ${this.team} took ${amount} damage. Remaining health: ${this.healthPoints}`);
        if (this.healthPoints <= 0) {
            this.die();
        }
    }
    

    die() {
        this.scene.remove(this.mesh);
        this.scene.remove(this.attackRadiusIndicator);
        this.scene.remove(this.followRadiusIndicator);

        // Remove the health text from the DOM
        
    }

    isAlive() {
        this.outOfRangeCounter++;
        return this.healthPoints > 0;

    }

    getPosition() {
        return this.position;
    }

    setPosition(position) {
        this.position = position;
        this.mesh.position.copy(position);
    }

    attack(target) {
        target.takeDamage(10);
    }

    getTeam() {
        return this.team;
    }

    move(position) {
        this.position = position;
        this.mesh.position.copy(position);
        this.followRadiusIndicator.position.copy(position);
        this.attackRadiusIndicator.position.copy(position);
    }

}

export default Soldier;