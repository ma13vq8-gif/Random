const Abilities = {
    slowMo: false,
    dashActive: false,
    
    triggerDash(sword) {
        this.dashActive = true;
        sword.vy = 0; // Freeze gravity briefly
        setTimeout(() => { this.dashActive = false; }, 200);
    },

    update(ctx, canvas) {
        if (this.dashActive) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
};
