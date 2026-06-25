/*
 * Copyright (c) 2026
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { hilog } from '@kit.PerformanceAnalysisKit';
import { vibrator } from '@kit.SensorServiceKit';
import { audio } from '@kit.AudioKit';

const DOMAIN = 0x0000;
const TAG = 'SoundManager';

/** Game sound effects synthesized programmatically via PCM AudioRenderer. */
export class SoundManager {
  private static instance: SoundManager | null = null;
  private vibratorAvailable: boolean = false;
  private audioRenderer: audio.AudioRenderer | null = null;
  private audioReady: boolean = false;
  private sampleRate: number = 44100;

  // Pre-generated sound buffers
  private bufTap: ArrayBuffer | null = null;
  private bufExplosion: ArrayBuffer | null = null;
  private bufHit: ArrayBuffer | null = null;
  private bufPowerUp: ArrayBuffer | null = null;
  private bufBossWarning: ArrayBuffer | null = null;
  private bufBossHit: ArrayBuffer | null = null;
  private bufLevelClear: ArrayBuffer | null = null;
  private bufGameOver: ArrayBuffer | null = null;

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  /** Initialize audio renderer and pre-generate all sound buffers. */
  async init(): Promise<void> {
    // Init vibrator
    try {
      vibrator.startVibration({ type: 'time', duration: 1 }, { id: 0, usage: 'physicalFeedback' });
      vibrator.stopVibrationSync();
      this.vibratorAvailable = true;
      hilog.info(DOMAIN, TAG, 'Vibrator ready');
    } catch (_) { /* no vibrator */ }

    // Init audio renderer
    try {
      const rendererInfo: audio.AudioRendererInfo = {
        usage: audio.StreamUsage.STREAM_USAGE_GAME,
        rendererFlags: 0,
      };
      const streamParams: audio.AudioStreamInfo = {
        samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_44100,
        channels: audio.AudioChannel.CHANNEL_1,
        sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
        encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW,
      };
      this.audioRenderer = await audio.createAudioRenderer({
        streamInfo: streamParams,
        rendererInfo: rendererInfo,
      });
      await this.audioRenderer.start();
      this.audioReady = true;
      hilog.info(DOMAIN, TAG, 'AudioRenderer ready');

      // Pre-generate all sound buffers
      this.bufTap = this.genTone(800, 50, 'square', true);
      this.bufExplosion = this.genSweep(200, 50, 120, 'sawtooth', 0.3);
      this.bufHit = this.genSweep(400, 80, 100, 'square', 0.35);
      this.bufPowerUp = this.genArpeggio([440, 554, 659], 180, 'sine');
      this.bufBossWarning = this.genPulse(220, 600, 'square');
      this.bufBossHit = this.genTone(80, 80, 'sawtooth', true);
      this.bufLevelClear = this.genArpeggio([440, 554, 659, 880], 350, 'sine');
      this.bufGameOver = this.genSweep(440, 110, 500, 'sine', 0.35);
    } catch (err) {
      hilog.warn(DOMAIN, TAG, 'Audio init failed, game will run without sound');
    }
  }

  // ==================== PCM Synthesis ====================

  /** Generate a simple tone with optional fade-out. */
  private genTone(freq: number, durMs: number,
                  wave: 'sine' | 'square' | 'sawtooth', fadeOut: boolean): ArrayBuffer {
    const n = Math.floor(this.sampleRate * durMs / 1000);
    const buf = new ArrayBuffer(n * 2);
    const v = new DataView(buf);
    for (let i = 0; i < n; i++) {
      const t = i / this.sampleRate;
      let env = 1.0;
      if (fadeOut) env = 1.0 - i / n;
      if (i < 100) env *= i / 100;
      let s = 0;
      if (wave === 'sine') s = Math.sin(2 * Math.PI * freq * t);
      else if (wave === 'square') s = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.6 : -0.6;
      else s = 2 * (freq * t % 1) - 1;
      v.setInt16(i * 2, Math.round(s * env * 30000), true);
    }
    return buf;
  }

