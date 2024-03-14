import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class ModelController {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.model = this
    }

    loadModel(url, position, rotation, scale, color, callback) {
        this.loader.load(
            url,
            gltf => {
                const model = gltf.scene;
                model.position.copy(position);
                model.rotation.set(rotation.y, rotation.z, rotation.z);
                model.scale.set(scale, scale, scale);
                if (color) {
                    model.traverse(child => {
                        if (child.isMesh) {
                            child.material.color.set(color);
                        }
                    });
                }
                this.scene.add(model);
                if (callback) callback(model);
                return model;
            },
            undefined,
            error => {
                console.error('Erro ao carregar o modelo:', error);
            }
        );
        
    }

    createSoldier(position, color, callback) {
        const url = './../player.glb';
        const rotation = new THREE.Vector3(0,0,0);
        const scale = 4;
        console.log('color', color);
        this.loadModel(url, position, rotation, scale, color, model => {
            if (callback) callback(model);
            if (model.animations && model.animations.length > 0) {
                console.log('Animações disponíveis:', model.animations.map(clip => clip.name));
            } else {
                console.log('Este modelo não possui animações.');
            }
        });
    }

    createTower(position, color, callback) {
        const url = './../tower.glb';
        const rotation = new THREE.Vector3(0,0,0);
        const scale = 1;
        this.loadModel(url, position, rotation, scale, color, model => {
            if (callback) callback(model);
        });
    }
    
    createProjectile(position, color, callback) {
        const url = './../banana.glb';
        const rotation = new THREE.Vector3(0, 0, 0);
        const scale = 0.8;
        this.loadModel(url, position, rotation, scale, color, model => {
            if (callback) callback(model);
        });
    }
    createTerrain(callback) {
        const url = './../terrain.glb';
        const position = new THREE.Vector3(0,0, -5);
        const rotation = new THREE.Vector3(0, 0, 0);
        const scale = 2;
        this.loadModel(url, position, rotation, scale, null, model => {
            if (callback) callback(model);
        });
    }
    createPlayer(position, color, callback) {
        const url = './../soldier.glb';
        // rotate model
        const rotation = new THREE.Vector3(0, 0, 0);
        const scale = 1;
        this.loadModel(url, position, rotation, scale, color, model => {
            if (callback) callback(model);
        });
    }
    removeModel(model) {
        this.scene.remove(model);
    }


}

export default ModelController;
