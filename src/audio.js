let ctx = null;
let masterGain = null;
let ambientNodes = null;
let muted = false;

function getContext() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function initAudio() {
  getContext();
  if (!ambientNodes) startAmbient();
}

export function playTap() {
  const context = getContext();
  const now = context.currentTime;

  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.16);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.22, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.24);

  const osc2 = context.createOscillator();
  const gain2 = context.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(1320, now);
  osc2.frequency.exponentialRampToValueAtTime(660, now + 0.14);
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.08, now + 0.006);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc2.connect(gain2);
  gain2.connect(masterGain);
  osc2.start(now);
  osc2.stop(now + 0.18);
}

export function startAmbient() {
  const context = getContext();
  const now = context.currentTime;

  const padGain = context.createGain();
  padGain.gain.setValueAtTime(0, now);
  padGain.gain.linearRampToValueAtTime(0.035, now + 3);
  padGain.connect(masterGain);

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.6;
  filter.connect(padGain);

  const freqs = [130.81, 164.81, 196.0];
  const oscs = freqs.map((f, i) => {
    const o = context.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    o.detune.value = i === 1 ? 4 : -4;
    o.connect(filter);
    o.start(now);
    return o;
  });

  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 260;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start(now);

  ambientNodes = { padGain, filter, oscs, lfo, lfoGain };
}

export function toggleMute() {
  const context = getContext();
  muted = !muted;
  masterGain.gain.linearRampToValueAtTime(muted ? 0 : 1, context.currentTime + 0.15);
  return muted;
}