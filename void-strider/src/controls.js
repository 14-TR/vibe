// controls.js

export const keys = {};

/**
 * Initializes keyboard event listeners.
 */
export function initKeyboard() {
    window.addEventListener("keydown", (e) => keys[e.code] = true);
    window.addEventListener("keyup", (e) => keys[e.code] = false);
}

/**
 * Setup pointer lock on the given canvas.
 */
export function initPointerLock(canvas) {
    const rotationState = { pitch: 0, yaw: 0 };

    canvas.addEventListener("click", () => canvas.requestPointerLock());

    function onPointerMove(event) {
        const speed = 0.002;
        rotationState.yaw -= event.movementX * speed;
        rotationState.pitch -= event.movementY * speed;
    }

    document.addEventListener("pointerlockchange", () => {
        if (document.pointerLockElement === canvas) {
            document.addEventListener("mousemove", onPointerMove);
        } else {
            document.removeEventListener("mousemove", onPointerMove);
        }
    });

    return rotationState;
}
