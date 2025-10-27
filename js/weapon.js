const weaponTypes = {
    basicGun: {
        name: '木管枪',
        type: 'ranged',
        fireRate: 30,
        range: 300,
        damage: 20,
        color: '#ffaa00',
        rarity: 'common',
        cost: 30,
        desc: '稳定可靠的火力'
    },
    shotgun: {
        name: '霰弹枪',
        type: 'ranged',
        fireRate: 60,
        range: 150,
        damage: 15,
        pellets: 5,
        spreadAngle: 0.6,
        color: '#ff6600',
        rarity: 'rare',
        cost: 50,
        desc: '发射多个弹丸'
    },
    laser: {
        name: '激光枪',
        type: 'ranged',
        fireRate: 10,
        damage: 1,
        range: 300,
        pierce: 3,
        color: '#ffffff',
        rarity: 'legendary',
        cost: 80,
        desc: '穿透敌人的激光'
    },
    bounceVial: {
        name: '弹跳药瓶',
        type: 'ranged',
        fireRate: 120,        // 投掷频率（帧数，约1.5秒一次）
        range: 300,          // 选择目标的范围
        damage: 25,          // 初始投掷伤害
        color: '#498e24',    // 毒液绿色
        rarity: 'rare',
        cost: 60,
        desc: '投掷毒瓶，产生持续毒圈'
    },
    knife: {
        name: '小刀',
        type: 'ranged',
        fireRate: 35,        // 丢刀频率（帧）
        range: 150,          // 选目标的范围
        damage: 20,          // 基础伤害（会再叠加精准/增伤等）
        color: '#cfcfcf',    // 刃的主色（浅灰）
        rarity: 'common',
        cost: 30,
        desc: '暴击产生3倍伤害',
        // 供绘制用的外观参数（可微调）
        bladeLen: 22,        // 刃长（像素）
        bladeWidth: 7,       // 刃宽
        tipLen: 8,           // 刃尖长度
        handleLen: 10,       // 手柄长度
        handleWidth: 6       // 手柄宽
    },
    sword1: {
        name: '旋转之剑',
        type: 'melee',
        damage: 25,
        color: '#00ff00',
        rarity: 'common',
        radius: 60, //这个是距离玩家的距离
        angle: 0,
        cost: 40,
        desc: '环绕玩家的剑'
    },
    lightningBall: {
        name: '闪电球',
        type: 'floating',
        fireRate: 60,
        damage: 20,
        range: 150,
        color: '#ffff00',
        floatingRadius: 60,
        angle: 0,
        rarity: 'legendary',
        cost: 70,
        desc: '释放闪电攻击'
    },
    frostBall: {
        name: '冰霜球',
        type: 'floating',
        fireRate: 60,
        damage: 15,
        range: 150,
        color: '#00ccff',
        floatingRadius: 70,
        angle: 0,
        rarity: 'rare',
        cost: 50,
        desc: '冻结敌人'
    },
    shadowBall: {
        name: '暗影球',
        type: 'floating',
        fireRate: 70,
        range: 200,
        damage: 30,
        color: '#9966ff',
        floatingRadius: 65,
        angle: 0,
        rarity: 'legendary',
        cost: 85,
        desc: '吸血攻击'
    }
};

// 更新武器
function updateWeapons() {
    // 先统一计算所有浮球的排列（等角间隔 + 同半径）
    const floatingWeapons = player.weapons.filter(w => w.type === 'floating');
    const nFloating = floatingWeapons.length;
    if (nFloating > 0) {
    for (let i = 0; i < nFloating; i++) {
        const w = floatingWeapons[i];
        // 等角间隔：i * (2π / N)
        w.angle = floatingOrbitAngle + (i * (Math.PI * 2 / nFloating));
        // 强制同半径
        w.floatingRadius = FLOATING_ORBIT_RADIUS;
    }
    // 推进全局旋转角（所有球一起转）
    floatingOrbitAngle += FLOATING_ORBIT_SPEED;
    }

    const meleeWeapons = player.weapons.filter(w => w.type === 'melee');
    const nMelee = meleeWeapons.length;
    if (nMelee > 0) {
        for (let i = 0; i < nMelee; i++) {
            const w = meleeWeapons[i];
            // 每把武器自己的 count 把剑，均匀分布在 360° 上
            // 但整体跟着 meleeOrbitAngle 一起转
            w.baseAngle = meleeOrbitAngle + (i * (Math.PI * 2 / nMelee));
        }
        meleeOrbitAngle += MELEE_ROTATION_SPEED; // 全局旋转
    }


    player.weapons.forEach(weapon => {
        if (!weapon.lastFire) weapon.lastFire = 0;
        
        if (weapon.type === 'ranged') {
            weapon.lastFire++;
            if (weapon.lastFire >= weapon.fireRate / player.attackSpeed) {
                fireWeapon(weapon);
                weapon.lastFire = 0;
            }
        } else if (weapon.type === 'melee') {
            //weapon.angle += weapon.rotationSpeed;
            checkMeleeCollision(weapon);
        } else if (weapon.type === 'floating') {
            weapon.lastFire++;
            if (weapon.lastFire >= weapon.fireRate / player.attackSpeed) {
                floatingAttack(weapon);
                weapon.lastFire = 0;
            }
        }
    });
}

