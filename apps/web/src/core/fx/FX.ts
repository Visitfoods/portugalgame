export type FXState = {
  flashA: number;
  flashColor: string;
  vignette: number; // 0..1 extra strength
  speedLines: boolean;
};

const st: FXState = {
  flashA: 0,
  flashColor: '#fff',
  vignette: 0.28,
  speedLines: false,
};

export const FX = {
  onGoodCatch() {
    st.flashA = Math.min(0.18, st.flashA + 0.14);
    st.flashColor = '#ffffff';
  },
  onBadCatch() {
    st.flashA = Math.min(0.16, st.flashA + 0.12);
    st.flashColor = '#ff3333';
  },
  setPenaltyActive(active: boolean) {
    st.vignette = active ? 0.38 : 0.28;
  },
  setSpeedLines(on: boolean) {
    st.speedLines = on;
  },
  tick(dt: number) {
    st.flashA = Math.max(0, st.flashA - dt * 0.6); // per second
  },
  draw(ctx: CanvasRenderingContext2D, W: number, H: number, dt: number) {
    this.tick(dt);

    // Vignette
    ctx.save();
    const grd = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.45, W/2, H/2, Math.min(W,H)*0.65);
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(1, `rgba(0,0,0,${st.vignette})`);
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,W,H);
    ctx.restore();

    // Speed lines (simple)
    if (st.speedLines) {
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      const lines = 16;
      for (let i=0;i<lines;i++){
        const x = Math.random()*W;
        ctx.beginPath();
        ctx.moveTo(x, -20);
        ctx.lineTo(x + (Math.random()*20-10), H+20);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Flash
    if (st.flashA > 0) {
      ctx.save();
      ctx.globalAlpha = st.flashA;
      ctx.fillStyle = st.flashColor;
      ctx.fillRect(0,0,W,H);
      ctx.restore();
    }
  }
}

