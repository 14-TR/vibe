import { Knight } from './knight.js';

function checkForCombat(redKnights, blueKnights) {
    redKnights.forEach((red) => {
        if (red.health <= 0 || red.inCombat) return;
        let closestEnemy = findNearestEnemy(red, blueKnights);

        if (closestEnemy) {
            red.attack(closestEnemy);
        } else {
            let nearbyBattle = findNearbyBattle(red, redKnights, blueKnights);
            if (nearbyBattle) {
                red.attack(nearbyBattle);
            }
        }
    });

    blueKnights.forEach((blue) => {
        if (blue.health <= 0 || blue.inCombat) return;
        let closestEnemy = findNearestEnemy(blue, redKnights);

        if (closestEnemy) {
            blue.attack(closestEnemy);
        } else {
            let nearbyBattle = findNearbyBattle(blue, blueKnights, redKnights);
            if (nearbyBattle) {
                blue.attack(nearbyBattle);
            }
        }
    });
}

// 🔹 Finds the closest enemy to attack
function findNearestEnemy(knight, enemyList) {
    let closestEnemy = null;
    let closestDistance = Infinity;

    enemyList.forEach((enemy) => {
        if (enemy.health <= 0 || enemy.isRetreating) return;
        let distance = knight.mesh.position.distanceTo(enemy.mesh.position);

        if (enemy.inCombat) distance *= 0.8; // Prioritize helping allies in fights

        if (distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = enemy;
        }
    });

    return closestEnemy && closestDistance < 3 ? closestEnemy : null; // Adjusted for closer attack range
}

// 🔹 Finds an ongoing battle nearby so idle knights can join
function findNearbyBattle(knight, teamList, enemyList) {
    let closestBattle = null;
    let closestDistance = Infinity;

    teamList.forEach((ally) => {
        if (!ally.inCombat) return;

        enemyList.forEach((enemy) => {
            if (enemy.health <= 0) return;
            let distance = knight.mesh.position.distanceTo(enemy.mesh.position);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestBattle = enemy;
            }
        });
    });

    return closestBattle && closestDistance < 3 ? closestBattle : null;
}

export { checkForCombat };