// 判定近战武器
function checkMeleeCollision(weapon) {
    const weaponCount = weapon.count || 1;
    const step = (Math.PI * 2) / weaponCount;
    const base = weapon.baseAngle || 0;
    const rad = weapon.radius || 60;
    
    // 剑的几何参数（和 drawSword 保持一致）
    const L = rad - 5;           // 剑身长度
    const swordWidth = 10;       // 剑宽（用于碰撞判定）
    const handleLen = 12;        // 握柄长度

    for (let i = 0; i < weaponCount; i++) {
        const angle = base + i * step;
        
        // 计算剑柄和剑尖的坐标
        const centerX = player.x + Math.cos(angle) * rad;
        const centerY = player.y + Math.sin(angle) * rad;
        
        // 剑柄位置（在中心点后方）
        const handleX = centerX - Math.cos(angle) * handleLen;
        const handleY = centerY - Math.sin(angle) * handleLen;
        
        // 剑尖位置（在中心点前方）
        const tipX = centerX + Math.cos(angle) * L;
        const tipY = centerY + Math.sin(angle) * L;

        if (!Number.isFinite(tipX) || !Number.isFinite(tipY)) continue;

        const baseDamage = (weapon.damage + player.strength) * (1 + player.damageBonus / 100);
        const result = calculateDamage(baseDamage, weapon.name);

        // ===== 检测与敌人的碰撞 =====
        enemies.forEach(enemy => {
            const dist = distanceToLineSegment(
                handleX, handleY,  // 线段起点（剑柄）
                tipX, tipY,        // 线段终点（剑尖）
                enemy.x, enemy.y   // 圆心
            );
            
            // 如果距离 < 敌人半径 + 剑宽的一半，就算命中
            if (dist < enemy.radius + swordWidth / 2) {
                enemy.health -= result.damage;
                createDamageNumber(enemy.x, enemy.y - 15, result.damage, result.isCrit);
            }
        });

        // ===== 检测与火堆的碰撞 =====
        for (let k = campfires.length - 1; k >= 0; k--) {
            const f = campfires[k];
            const distF = distanceToLineSegment(
                handleX, handleY,
                tipX, tipY,
                f.x, f.y
            );
            
            if (distF < f.hitRadius + swordWidth / 2) {
                f.health -= result.damage;
                createDamageNumber(f.x, f.y - 18, result.damage, result.isCrit);

                if (f.health <= 0) {
                    playKillSound();
                    createKillEffect(f.x, f.y, '#ffa94d');
                    for (let d = 0; d < 3; d++) {
                        drops.push({
                            x: f.x + (Math.random() - 0.5) * 20,
                            y: f.y + (Math.random() - 0.5) * 20,
                            type: 'health',
                            color: '#ff69b4',
                            value: 10
                        });
                    }
                    campfires.splice(k, 1);
                }
            }
        }
    }
}

// ===== 工具函数：计算点到线段的最短距离 =====
function distanceToLineSegment(x1, y1, x2, y2, px, py) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    
    // 如果线段退化成点
    if (lengthSquared === 0) {
        return Math.hypot(px - x1, py - y1);
    }
    
    // 计算点 (px, py) 在线段上的投影参数 t
    // t=0 表示投影在起点，t=1 表示投影在终点
    let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));  // 限制在 [0, 1] 范围内
    
    // 计算投影点
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    
    // 返回点到投影点的距离
    return Math.hypot(px - projX, py - projY);
}



