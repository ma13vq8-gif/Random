const PipeManager = {
    pipes: [],
    
    spawn(canvas, config) {
        const gap = config.settings.pipeGap;
        const minHeight = 50;
        const range = canvas.height - gap - (minHeight * 2);
        const topHeight = Math.random() * range + minHeight;
        
        this.pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + gap,
            passed: false
        });
    },

    update(canvas, config, sword, onScore) {
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            let p = this.pipes[i];
            p.x -= config.settings.speed;

            // Collision Detection
            if (sword.x + 50 > p.x && sword.x < p.x + config.settings.pipeWidth) {
                if (sword.y < p.top || sword.y > p.bottom) {
                    return true; // Return 'True' for Game Over
                }
            }

            // Scoring
            if (!p.passed && p.x < sword.x) {
                p.passed = true;
                onScore();
            }

            // Cleanup
            if (p.x < -100) this.pipes.splice(i, 1);
        }
        return false;
    },

    draw(ctx, config, canvas) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = config.visuals.pipeGlow;
        ctx.fillStyle = config.visuals.pipeColor;
        
        this.pipes.forEach(p => {
            // Top Pipe
            ctx.fillRect(p.x, 0, config.settings.pipeWidth, p.top);
            // Bottom Pipe
            ctx.fillRect(p.x, p.bottom, config.settings.pipeWidth, canvas.height);
        });
        ctx.shadowBlur = 0;
    }
};
