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
  _dizzy: false,
  setDizzy(on: boolean){ this._dizzy = on; },
  onGoodCatch() {
    // Flash verde para acertos
    st.flashA = Math.min(0.22, st.flashA + 0.16);
    st.flashColor = '#22c55e';
  },
  onBadCatch() {
    // Flash vermelho para erros
    st.flashA = Math.min(0.20, st.flashA + 0.14);
    st.flashColor = '#ef4444';
    // standby: sem efeitos extra
    st.badKernT = 0;
  },
  setPenaltyActive(active: boolean) {
    // standby: ignorar
    st.vignette = 0.0;
  },
  setSpeedLines(on: boolean) {
    // standby: ignorar
    st.speedLines = false;
  },
  tick(dt: number) {
    st.flashA = Math.max(0, st.flashA - dt * 0.6); // per second
    st.badKernT = 0;
  },
  draw(ctx: CanvasRenderingContext2D, W: number, H: number, dt: number) {
    this.tick(dt);

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