// 判定远程武器
function fireWeapon(weapon) {
    // 合并敌人与火堆为“可选目标”
    const candidates = [
    ...enemies.map(e => ({ type: 'enemy', obj: e })),
    ...campfires.map(f => ({ type: 'campfire', obj: f }))
    ];
    if (candidates.length === 0) return;

    // 选择范围内的多个敌人
    const weaponX = player.x;
    const weaponY = player.y;
    const range = (weapon.range + player.scope) || 150; // 默认攻击范围为150

    const targetsInRange = candidates.filter(c => {
        const dist = Math.hypot(c.obj.x - weaponX, c.obj.y - weaponY);
        return dist <= range; // 选择距离武器范围内的敌人
    });

    // 对选中的目标进行伤害
    // 如果范围内没有敌人，直接返回
    if (targetsInRange.length === 0) return;

    // 🎯 从范围内随机选择一个目标
    const target = targetsInRange[Math.floor(Math.random() * targetsInRange.length)];
    const targetEnemy = target.obj;

    // 计算角度、伤害
    const angle = Math.atan2(targetEnemy.y - weaponY, targetEnemy.x - weaponX);
    const baseDamage = (weapon.damage + player.precision) * (1 + player.damageBonus / 100);
    const result = calculateDamage(baseDamage,weapon.type);


        

    //const angle = Math.atan2(targetEnemy.y - player.y, targetEnemy.x - player.x);

    if (weapon.name === '霰弹枪') {
        playShotgunSound();
        for (let i = 0; i < weapon.pellets; i++) {
            const spreadAngle = angle + (Math.random() - 0.5) * weapon.spreadAngle;
            bullets.push({
                x: player.x,
                y: player.y,
                vx: Math.cos(spreadAngle) * 7,
                vy: Math.sin(spreadAngle) * 7,
                radius: 4,
                damage: (weapon.damage + player.precision) * (1 + player.damageBonus / 100),
                color: weapon.color,
                type: 'shotGun'
            });
        }
    } else if (weapon.name === '激光枪') {
        playLaserSound();
        bullets.push({
            x: player.x,
            y: player.y,
            vx: Math.cos(angle) * 10,
            vy: Math.sin(angle) * 10,
            radius: 6,
            damage: (weapon.damage + 0.5*(player.precision)) * (1 + player.damageBonus / 100),
            color: weapon.color,
            type: 'laser',
            pierce: weapon.pierce,
            pierced: 0
        });
    } else if (weapon.name === '小刀') {
        playKnifeThrowSound();// 也可自定义一个更“嗖”的声音

        const speed = 9; // 飞行速度
        bullets.push({
            x: player.x,
            y: player.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 8,                         // 碰撞半径（用于命中判断）
            damage: (weapon.damage + player.precision) * (1 + player.damageBonus / 100),
            color: weapon.color,
            type: 'knife',                     // ✅ 关键：标记是小刀弹体
            angle: angle,                      // 用来按方向绘制
            bladeLen: weapon.bladeLen || 22,   // 传外观参数给渲染
            bladeWidth: weapon.bladeWidth || 7,
            tipLen: weapon.tipLen || 8,
            handleLen: weapon.handleLen || 10,
            handleWidth: weapon.handleWidth || 6
        })} 
        else if (weapon.name === '弹跳药瓶') {
            //playPoisonThrowSound(); // 可自定义音效，击中才有音效
            
            const speed = 8;
            bullets.push({
                x: player.x,
                y: player.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 15,
                damage: result.damage,
                color: weapon.color,
                type: 'poisonVial',
                targetX: targetEnemy.x,  // 记录目标位置
                targetY: targetEnemy.y
            });
        }
        else {
            playBasicGunSound();
            bullets.push({
                x: player.x,
                y: player.y,
                vx: Math.cos(angle) * 8,
                vy: Math.sin(angle) * 8,
                radius: 5,
                damage: (weapon.damage + player.precision) * (1 + player.damageBonus / 100),
                color: weapon.color,
                type: 'basicGun'
        });
    };
}

