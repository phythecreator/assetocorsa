import * as THREE from 'three';
import { Car } from './car.js';
import { Track } from './track.js';
import { InputHandler } from './input.js';

class Engine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.inputs = new InputHandler();
        this.track = new Track(this.scene);
        this.car = new Car(this.scene);

        this.cameraOffset = new THREE.Vector3(0, 3, -7);
        
        this.init();
        this.animate();
    }

    init() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    updateUI() {
        document.getElementById('speedometer').innerHTML = `${this.car.getKmh()} <small>KM/H</small>`;
        const gear = this.car.speed > 0 ? Math.ceil(this.car.getKmh() / 40) || 1 : 'R';
        document.getElementById('gear').innerText = this.car.speed === 0 ? 'N' : gear;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Atualizar Física do Carro
        this.car.update(this.inputs.keys);

        // Suavização da Câmera (Chase Cam)
        const relativeCameraOffset = this.cameraOffset.clone().applyMatrix4(this.car.mesh.matrixWorld);
        this.camera.position.lerp(relativeCameraOffset, 0.1);
        this.camera.lookAt(this.car.mesh.position);

        this.updateUI();
        this.renderer.render(this.scene, this.camera);
    }
}

new Engine();