  /** Generate a frequency sweep from f1→f2. */
  private genSweep(f1: number, f2: number, durMs: number,
                   wave: 'sine' | 'square' | 'sawtooth', vol: number): ArrayBuffer {
    const n = Math.floor(this.sampleRate * durMs / 1000);
    const buf = new ArrayBuffer(n * 2);
    const v = new DataView(buf);
    for (let i = 0; i < n; i++) {
      const t = i / this.sampleRate;
      const p = i / n;
      const freq = f1 + (f2 - f1) * p;
      let env = 1.0 - p * 0.7;
      if (i < 80) env *= i / 80;
      let s = 0;
      if (wave === 'sine') s = Math.sin(2 * Math.PI * freq * t);
      else if (wave === 'square') s = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.5 : -0.5;
      else s = 2 * (freq * t % 1) - 1;
      v.setInt16(i * 2, Math.round(s * env * 32767 * vol), true);
    }
    return buf;
  }

  /** Generate an ascending arpeggio. */
  private genArpeggio(notes: number[], durMs: number, wave: 'sine' | 'square'): ArrayBuffer {
    const n = Math.floor(this.sampleRate * durMs / 1000);
    const buf = new ArrayBuffer(n * 2);
    const v = new DataView(buf);
    const notesPerSample = notes.length;
    const samplesPerNote = Math.floor(n / notesPerSample);
    for (let i = 0; i < n; i++) {
      const t = i / this.sampleRate;
      const noteIdx = Math.min(Math.floor(i / samplesPerNote), notesPerSample - 1);
      const freq = notes[noteIdx];
      const localI = i - noteIdx * samplesPerNote;
      const localP = localI / samplesPerNote;
      let env = 1.0 - localP * 0.5;
      if (localI < 60) env *= localI / 60;
      let s = 0;
      if (wave === 'sine') s = Math.sin(2 * Math.PI * freq * t);
      else s = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.5 : -0.5;
      v.setInt16(i * 2, Math.round(s * env * 32767 * 0.35), true);
    }
    return buf;
  }

  /** Generate a pulsing tone (alarm-like). */
  private genPulse(freq: number, durMs: number, wave: 'sine' | 'square'): ArrayBuffer {
    const n = Math.floor(this.sampleRate * durMs / 1000);
    const buf = new ArrayBuffer(n * 2);
    const v = new DataView(buf);
    const pulseRate = 8;
    for (let i = 0; i < n; i++) {
      const t = i / this.sampleRate;
      const pulse = (Math.sin(2 * Math.PI * pulseRate * t) * 0.5 + 0.5);
      let s = 0;
      if (wave === 'sine') s = Math.sin(2 * Math.PI * freq * t);
      else s = Math.sin(2 * Math.PI * freq * t) > 0 ? 0.6 : -0.6;
      v.setInt16(i * 2, Math.round(s * pulse * 32767 * 0.3), true);
    }
    return buf;
  }

  // ==================== Playback ====================

  private play(buf: ArrayBuffer | null): void {
    if (!buf || !this.audioReady || !this.audioRenderer) return;
    try {
      this.audioRenderer.write(buf);
    } catch (_) { /* ignore write errors */ }
  }

  // ==================== Vibration ====================

  private vibrate(ms: number): void {
    if (!this.vibratorAvailable) return;
    try {
      vibrator.startVibration({ type: 'time', duration: ms }, { id: 0, usage: 'physicalFeedback' });
    } catch (_) {}
  }

  // ==================== Public API ====================

  /** Firing weapon */
  tap(): void {
    this.play(this.bufTap);
    this.vibrate(20);
  }

  /** Player took damage */
  hit(): void {
    this.play(this.bufHit);
    this.vibrate(50);
  }

  /** Power-up collected */
  powerUp(): void {
    this.play(this.bufPowerUp);
    this.vibrate(100);
  }

  /** Enemy destroyed */
  explosion(): void {
    this.play(this.bufExplosion);
    this.vibrate(30);
  }

  /** Boss appears */
  bossWarning(): void {
    this.play(this.bufBossWarning);
    this.vibrate(200);
  }

  /** Boss hit */
  bossHit(): void {
    this.play(this.bufBossHit);
    this.vibrate(60);
  }

  /** Level complete */
  levelClear(): void {
    this.play(this.bufLevelClear);
    this.vibrate(80);
  }

  /** Game over */
  gameOver(): void {
    this.play(this.bufGameOver);
    this.vibrate(100);
    setTimeout(() => { this.vibrate(100); }, 150);
  }
}
