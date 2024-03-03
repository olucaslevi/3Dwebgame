import * as THREE from 'three';

// Componentes principais
import Game from './game';
import Player from './controllers/Player';
import TerrainManager from './controllers/terrainManager';
import InputManager from './input';
import CameraController from './controllers/cameraManager';
import { Tower } from './controllers/towerController';
import HealthBarManager from './controllers/healthBarManager';
import Soldier from './controllers/Soldier';

// Create a raycaster and a mouse vector
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// Create a scene, a camera and a renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const towers = [];
const soldiers = [];

function createTowers() {
    const tower1 = new Tower(scene, new THREE.Vector3(-40, 0, 0), 20, 100, 100, 10, camera, 'blue');
    const tower2 = new Tower(scene, new THREE.Vector3(40, 30, 0), 20, 100, 100, 10, camera, 'red');
    towers.push(tower1, tower2); 
  }

  function createSoldiers(towers) {
    // 8 instancias de soldado p/ duas de torre
    const soldier1 = new Soldier(scene, towers[0].getPosition(), null, 2, 10, 0.1, 50, 100, 10, 'blue');
    const soldier2 = new Soldier(scene, towers[1].getPosition(), null, 2, 10, 0.1, 50, 100, 10, 'red');
    const soldier3 = new Soldier(scene, towers[0].getPosition(), null, 2, 10, 0.1, 50, 100, 10, 'blue');
    const soldier4 = new Soldier(scene, towers[1].getPosition(), null, 2, 10, 0.1, 50, 100, 10, 'red');
    const soldier5 = new Soldier(scene, towers[0].getPosition(), null, 2, 10, 0.1, 50, 100, 10, 'blue');
    const soldier6 = new Soldier(scene, towers[1].getPosition(), null, 2, 10, 0.1, 50, 100, 10, 'red');
    const soldier7 = new Soldier(scene, towers[0].getPosition(), null, 2, 10, 0.1, 50, 100, 10, 'blue');
    const soldier8 = new Soldier(scene, towers[1].getPosition(), null, 2, 10, 0.1, 50, 100, 10, 'red');

    
    soldiers.push(soldier1, soldier2, soldier3, soldier4, soldier5, soldier6, soldier7, soldier8);

  }


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const player = new Player(scene,camera,renderer,'blue');
const healthBar = new HealthBarManager(player, camera, renderer);
const terrainManager = new TerrainManager(scene);
const terrain = terrainManager.createTerrain();

createTowers();
createSoldiers(towers);


const inputManager = new InputManager(camera, terrain, player,towers,soldiers);

camera.position.z = 10;


const offset = new THREE.Vector3(0, -10, 20);  // Adjust the camera
const cameraController = new CameraController(camera, player, offset);

const game = new Game(scene, player, terrain, camera);

function animate() {
    requestAnimationFrame(animate);
    game.update();
    player.update();
    towers.forEach(tower => tower.update(player));
    soldiers.forEach(soldier => soldier.update(player,soldiers,towers));
    cameraController.update();
    healthBar.update();
    renderer.render(scene, camera);
}

animate();