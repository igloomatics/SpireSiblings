// === 遗物定义 ===
const relicTypes = {
    //==英雄初始遗物==
    
    BurningBlood:{
        key: 'BurningBlood',
        name: '燃烧之血',
        desc: '最大生命值+20, 每层战斗后回复10点生命',
        lore: '你穿着红色的裤衩',
        category: 'unique', 
        shopAvailable: false, 
        cost: 0,
        applyOnPickup: () => {
            player.maxHealth += 20;
            player.health += 20;
        }
    },
    RingOfTheSnake:{
        key: 'RingOfTheSnake',
        name: '蛇之戒指',
        desc: '暴击率+20',
        lore: '优秀的女猎手',
        category: 'unique', 
        shopAvailable: false, 
        cost: 0,
        applyOnPickup: () => {
            player.critRate += 20;
        }
    },
    CrackedCore:{
        key: 'CrackedCore',
        name: '破损核心',
        desc: '额外生成一个闪电球',
        lore: '原来是尖塔第四厉害的角色',
        category: 'unique', 
        shopAvailable: false, 
        cost: 0,
        applyOnPickup: () => {
            const lightningBall = JSON.parse(JSON.stringify(weaponTypes.lightningBall));
            lightningBall.lastFire = 0;
            player.weapons.push(lightningBall);
        }
    },
    PureWater:{
        key: 'PureWater',
        name: '至纯之水',
        desc: '加快移动速度和攻击速度',
        lore: '观者伟大无需多言',
        category: 'unique', 
        shopAvailable: false, 
        cost: 0,
        applyOnPickup: () => {
            player.speed+=0.2;
            player.attackSpeed+=0.5;
        }
    },
    redSkull: {
        key: 'redSkull',
        name: '红头骨',
        desc: '力量 + 10',
        lore: '你也想获得恶魔的力量？',
        category: 'ordinary', //可多次获得
        cost: 100,
        applyOnPickup: () => {
            player.strength += 10;
        }
    },
        bed: {
        key: 'bed',
        name: '床',
        rarity: 'legendary',
        lore: '人是铁打的床是磁铁打的',
        desc: '移速 -30%，攻速 +50%',
        category: 'ordinary',
        cost: 120,
        applyOnPickup: () => {
            player.baseSpeed *= 0.7;         // 移速乘以 0.8
            player.speed = player.baseSpeed;
            player.attackSpeed *= 1.5;       // 攻速 ×1.5（即+50%）
        }
    },

    orichalcum: {
        key: 'orichalcum',
        name: '奥利哈钢',
        rarity: 'common',
        desc: '敏捷 +5',
        lore: '放心, 在这款游戏中没有东西能卡你的哈钢',
        category: 'ordinary', //可多次获得
        cost: 50,
        applyOnPickup: () => {
            player.agility += 5;
        }
    },

    dataDisk: {
        key: 'dataDisk',
        name: '数据磁盘',
        rarity: 'common',
        desc: '集中 +7',
        lore: '求求你我不想天天看鸟片和蛇片了',
        category: 'ordinary', //可多次获得
        cost: 50,
        applyOnPickup: () => {
            player.focus += 7;
        }
    },

    telescope: {
        key: 'telescope',
        name: '望远镜',
        rarity: 'common',
        desc: '范围 +15',
        lore: '一起看星星吧',
        category: 'ordinary', //可多次获得
        cost: 40,
        applyOnPickup: () => {
            player.scope += 15;
        }
    },

    goldStatue: {
        key: 'goldStatue',
        name: '金神像',
        rarity: 'legendary',
        desc: '金币爆率增加',
        lore: '只是拿在手里就觉得自己有钱了',
        category: 'unique', //可多次获得
        cost: 60,
        applyOnPickup: () => {
            player.coinDropChance += 0.05;
        }
    },

    flyBoot: {
        key: 'flyBoot',
        name: '赫尔墨斯之靴',
        rarity: 'common',
        desc: '移速+0.5x',
        lore: '据说是从一个像素大陆中捡到的',
        category: 'ordinary', //可多次获得
        cost: 20,
        applyOnPickup: () => {
            player.speed += 0.5;
        }
    },

    bigMouth: {
        key: 'bigMouth',
        name: '巨口存钱罐',
        rarity: 'rare',
        desc: '敌人掉落更多经验',
        lore: '吃吃吃吃吃',
        category: 'ordinary', //可多次获得
        cost: 60,
        applyOnPickup: () => {
            player.expBonus += 0.2;
        }
    },

    angry: {
        key: 'angry',
        name: '愤怒',
        rarity: 'legendary',
        desc: '增伤+100, 敏捷-100',
        lore: '从一个紫皮人身上学习的的姿态',
        category: 'unique', //可多次获得
        cost: 150,
        applyOnPickup: () => {
            player.damageBonus += 100;
            player.agility -= 100;
        }
    },

    angry: {
        key: 'angry',
        name: '愤怒',
        rarity: 'legendary',
        desc: '增伤+100, 敏捷-100',
        lore: '从一个紫皮人身上学习的的姿态',
        category: 'unique', //可多次获得
        cost: 150,
        applyOnPickup: () => {
            player.damageBonus += 100;
            player.agility -= 100;
        }
    },

    adrenalin: {
        key: 'adrenalin',
        name: '肾上腺素',
        rarity: 'legendary',
        desc: '攻速+20, 范围-25',
        lore: '你感到兴奋。',
        category: 'unique', 
        cost: 200,
        applyOnPickup: () => {
            player.attackSpeed += 20;
            player.scope -= 25;
        }
    },

    Waffle: {
        key: 'Waffle',
        name: '李家华夫饼',
        rarity: 'rare',
        desc: '回复满你的血量。',
        lore: '吃完饱饱的，很幸福。',
        category: 'common', 
        cost: 100,
        applyOnPickup: () => {
            player.health = player.maxHealth;
        }
    },
// 可在此扩充更多遗物……
};