// 判定远程武器弹道

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        let hitEnemy = false;

        if (bullet.type === 'poisonVial') {
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);

                if (dist < bullet.radius + enemy.radius) {
                    // 1. 造成初始伤害
                    playPoisonThrowSound();
                    enemy.isHit = true;
                    enemy.health -= bullet.damage;
                    createDamageNumber(enemy.x, enemy.y - 15, bullet.damage, false);
                    
                    // 2. 在命中位置生成毒圈
                    poisonZones.push({
                        x: enemy.x,
                        y: enemy.y,
                        radius: 50, // 毒圈半径
                        duration: 300,  // 5秒 = 300帧（假设60fps）
                        createdAt: frameCount
                    });
                    
                    hitEnemy = true;
                    break;
                }
            }
            
            // 也可以命中火堆
            for (let k = campfires.length - 1; k >= 0 && !hitEnemy; k--) {
                const f = campfires[k];
                const distF = Math.hypot(bullet.x - f.x, bullet.y - f.y);
                if (distF < bullet.radius + f.hitRadius) {
                    playPoisonThrowSound();
                    f.health -= bullet.damage;
                    createDamageNumber(f.x, f.y - 18, bullet.damage, false);
                    
                    poisonZones.push({
                        x: f.x,
                        y: f.y,
                        radius: 50,
                        duration: 300,
                        createdAt: frameCount
                    });
                    
                    hitEnemy = true;
                }
                
                if (f.health <= 0) {
                    // ... 火堆死亡掉落逻辑 ...
                }
            }
            
            if (hitEnemy) {
                bullets.splice(i, 1);
                continue;
            }
        }
        
        // ... 其他子弹类型的处理 ...
        
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);

            if (dist < bullet.radius + enemy.radius) {
                const result = calculateDamage(bullet.damage,bullet.type);
                enemy.isHit = true;
                enemy.hitDuration = 5;
                enemy.health -= result.damage;
                createDamageNumber(enemy.x, enemy.y - 15, result.damage, result.isCrit);
                
                if (bullet.type === 'laser' && bullet.pierced < bullet.pierce) {
                    bullet.pierced++;
                } else {
                    hitEnemy = true;
                }
                
                break;
            }
        }

        // 新增：检测击中火堆
        for (let k = campfires.length - 1; k >= 0 && !hitEnemy; k--) {
            const f = campfires[k];
            const distF = Math.hypot(bullet.x - f.x, bullet.y - f.y);
            if (distF < bullet.radius + f.hitRadius) {
                // 把子弹伤害走同样的暴击计算
                const result = calculateDamage(bullet.damage);
                f.health -= result.damage;
                createDamageNumber(f.x, f.y - 18, result.damage, result.isCrit);

                // 子弹处理（激光可穿透，普通消失）
                if (bullet.type === 'laser' && bullet.pierced < bullet.pierce) {
                    bullet.pierced++;
                } 
                else {
                    hitEnemy = true;
                }
            }
            // 火堆被打爆：掉3个血包
            if (f.health <= 0) {
            playKillSound();
            createKillEffect(f.x, f.y, '#ffa94d');
            for (let d = 0; d < 3; d++) {
                drops.push({
                x: f.x + (Math.random() - 0.5) * 20,
                y: f.y + (Math.random() - 0.5) * 20,
                type: 'health',
                color: healthDropColor,
                value: 10
                });
            }
            campfires.splice(k, 1);
            }
        }


        if (hitEnemy) {
            bullets.splice(i, 1);
            continue;
        }

        if (bullet.x < -50 || bullet.x > canvas.width + 50 || 
            bullet.y < -50 || bullet.y > canvas.height + 50) {
            bullets.splice(i, 1);
        }
    }
}

// 判定浮球武器
function floatingAttack(weapon) {
    // 允许浮球攻击敌人或火堆
    const candidates = [
        ...enemies.map(e => ({ type: 'enemy', obj: e })),
        ...campfires.map(f => ({ type: 'campfire', obj: f }))
    ];
    if (candidates.length === 0) return;

    const weaponX = player.x + Math.cos(weapon.angle) * weapon.floatingRadius;
    const weaponY = player.y + Math.sin(weapon.angle) * weapon.floatingRadius;
    const range = weapon.range || 150; // 默认攻击范围为150


    const targetsInRange = candidates.filter(c => {
        const dist = Math.hypot(c.obj.x - weaponX, c.obj.y - weaponY);
        return dist <= range;
    });

// 对选中的目标进行攻击
    targetsInRange.forEach(target => {
    const targetEnemy = target.obj;
    const baseDamage = (weapon.damage + player.focus) * (1 + player.damageBonus / 100);
    const result = calculateDamage(baseDamage,weapon.type);

    if (weapon.name === '闪电球') {
        playLightningSound();
        targetEnemy.isHit = true;
        targetEnemy.hitDuration = 5;
        targetEnemy.health -= result.damage;
        createDamageNumber(targetEnemy.x, targetEnemy.y - 15, result.damage, result.isCrit);
        createLightningEffect(weaponX, weaponY, targetEnemy.x, targetEnemy.y);
    } else if (weapon.name === '冰霜球') {
        playFrostSound();
        targetEnemy.isHit= true;
        targetEnemy.hitDuration = 5;
        targetEnemy.health -= result.damage;
        createDamageNumber(targetEnemy.x, targetEnemy.y - 15, result.damage, result.isCrit);
        targetEnemy.frozen = true;
        targetEnemy.frozenTime = 120;
    } else if (weapon.name === '暗影球') {
        playShadowSound();
        targetEnemy.isHit = true;
        targetEnemy.hitDuration = 5;
        targetEnemy.health -= result.damage;
        createDamageNumber(targetEnemy.x, targetEnemy.y - 15, result.damage, result.isCrit);
        player.health = Math.min(player.maxHealth, player.health + result.damage * 0.3);
    }

    // 🔽 处理火堆死亡掉落
    if (target.type === 'campfire' && targetEnemy.health <= 0) {
        playKillSound();
        createKillEffect(targetEnemy.x, targetEnemy.y, '#ffa94d');
        for (let d = 0; d < 3; d++) {
            drops.push({
                x: targetEnemy.x + (Math.random() - 0.5) * 20,
                y: targetEnemy.y + (Math.random() - 0.5) * 20,
                type: 'health',
                color: healthDropColor,
                value: 10
            });
        }
        const idx = campfires.indexOf(targetEnemy);
        if (idx >= 0) campfires.splice(idx, 1);
    }
    });
}