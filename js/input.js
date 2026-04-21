export class InputHandler {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            brake: false,
            reset: false
        };

        window.addEventListener('keydown', (e) => this.update(e, true));
        window.addEventListener('keyup', (e) => this.update(e, false));
    }

    update(e, status) {
        switch(e.code) {
            case 'KeyW': case 'ArrowUp': this.keys.forward = status; break;
            case 'KeyS': case 'ArrowDown': this.keys.backward = status; break;
            case 'KeyA': case 'ArrowLeft': this.keys.left = status; break;
            case 'KeyD': case 'ArrowRight': this.keys.right = status; break;
            case 'Space': this.keys.brake = status; break;
            case 'KeyR': this.keys.reset = status; break;
        }
    }
}
