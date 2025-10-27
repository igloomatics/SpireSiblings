const enemyImages = {
    slime: new Image(),
    slimeFrozen: new Image(),
    louse: new Image(),
    louseFrozen: new Image(),
    kakka: new Image(),
    kakkaFrozen: new Image(),
    sentry: new Image(),
    sentryFrozen: new Image(),
};

enemyImages.slime.src = './image/enemy_slime.png';
enemyImages.slimeFrozen.src = './image/enemy_slime_frozen.png';
enemyImages.louse.src = './image/louse.png';
enemyImages.louseFrozen.src = './image/louse_frozen.png';
enemyImages.kakka.src = './image/kakka.png';
enemyImages.kakkaFrozen.src = './image/kakka_frozen.png';
enemyImages.sentry.src = './image/sentry.png';
enemyImages.sentryFrozen.src = './image/sentry_frozen.png';


function spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 400;
    const x = player.x + Math.cos(angle) * distance;
    const y = player.y + Math.sin(angle) * distance;

    // 根据波数决定生成哪种怪物
    let enemyType = 'louse';


    if (currentWave >= 5 && Math.random() < 0.3) {
        enemyType = 'kakka';
    }
    if (currentWave >= 7 && Math.random() < 0.1) {
        enemyType = 'sentry';
    }

    let health, speed, damage, color;

    switch (enemyType) {
        case 'kakka':
            health = 30;
            damage = 4;
            speed = 3.0;
            radius = 15;
            color = '#5ac0dc';
            break;
        case 'sentry':
            health = 500;
            damage = 30;
            speed = 0.5;
            radius = 30;
            color = '#17dee1ff';
            break;
        case 'slime':
            health = 60;
            damage = 5;
            speed = 1.0;
            radius = 15;
            color = '#2c864dff';
            break;
        case 'louse':
            health = 60;
            damage = 5;
            speed = 0.7;
            radius = 25;
            color = '#88da25ff';
            break;
        default:
            const timeMultiplier = 1 + (gameTime / 60);
            health = (baseEnemyHealth + level * 10) * timeMultiplier;
            damage = (baseEnemyDamage + level);
            speed = 1.0;
            radius = 8;
            color = '#ff00ff';
    }

    enemies.push({
        x, y,
        vx: 0, vy: 0,
        radius: radius,
        health, maxHealth: health,
        damage, speed,
        frozen: false, frozenTime: 0,
        nextHitFrame: 0,
        hitCooldownFrames: 60,
        type: enemyType,
        color
    });
}

function spawnBoss() {
    enemies.push({
        x: canvas.width / 2 + 200 * (Math.random() - 0.5),
        y: canvas.height / 2 + 200 * (Math.random() - 0.5),
        vx: 0, vy: 0,
        radius: 30,
        health: 20000,
        maxHealth: 20000,
        damage: 30,
        speed: 1.2,
        frozen: false,
        frozenTime: 0,
        color: '#ff0000',
        isBoss: true,
        nextHitFrame: 0,
        hitCooldownFrames: 30
    });
}

// 刷新敌人
function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        if (enemy.isHit && enemy.hitDuration > 0) {
            enemy.hitDuration--;
            if (enemy.hitDuration <= 0) {
                enemy.isHit = false;
            }
        }

        if (enemy.health <= 0) {
            kills++;
            playKillSound();
            createKillEffect(enemy.x, enemy.y, enemy.color);
            
            drops.push({
                x: enemy.x,
                y: enemy.y,
                type: 'experience',
                color: experienceColor,
                value: 5 * player.expBonus
            });
            
            if (Math.random() < player.coinDropChance) { //金币爆率
                drops.push({
                    x: enemy.x + 10,
                    y: enemy.y + 10,
                    type: 'coin',
                    color: coinColor,
                    value: Math.floor(Math.random() * 10)  //金币一次掉落多少
                });
            }

            /*
            if (Math.random() < 0.1) {
                drops.push({
                    x: enemy.x - 10,
                    y: enemy.y - 10,
                    type: 'health',
                    color: healthDropColor,
                    value: 10
                });
            } 敌人死亡不再掉落棉花糖
            */

            enemies.splice(i, 1);
            continue;
        }

        if (enemy.frozen) {
            enemy.frozenTime--;
            if (enemy.frozenTime <= 0) {
                enemy.frozen = false;
            } else {
                enemy.vx = 0;
                enemy.vy = 0;
            }
        }

        if (!enemy.frozen) {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 0) {
                enemy.vx = (dx / dist) * enemy.speed;
                enemy.vy = (dy / dist) * enemy.speed;
            }
        }

        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist < player.radius + enemy.radius) {
        // 只有在冷却结束时才结算一次伤害
        if (frameCount >= (enemy.nextHitFrame || 0)) {
            const onHitDamage = enemy.damage * (1 - player.agility / 100); // 单次命中伤害（不再 /60）
            player.health -= onHitDamage;

            // 若你之前已实现受伤音效/红色飘字，则沿用
            if (typeof playHurtSound === 'function') playHurtSound();
            if (typeof createDamageNumber === 'function') {
                createDamageNumber(player.x, player.y - 20, onHitDamage, false, 'playerHurt');
            }

            // 设置下一次可伤害时间（1秒后）
            enemy.nextHitFrame = frameCount + (enemy.hitCooldownFrames || 60);

            if (player.health <= 0) {
                gameOver();
            }
        }
    }

    }
}