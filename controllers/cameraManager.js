import * as THREE from 'three';

class CameraController {
    constructor(camera, player, offset) {
        this.camera = camera;
        this.player = player;
        this.offset = offset;
    }

    update() {
        this.camera.position.x = this.player.cube.position.x + this.offset.x;
        this.camera.position.y = this.player.cube.position.y + this.offset.y;
        this.camera.position.z = this.player.cube.position.z + this.offset.z;
        this.camera.lookAt(this.player.cube.position);
    }
}

export default CameraController;