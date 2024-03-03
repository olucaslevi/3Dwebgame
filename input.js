import * as THREE from 'three';

class InputManager {
  constructor(camera,terrain,player,soldiers) {
      this.mouse = {
          x: 0,
          y: 0,
          clicked: false
      };
      this.camera = camera;
      this.player = player;
      this.towers = [];
      this.terrain = terrain;
      this.soldiers = soldiers;
      this.raycaster = new THREE.Raycaster(); 
      window.addEventListener('mousemove', (event) => this.onMouseMove(event));
      window.addEventListener('mousedown', (event) => this.onMouseDown(event));
      window.addEventListener('mouseup', () => this.onMouseUp());
  }

  onMouseMove(event) {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  
  onMouseDown(event) {
    this.mouse.clicked = true;

    // Normaliza as coordenadas do mouse
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cria um Raycaster
    const raycaster = new THREE.Raycaster();

    // Define o raio a partir da posição da câmera e direciona para as coordenadas do mouse
    raycaster.setFromCamera(this.mouse, this.camera);

    // Certifique-se de que o terreno está definido
    if (this.terrain) {
        // Obtem a lista de todos os objetos que o raio intersecta
        const intersects = raycaster.intersectObjects([this.terrain]);

        // Se o raio intersecta o terreno

        if (intersects.length > 0) {
            this.mouse.worldPosition = intersects[0].point;
    
            // Verifica se o usuário clicou perto de uma torre
            
    
            // Se o usuário não clicou em uma torre, move o jogador
            this.player.moveTo(this.mouse.worldPosition);
        }

    }
}

  onMouseUp() {
      this.mouse.clicked = false;
  }

  getMouse() {
      return this.mouse;
  }
}

export default InputManager;