class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted = false;
  private lastBeat = 0;

  private ensureCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public unlock() {
    this.ensureCtx();
  }

  public tone(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.06, slide?: number) {
    if (this.muted) return;
    this.ensureCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slide) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slide), now + dur);
    }

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + dur);
  }

  public blip(pitch = 400) {
    this.tone(pitch + Math.random() * 45, 0.042, 'square', 0.032);
  }

  public pickup() {
    this.tone(520, 0.08, 'triangle', 0.08);
    setTimeout(() => this.tone(780, 0.14, 'triangle', 0.08), 75);
  }

  public save() {
    this.tone(440, 0.1, 'sine', 0.08);
    setTimeout(() => this.tone(660, 0.1, 'sine', 0.08), 90);
    setTimeout(() => this.tone(880, 0.22, 'sine', 0.09), 180);
  }

  public hurt() {
    this.tone(145, 0.26, 'sawtooth', 0.13, 50);
  }

  public locked() {
    this.tone(180, 0.09, 'triangle', 0.07, 120);
  }

  public kick() {
    this.tone(195, 0.12, 'sine', 0.11, 60);
  }

  public goal() {
    this.tone(523, 0.1, 'triangle', 0.1);
    setTimeout(() => this.tone(659, 0.1, 'triangle', 0.1), 100);
    setTimeout(() => this.tone(784, 0.24, 'triangle', 0.11), 200);
  }

  public fearPulse(intensity: number) {
    const now = performance.now();
    const interval = Math.max(230, 920 - intensity * 660);
    if (now - this.lastBeat > interval) {
      this.lastBeat = now;
      this.tone(64, 0.15, 'sine', 0.08 + intensity * 0.11, 36);
      if (intensity > 0.62) {
        this.tone(880 + Math.random() * 240, 0.09, 'sawtooth', 0.028, 640);
      }
    }
  }
}

export const soundEngine = new SoundEngine();
