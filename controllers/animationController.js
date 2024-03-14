import * as THREE from 'three';

class AnimationController {
    constructor(scene) {
        this.scene = scene;
        this.mixers = [];
    }

    createMixer(model) {
        const mixer = new THREE.AnimationMixer(model);
        this.mixers.push(mixer);
        return mixer;
    }

    update(deltaTime) {
        this.mixers.forEach(mixer => {
            mixer.update(deltaTime);
        });
    }
}

export default AnimationController;
