import { scene, camera, renderer, controls } from './scene.js';
import { Knight } from './knight.js';
import { checkForCombat } from './combat.js';

let redKnights = [];
let blueKnights = [];
const numKnights = 64;
const formationSpacing = 2;
const flankingPercentage = 0.3; // 30% of knights will flank

function spawnKnights(team, color, startX, direction) {
    let knights = [];
    let rowSize = Math.sqrt(numKnights);

    for (let i = 0; i < numKnights; i++) {
        let row = Math.floor(i / rowSize);
        let col = i % rowSize;

        let isFlanker = Math.random() < flankingPercentage;
        let flankDirection = isFlanker ? (Math.random() > 0.5 ? 1 : -1) : 0; // Left or right flank

        let knight = new Knight(
            color,
            startX + (col * formationSpacing - rowSize),
            row * formationSpacing - rowSize / 2,
            team,
            flankDirection // Assign flank direction to knight
        );

        knights.push(knight);
    }
    return knights;
}

redKnights = spawnKnights("red", 0xff0000, -30, 1);
blueKnights = spawnKnights("blue", 0x0000ff, 30, -1);

function charge(knights, direction) {
    knights.forEach(knight => {
        if (!knight.isDead && !knight.isAttacking) {
            knight.charge(direction);
        }
    });
}

function checkChargeCondition() {
    let redFrontline = Math.max(...redKnights.map(knight => knight.mesh.position.x));
    let blueFrontline = Math.min(...blueKnights.map(knight => knight.mesh.position.x));

    let distanceBetweenFrontlines = Math.abs(redFrontline - blueFrontline);

    if (distanceBetweenFrontlines < 20) { 
        charge(redKnights, 1);
        charge(blueKnights, -1);
    }
}

function animate() {
    requestAnimationFrame(animate);

    redKnights.forEach(knight => knight.move(1));
    blueKnights.forEach(knight => knight.move(-1));

    checkChargeCondition();
    checkForCombat(redKnights, blueKnights);

    controls.update(); // 🎮 UPDATE CAMERA CONTROLS
    renderer.render(scene, camera);
}

animate();
