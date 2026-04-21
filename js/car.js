import * as THREE from 'three';

export class Car {
    constructor(scene) {
        this.scene = scene;
        this.mesh = this.createCarMesh();
        this.scene.add(this.mesh);

        // Propriedades Físicas
        this.velocity = new THREE.Vector3();
        this.speed = 0;
        this.acceleration = 0.15;
        this.friction = 0.98;
        this.steering = 0;
        this.maxSteer = 0.04;
        this.maxSpeed = 1.8;
        this.angle = 0;

        // Rodas (para animação)
        this.wheels = [];
    }

    createCarMesh() {
        const group = new THREE.Group();

        // Carroceria (Chassis)
        const bodyGeom = new THREE.BoxGeometry(1.2, 0.6, 2.5);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.y = 0.5;
        group.add(body);

        // Teto
        const cabinGeom = new THREE.BoxGeometry(1.0, 0.5, 1.2);
        const cabin = new THREE.Mesh(cabinGeom, bodyMat);
        cabin.position.y = 1.0;
        cabin.position.z = -0.2;
        group.add(cabin);

        // Rodas
        const wheelGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 24);
        wheelGeom.rotateZ(Math.PI / 2);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

        const wheelPositions = [
            { x: 0.7, y: 0.35, z: 0.9 },  // Front Left
            { x: -0.7, y: 0.35, z: 0.9 }, // Front Right
            { x: 0.7, y: 0.35, z: -0.9 }, // Back Left
            { x: -0.7, y: 0.35, z: -0.9 } // Back Right
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeom, wheelMat);
            wheel.position.set(pos.x, pos.y, pos.z);
            group.add(wheel);
            this.wheels.push(wheel);
        });

        return group;
    }

    update(inputs) {
        // Lógica de Aceleração
        if (inputs.forward) {
            this.speed += this.acceleration;
        } else if (inputs.backward) {
            this.speed -= this.acceleration * 0.5;
        }

        // Fricção Natural
        this.speed *= this.friction;

        // Direção
        if (Math.abs(this.speed) > 0.01) {
            const steerDir = this.speed > 0 ? 1 : -1;
            if (inputs.left) this.angle += this.maxSteer * steerDir;
            if (inputs.right) this.angle -= this.maxSteer * steerDir;
        }

        // Limites
        this.speed = THREE.MathUtils.clamp(this.speed, -this.maxSpeed/2, this.maxSpeed);

        // Aplicar Movimento
        this.velocity.x = Math.sin(this.angle) * this.speed;
        this.velocity.z = Math.cos(this.angle) * this.speed;

        this.mesh.position.add(this.velocity);
        this.mesh.rotation.y = this.angle;

        // Animação das Rodas
        this.wheels.forEach((w, i) => {
            w.rotation.x += this.speed;
            if (i < 2) { // Rodas da frente viram
                w.rotation.y = inputs.left ? 0.3 : inputs.right ? -0.3 : 0;
            }
        });
    }

    getKmh() {
        return Math.round(Math.abs(this.speed) * 150);
    }
}
