import InputManager from './input.js';
import * as THREE from 'three';

class Game {
    constructor(scene, player, terrain,camera,towers,soldier) {
        // aqui ficará a inicialização do jogo, como a criação de objetos, etc, que só precisam ser feitos uma vez, no início do jogo
        this.scene = scene;
        this.terrain = terrain;
        this.player = player;
        this.towers = towers;
        this.camera = camera;
        this.soldier = soldier;
        this.inputManager = new InputManager(this.camera,this.terrain,this.player,this.towers);
        this.raycaster = new THREE.Raycaster();
        this.init();
    }

    init() {
        // essa funcao eh chamada uma vez no inicio do jogo

    }
    
    update() {
        this.player.update();
    }
    
}

export default Game;

// Path: game.js