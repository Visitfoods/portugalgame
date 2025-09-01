export type FXState = {
  flashA: number;
  flashColor: string;
  vignette: number; // 0..1 extra strength
  speedLines: boolean;
  badKernT: number; // secs remaining for convolution-like pass
};

const st: FXState = {
  flashA: 0,
  flashColor: '#fff',
  vignette: 0.28,
  speedLines: false,
  badKernT: 0,
};

export const FX = {
  onGoodCatch() {
    st.flashA = Math.min(0.18, st.flashA + 0.14);
    st.flashColor = '#ffffff';
  },
  onBadCatch() {
    st.flashA = Math.min(0.16, st.flashA + 0.12);
    st.flashColor = '#ff3333';
    st.badKernT = Math.max(st.badKernT, 0.25); // 250ms effect
  },
  setPenaltyActive(active: boolean) {
    st.vignette = active ? 0.38 : 0.28;
  },
  setSpeedLines(on: boolean) {
    st.speedLines = on;
  },
  tick(dt: number) {
    st.flashA = Math.max(0, st.flashA - dt * 0.6); // per second
    st.badKernT = Math.max(0, st.badKernT - dt);
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

    // Cheap convolution-like pass for "bad" hits: multi-offset composite
    if (st.badKernT > 0) {
      ctx.save();
      ctx.globalAlpha = 0.22 * Math.min(1, st.badKernT * 4);
      ctx.globalCompositeOperation = 'multiply';
      const off = 2; // px offsets
      // four-neighbour taps
      ctx.drawImage(ctx.canvas,  off,  0, W, H, 0, 0, W, H);
      ctx.drawImage(ctx.canvas, -off,  0, W, H, 0, 0, W, H);
      ctx.drawImage(ctx.canvas,  0,  off, W, H, 0, 0, W, H);
      ctx.drawImage(ctx.canvas,  0, -off, W, H, 0, 0, W, H);
      ctx.restore();
      // subtle red overlay
      ctx.save();
      ctx.globalAlpha = 0.08 * Math.min(1, st.badKernT * 4);
      ctx.fillStyle = '#ff2222';
      ctx.fillRect(0,0,W,H);
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
