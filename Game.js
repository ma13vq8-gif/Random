let gameConfig = {};
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let sword = { x: 50, y: 0, vy: 0, angle: 0 };
let obstacles = [];
let score = 0;
let isGameOver = false;

// Fetch the JSON config from your repo
async function init() {
    const response = await fetch('config.json');
    gameConfig = await response.json();
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    sword.y = canvas.height / 2;
    
    requestAnimationFrame(update);
}

function flap() {
    if (isGameOver) {
        resetGame();
        return;
    }
    sword.vy = gameConfig.physics.jumpForce;
}

function resetGame() {
    score = 0;
    obstacles = [];
    sword.y = canvas.height / 2;
    sword.vy = 0;
    isGameOver = false;
}

// Mobile & Desktop Listeners
window.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, {passive: false});
window.addEventListener('mousedown', flap);

function update() {
    if (!isGameOver) {
        // Physics
        sword.vy += gameConfig.physics.gravity;
        sword.y += sword.vy;
        
        // Rotation: Sword points toward its velocity
        sword.angle = Math.atan2(sword.vy, 10);

        // Spawn obstacles
        if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 250) {
            const gapTop = Math.random() * (canvas.height - gameConfig.gameplay.gapSize - 100) + 50;
            obstacles.push({
                x: canvas.width,
                top: gapTop,
                bottom: gapTop + gameConfig.gameplay.gapSize,
                passed: false
            });
        }

        // Move obstacles
        obstacles.forEach(obs => {
            obs.x -= gameConfig.gameplay.pipeSpeed;
            
            // Collision Detection
            if (sword.x + 40 > obs.x && sword.x < obs.x + 50) {
                if (sword.y < obs.top || sword.y > obs.bottom) {
                    isGameOver = true;
                }
            }
            
            if (!obs.passed && obs.x < sword.x) {
                obs.passed = true;
                score++;
                scoreDisplay.innerText = score;
            }
        });

        if (sword.y > canvas.height || sword.y < 0) isGameOver = true;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Obstacles
    ctx.shadowBlur = 15;
    ctx.shadowColor = gameConfig.design.obstacleColor;
    ctx.fillStyle = gameConfig.design.obstacleColor;
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, 0, 50, obs.top);
        ctx.fillRect(obs.x, obs.bottom, 50, canvas.height - obs.bottom);
    });

    // Draw Sword
    ctx.save();
    ctx.translate(sword.x, sword.y);
    ctx.rotate(sword.angle);
    ctx.shadowBlur = 20;
    ctx.shadowColor = gameConfig.design.glowColor;
    ctx.fillStyle = gameConfig.design.swordColor;
    
    // The Blade
    ctx.fillRect(0, -3, 60, 6); 
    // The Guard (Hilt)
    ctx.fillStyle = gameConfig.design.glowColor;
    ctx.fillRect(5, -12, 4, 24); 
    ctx.restore();
}

init();
