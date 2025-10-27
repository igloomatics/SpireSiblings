const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// 通用函数：生成音效
function playGunSound({ frequency = 400, duration = 0.1, volume = 0.3, type = 'square' }) {
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.type = type;
oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
oscillator.start();
oscillator.stop(audioContext.currentTime + duration);
}

// 三种武器专用音效
//function playBasicGunSound() {
    // 手枪：中等音调，短促，适中音量
//    playGunSound({ frequency: 200, duration: 0.1, volume: 0.3, type: 'square' });
//}

function playBasicGunSound() {
    //playGunSound({ frequency: 700, duration: 0.1, volume: 0.5, type: 'square' });
    //playGunSound({ frequency: 200, duration: 0.1, volume: 0.3, type: 'square' });
    //playGunSound({ frequency: 80, duration: 0.3, volume: 0.5, type: 'square' });
    const audio = new Audio('sound/GunSound.mp3'); // 这里路径可以改成你的本地路径
    audio.volume = 0.3; // 音量（0.0 ~ 1.0）
    audio.play();
}

function playKnifeThrowSound() {
    playGunSound({ frequency: 2000, duration: 0.1, volume: 0.3, type: 'triangle' });
}

function playShotgunSound() {
    // 霰弹枪：低频轰鸣+轻微震荡
    playGunSound({ frequency: 150, duration: 0.25, volume: 0.7, type: 'sawtooth' });
    playGunSound({ frequency: 80, duration: 0.15, volume: 0.5, type: 'square' });
}

function playLaserSound() {
    // 激光枪：高频清脆
    playGunSound({ frequency: 1200, duration: 0.05, volume: 0.3, type: 'triangle' });
}

function playHurtSound() {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain); gain.connect(audioContext.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(140, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
    osc.start(); osc.stop(audioContext.currentTime + 0.12);
}


function playKillSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playPickupSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
}

function playPoisonThrowSound() {
    const audio = new Audio('sound/glass.mp3'); // 这里路径可以改成你的本地路径
    audio.playbackRate = 1.5;
    audio.volume = 0.2; // 音量（0.0 ~ 1.0）
    audio.play();
}

function playLightningSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.08);
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
}

function playFrostSound() {
    const audio = new Audio('sound/FrostBall.mp3'); // 这里路径可以改成你的本地路径
    audio.volume = 0.1; // 音量（0.0 ~ 1.0）
    audio.play();
}

function playShadowSound() {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain); gain.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, audioContext.currentTime + 0.12);
    gain.gain.setValueAtTime(0.14, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
    osc.start(); osc.stop(audioContext.currentTime + 0.12);
}