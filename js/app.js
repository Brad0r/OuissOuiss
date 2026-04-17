/* ==========================================================
   OuissOuiss — Sky Music Web App
   Audio engine faithfully ported from SabSab project
   + Sky Music Nightly instruments from Specy/genshin-music (MIT)
   ========================================================== */

// ==================== NOTE DEFINITIONS (exact from SabSab) ====================

const NOTES = [
  { id: "c3", name: "Do",  label: "Do3",  key: "Y", freq: 130.81 },
  { id: "d3", name: "Ré",  label: "Ré3",  key: "U", freq: 146.83 },
  { id: "e3", name: "Mi",  label: "Mi3",  key: "I", freq: 164.81 },
  { id: "f3", name: "Fa",  label: "Fa3",  key: "O", freq: 174.61 },
  { id: "g3", name: "Sol", label: "Sol3", key: "P", freq: 196.00 },
  { id: "a3", name: "La",  label: "La3",  key: "H", freq: 220.00 },
  { id: "b3", name: "Si",  label: "Si3",  key: "J", freq: 246.94 },
  { id: "c4", name: "Do",  label: "Do4",  key: "K", freq: 261.63 },
  { id: "d4", name: "Ré",  label: "Ré4",  key: "L", freq: 293.66 },
  { id: "e4", name: "Mi",  label: "Mi4",  key: "M", freq: 329.63 },
  { id: "f4", name: "Fa",  label: "Fa4",  key: "N", freq: 349.23 },
  { id: "g4", name: "Sol", label: "Sol4", key: ",", freq: 392.00 },
  { id: "a4", name: "La",  label: "La4",  key: ";", freq: 440.00 },
  { id: "b4", name: "Si",  label: "Si4",  key: ":", freq: 493.88 },
  { id: "c5", name: "Do",  label: "Do5",  key: "!", freq: 523.25 },
];

const NOTE_IDS = NOTES.map(n => n.id);

// ==================== KEYBOARD LAYOUT (exact from SabSab) ====================

const SKY_PIANO_LAYOUT = [
  { noteId: "c3", keyLabel: "Y", codes: ["KeyY"], aliases: ["y", "Y"], symbol: "hybrid" },
  { noteId: "d3", keyLabel: "U", codes: ["KeyU"], aliases: ["u", "U"], symbol: "diamond" },
  { noteId: "e3", keyLabel: "I", codes: ["KeyI"], aliases: ["i", "I"], symbol: "circle" },
  { noteId: "f3", keyLabel: "O", codes: ["KeyO"], aliases: ["o", "O"], symbol: "diamond" },
  { noteId: "g3", keyLabel: "P", codes: ["KeyP"], aliases: ["p", "P"], symbol: "circle" },
  { noteId: "a3", keyLabel: "H", codes: ["KeyH"], aliases: ["h", "H"], symbol: "circle" },
  { noteId: "b3", keyLabel: "J", codes: ["KeyJ"], aliases: ["j", "J"], symbol: "diamond" },
  { noteId: "c4", keyLabel: "K", codes: ["KeyK"], aliases: ["k", "K"], symbol: "hybrid" },
  { noteId: "d4", keyLabel: "L", codes: ["KeyL"], aliases: ["l", "L"], symbol: "diamond" },
  { noteId: "e4", keyLabel: "M", codes: ["KeyM"], aliases: ["m", "M"], symbol: "circle" },
  { noteId: "f4", keyLabel: "N", codes: ["KeyN"], aliases: ["n", "N"], symbol: "circle" },
  { noteId: "g4", keyLabel: ",", codes: ["Comma"], aliases: [","], symbol: "diamond" },
  { noteId: "a4", keyLabel: ";", codes: ["Semicolon"], aliases: [";"], symbol: "circle" },
  { noteId: "b4", keyLabel: ":", codes: ["Quote"], aliases: [":"], symbol: "diamond" },
  { noteId: "c5", keyLabel: "!", codes: ["Digit1"], aliases: ["!"], symbol: "hybrid" },
];

// UI grid: 3 rows of 5 (Sky layout: low→high, top→bottom)
const KEY_LAYOUT = [
  ["c3", "d3", "e3", "f3", "g3"],
  ["a3", "b3", "c4", "d4", "e4"],
  ["f4", "g4", "a4", "b4", "c5"],
];

function getSkyKeyboardBinding(event) {
  if (!event) return null;
  const typedKey = typeof event.key === "string" ? event.key : "";
  const aliasMatch = SKY_PIANO_LAYOUT.find(b => b.aliases.includes(typedKey));
  if (aliasMatch) return aliasMatch;
  return SKY_PIANO_LAYOUT.find(b => b.codes.includes(event.code)) || null;
}

function getKeyLabelForNote(noteId) {
  const binding = SKY_PIANO_LAYOUT.find(b => b.noteId === noteId);
  return binding ? binding.keyLabel : "";
}

// ==================== SKY NIGHTLY CDN ====================

const SKY_NIGHTLY_AUDIO_BASE = "https://cdn.jsdelivr.net/gh/Specy/genshin-music@main/public/assets/audio/sky";

function createIndexedSampleConfig(basePath, noteIds, options = {}) {
  const notes = {};
  noteIds.forEach((noteId, index) => {
    const noteData = NOTES.find(n => n.id === noteId);
    if (!noteData) return;
    notes[noteId] = {
      path: `${basePath}/${index}.mp3`,
      rootFreq: noteData.freq,
    };
  });
  const fallbackNoteId = noteIds.find(id => notes[id]) || "c4";
  const fallbackNote = NOTES.find(n => n.id === fallbackNoteId) || NOTES[7];
  return {
    path: `${basePath}/0.mp3`,
    rootFreq: fallbackNote?.freq || 261.63,
    loop: Boolean(options.loop),
    loopStart: options.loopStart,
    loopEnd: options.loopEnd,
    notes,
  };
}

// ==================== SAMPLE CONFIGS ====================

const SAMPLE_CONFIGS = {};

// Sky Nightly instruments data
const SKY_NIGHTLY_INSTRUMENTS_DATA = [
  { id: "sky-piano", skyName: "Piano", label: "Piano", emoji: "🎹", family: "piano", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-grandpiano", skyName: "GrandPiano", label: "Grand Piano", emoji: "🎹", family: "piano", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-winterpiano", skyName: "WinterPiano", label: "Piano d'hiver", emoji: "❄️", family: "piano", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-guitar", skyName: "Guitar", label: "Guitare", emoji: "🎸", family: "guitar", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-lightguitar", skyName: "LightGuitar", label: "Guitare lumineuse", emoji: "✨", family: "guitar", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-contrabass", skyName: "Contrabass", label: "Contrebasse", emoji: "🪕", family: "guitar", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-harp", skyName: "Harp", label: "Harpe", emoji: "🪉", family: "strings", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-horn", skyName: "Horn", label: "Cor", emoji: "📯", family: "brass", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-trumpet", skyName: "Trumpet", label: "Trompette", emoji: "🎺", family: "brass", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-pipa", skyName: "Pipa", label: "Pipa", emoji: "🪕", family: "reed", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-xylophone", skyName: "Xylophone", label: "Xylophone", emoji: "🎼", family: "chromatic-percussion", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-flute", skyName: "Flute", label: "Flûte", emoji: "🪈", family: "pipe", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-panflute", skyName: "Panflute", label: "Flûte de pan (Sky)", emoji: "🪈", family: "pipe", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-ocarina", skyName: "Ocarina", label: "Ocarina", emoji: "🎶", family: "pipe", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-mantaocarina", skyName: "MantaOcarina", label: "Ocarina manta", emoji: "🪽", family: "pipe", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-aurora", skyName: "Aurora", label: "Aurora", emoji: "🌌", family: "vocal", sustain: true, noteLayout: "defaultSky" },
  { id: "sky-sfx-birdcall", skyName: "SFX_BirdCall", label: "Appel d'oiseau", emoji: "🐦", family: "percussive", sustain: false, noteLayout: "skySFX14" },
  { id: "sky-sfx-crabcall", skyName: "SFX_CrabCall", label: "Appel de crabe", emoji: "🦀", family: "percussive", sustain: false, noteLayout: "skySFX14" },
  { id: "sky-sfx-fishcall", skyName: "SFX_FishCall", label: "Appel de poisson", emoji: "🐟", family: "percussive", sustain: false, noteLayout: "skySFX14" },
  { id: "sky-sfx-mantacall", skyName: "SFX_MantaCall", label: "Appel de manta", emoji: "🌊", family: "percussive", sustain: false, noteLayout: "skySFX14" },
  { id: "sky-sfx-mothcall", skyName: "SFX_MothCall", label: "Appel de papillon", emoji: "🦋", family: "percussive", sustain: false, noteLayout: "skySFX14" },
  { id: "sky-sfx-jellycall", skyName: "SFX_JellyCall", label: "Appel de méduse", emoji: "🪼", family: "percussive", sustain: false, noteLayout: "skySFX14" },
  { id: "sky-sfx-spiritmantacall", skyName: "SFX_SpiritMantaCall", label: "Appel manta esprit", emoji: "🪽", family: "percussive", sustain: false, noteLayout: "skySFX14" },
];

const SKY_NIGHTLY_NOTE_LAYOUTS = {
  defaultSky: NOTE_IDS,
  skySFX14: ["c3","d3","e3","f3","g3","a3","b3","c4","d4","e4","f4","g4","a4","b4"],
};

// Generate sample configs for all Sky Nightly instruments
SKY_NIGHTLY_INSTRUMENTS_DATA.forEach(inst => {
  const noteIds = SKY_NIGHTLY_NOTE_LAYOUTS[inst.noteLayout] || SKY_NIGHTLY_NOTE_LAYOUTS.defaultSky;
  SAMPLE_CONFIGS[inst.id] = createIndexedSampleConfig(
    `${SKY_NIGHTLY_AUDIO_BASE}/${inst.skyName}`,
    noteIds,
    {
      loop: false,
    }
  );
});

// ==================== INSTRUMENTS LIST ====================

const INSTRUMENTS = [
  ...SKY_NIGHTLY_INSTRUMENTS_DATA.map(inst => ({
    id: inst.id, name: inst.label, emoji: inst.emoji, family: inst.family, sustain: inst.sustain,
  })),
];

// ==================== AUDIO STATE (from SabSab) ====================

let skyToneContext = null;
let skyPianoMasterGain = null;
let skyPianoWetGain = null;
let skyPianoConvolver = null;
let skyPianoCompressor = null;
const sampleCache = new Map();
let musicVolume = 0.6;
let currentInstrumentId = "sky-piano";

// Track recent fire-and-forget voices per note for voice stealing
const recentPlayVoices = {};

// Active held voices
const activeVoices = {};
const localHeldNotes = {};

// ==================== AUDIO HELPERS (exact from SabSab) ====================

function buildSkyImpulseBuffer(audioContext) {
  const duration = 1.6;
  const decay = 2.8;
  const length = Math.floor(audioContext.sampleRate * duration);
  const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
  for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
    const channelData = impulse.getChannelData(channel);
    let smooth = 0;
    for (let i = 0; i < length; i++) {
      const progress = i / length;
      const white = Math.random() * 2 - 1;
      smooth = (smooth * 0.86) + (white * 0.14);
      channelData[i] = smooth * ((1 - progress) ** decay) * 0.38;
    }
  }
  return impulse;
}

let noiseBufferCache = null;
function buildMultiNoiseBuffer(audioContext, seconds = 1.6) {
  if (noiseBufferCache) return noiseBufferCache;
  const length = Math.floor(audioContext.sampleRate * seconds);
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + (0.02 * white)) / 1.02;
    data[i] = lastOut * 3.5;
  }
  noiseBufferCache = buffer;
  return buffer;
}

function holdAudioParamValue(param, time, fallbackValue = 0.08) {
  try {
    param.cancelScheduledValues(time);
    param.setValueAtTime(Math.max(0.0001, fallbackValue), time);
  } catch {
    try { param.setValueAtTime(Math.max(0.0001, fallbackValue), time); } catch { /* ignore */ }
  }
}

function getInstrumentMixGain(instrumentId) {
  const gains = {
    piano: 1, ocarina: 1.2,
    triangle: 0.85,
    "sky-piano": 1.35, "sky-grandpiano": 1.35, "sky-winterpiano": 1.35,
    "sky-guitar": 1.35, "sky-lightguitar": 1.35, "sky-contrabass": 1.35,
    "sky-harp": 1.35, "sky-horn": 1.35, "sky-trumpet": 1.35,
    "sky-pipa": 1.35, "sky-xylophone": 1.35,
    "sky-flute": 1.35, "sky-panflute": 1.35, "sky-ocarina": 1.35,
    "sky-mantaocarina": 1.35, "sky-aurora": 1.7,
    "sky-sfx-birdcall": 1.35, "sky-sfx-crabcall": 1.35,
    "sky-sfx-fishcall": 1.35, "sky-sfx-mantacall": 1.35,
    "sky-sfx-mothcall": 1.35, "sky-sfx-jellycall": 1.35,
    "sky-sfx-spiritmantacall": 1.35,
  };
  return gains[instrumentId] || 1;
}

function isSkyNightlyInstrument(instrumentId) {
  return String(instrumentId || "").startsWith("sky-");
}

function getSkyNightlyInstrumentProfile(instrument) {
  const family = String(instrument.family || "").toLowerCase();
  const instrumentId = String(instrument.id || "");

  if (instrumentId === "sky-aurora") {
    return {
      filterType: "lowpass", filterFrequency: 4600, filterQ: 0.62,
      attackSeconds: 0.024,
      peakGain: Math.max(0.09, musicVolume * 0.2),
      sustainGain: Math.max(0.05, musicVolume * 0.12),
      releaseSeconds: 1.08, autoStopAfter: 3.2,
      ambienceAmount: 0.56, ambienceDelay: 0.065, ambienceFeedback: 0.16,
    };
  }
  if (family === "vocal") {
    return {
      filterType: "lowpass", filterFrequency: 4300, filterQ: 0.68,
      attackSeconds: 0.02,
      peakGain: Math.max(0.082, musicVolume * 0.17),
      sustainGain: Math.max(0.044, musicVolume * 0.1),
      releaseSeconds: 0.82, autoStopAfter: 2.8,
      ambienceAmount: 0.34, ambienceDelay: 0.052, ambienceFeedback: 0.09,
    };
  }
  if (family === "pipe" || family === "brass") {
    return {
      filterType: "lowpass", filterFrequency: 5200, filterQ: 0.85,
      attackSeconds: 0.012,
      peakGain: Math.max(0.08, musicVolume * 0.16),
      sustainGain: Math.max(0.042, musicVolume * 0.094),
      releaseSeconds: 1.05, autoStopAfter: 3.05,
      ambienceAmount: 0.24, ambienceDelay: 0.048, ambienceFeedback: 0.085,
    };
  }
  if (family === "percussive") {
    return {
      filterType: "lowpass", filterFrequency: 7600, filterQ: 0.42,
      attackSeconds: 0.006,
      peakGain: Math.max(0.07, musicVolume * 0.15),
      sustainGain: Math.max(0.022, musicVolume * 0.05),
      releaseSeconds: 0.26, autoStopAfter: 1.2,
      ambienceAmount: 0.02, ambienceDelay: 0.02, ambienceFeedback: 0.02,
    };
  }
  if (family === "piano" || family === "chromatic-percussion") {
    return {
      filterType: "lowpass", filterFrequency: 6400, filterQ: 0.65,
      attackSeconds: 0.008,
      peakGain: Math.max(0.075, musicVolume * 0.155),
      sustainGain: Math.max(0.032, musicVolume * 0.072),
      releaseSeconds: 0.9, autoStopAfter: 2.7,
      ambienceAmount: 0.15, ambienceDelay: 0.036, ambienceFeedback: 0.07,
    };
  }
  return {
    filterType: "lowpass", filterFrequency: 5600, filterQ: 0.75,
    attackSeconds: 0.01,
    peakGain: Math.max(0.078, musicVolume * 0.16),
    sustainGain: Math.max(0.034, musicVolume * 0.078),
    releaseSeconds: 1.15, autoStopAfter: 2.9,
    ambienceAmount: 0.24, ambienceDelay: 0.045, ambienceFeedback: 0.1,
  };
}

// ==================== AUDIO INIT (from SabSab ensureSkyToneContext) ====================

function ensureAudioContext(tryResume = false) {
  if (!skyToneContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      skyToneContext = new AudioCtx();
      skyPianoMasterGain = skyToneContext.createGain();
      skyPianoWetGain = skyToneContext.createGain();
      skyPianoConvolver = skyToneContext.createConvolver();
      skyPianoCompressor = skyToneContext.createDynamicsCompressor();
      skyPianoConvolver.buffer = buildSkyImpulseBuffer(skyToneContext);
      skyPianoConvolver.normalize = true;

      const dryGain = skyToneContext.createGain();
      dryGain.gain.value = 0.92;
      skyPianoWetGain.gain.value = 0.13;
      skyPianoMasterGain.gain.value = Math.max(0.24, musicVolume * 2.8);

      skyPianoCompressor.threshold.setValueAtTime(-18, skyToneContext.currentTime);
      skyPianoCompressor.knee.setValueAtTime(14, skyToneContext.currentTime);
      skyPianoCompressor.ratio.setValueAtTime(3, skyToneContext.currentTime);
      skyPianoCompressor.attack.setValueAtTime(0.003, skyToneContext.currentTime);
      skyPianoCompressor.release.setValueAtTime(0.08, skyToneContext.currentTime);

      skyPianoMasterGain.connect(dryGain);
      skyPianoMasterGain.connect(skyPianoConvolver);
      skyPianoConvolver.connect(skyPianoWetGain);
      dryGain.connect(skyPianoCompressor);
      skyPianoWetGain.connect(skyPianoCompressor);
      skyPianoCompressor.connect(skyToneContext.destination);
    }
  }
  if (tryResume && skyToneContext?.state === "suspended") {
    skyToneContext.resume().catch(() => {});
  }
  if (skyPianoMasterGain && skyToneContext) {
    skyPianoMasterGain.gain.setValueAtTime(
      Math.max(0.24, musicVolume * 2.8),
      skyToneContext.currentTime
    );
  }
  return skyToneContext;
}

// ==================== SAMPLE LOADING (from SabSab) ====================

function getSampleConfig(instrumentId, noteId) {
  const config = SAMPLE_CONFIGS[instrumentId] || null;
  if (!config) return null;
  if (noteId && config.notes?.[noteId]) {
    return { ...config, ...config.notes[noteId], _resolvedNoteId: noteId };
  }
  // Find nearest available note (fixes c5 on 14-note SFX instruments)
  if (noteId && config.notes) {
    const noteObj = NOTES.find(n => n.id === noteId);
    if (noteObj) {
      let bestId = null, bestDist = Infinity;
      for (const avail of Object.keys(config.notes)) {
        const availObj = NOTES.find(n => n.id === avail);
        if (availObj) {
          const dist = Math.abs(availObj.freq - noteObj.freq);
          if (dist < bestDist) { bestDist = dist; bestId = avail; }
        }
      }
      if (bestId && config.notes[bestId]) {
        return { ...config, ...config.notes[bestId], rootFreq: config.notes[bestId].rootFreq, _resolvedNoteId: bestId };
      }
    }
  }
  return config;
}

function getSampleCacheKey(instrumentId, noteId) {
  return noteId ? `${instrumentId}:${noteId}` : instrumentId;
}

async function loadSample(instrumentId, noteId = "") {
  const config = getSampleConfig(instrumentId, noteId);
  if (!config?.path) return null;

  const ctx = ensureAudioContext(false);
  if (!ctx) return null;

  const cacheKey = getSampleCacheKey(instrumentId, noteId);
  const cached = sampleCache.get(cacheKey);
  if (cached?.status === "ready" && cached.buffer) return cached.buffer;
  if (cached?.promise) return cached.promise;

  const promise = fetch(config.path, { cache: "force-cache" })
    .then(res => {
      if (!res.ok) throw new Error(`Sample not found: ${config.path}`);
      return res.arrayBuffer();
    })
    .then(buf => ctx.decodeAudioData(buf.slice(0)))
    .then(audioBuffer => {
      sampleCache.set(cacheKey, { status: "ready", buffer: audioBuffer });
      return audioBuffer;
    })
    .catch(err => {
      console.warn("Sample load error:", config.path, err);
      sampleCache.set(cacheKey, { status: "error", error: err });
      return null;
    });

  sampleCache.set(cacheKey, { status: "loading", promise });
  return promise;
}

function warmupSamples(instrumentId) {
  const config = SAMPLE_CONFIGS[instrumentId];
  if (!config) return Promise.resolve();
  const promises = [];
  if (config.notes) {
    Object.keys(config.notes).forEach(noteId => promises.push(loadSample(instrumentId, noteId)));
  } else if (config.path) {
    promises.push(loadSample(instrumentId));
  }
  return Promise.all(promises);
}

// ==================== VOICE CREATION (from SabSab createMultiInstrumentVoice) ====================

function createVoice(note, instrumentId, options = {}) {
  const ctx = skyToneContext;
  if (!ctx || !skyPianoMasterGain || !note) return null;

  const now = ctx.currentTime + (options.timeOffset || 0);
  const instrument = INSTRUMENTS.find(i => i.id === instrumentId) || INSTRUMENTS[0];
  const sampleConfig = getSampleConfig(instrumentId, note.id);
  const resolvedNoteId = sampleConfig?._resolvedNoteId || note.id;
  const sampleCacheKey = sampleConfig ? getSampleCacheKey(instrumentId, resolvedNoteId) : "";
  const sampleEntry = sampleConfig ? sampleCache.get(sampleCacheKey) : null;

  const mixer = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const voiceGain = ctx.createGain();
  const oscillators = [];
  const extraSources = [];
  const toneLevel = Math.max(0.3, musicVolume * 2.4);
  const instrumentMixGain = getInstrumentMixGain(instrumentId);

  mixer.gain.setValueAtTime(instrumentMixGain, now);
  mixer.connect(filter);
  filter.connect(voiceGain);
  voiceGain.connect(skyPianoMasterGain);

  const addOscillator = (shape, frequency, gainValue, detuneCents = 0) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    if (Array.isArray(shape)) {
      const real = new Float32Array(shape.length + 1);
      const imag = new Float32Array(shape.length + 1);
      shape.forEach((amp, idx) => { imag[idx + 1] = amp; });
      osc.setPeriodicWave(ctx.createPeriodicWave(real, imag, { disableNormalization: false }));
    } else {
      osc.type = shape;
    }
    osc.frequency.setValueAtTime(frequency, now);
    if (osc.detune) osc.detune.setValueAtTime(detuneCents, now);
    oscGain.gain.value = gainValue;
    osc.connect(oscGain);
    oscGain.connect(mixer);
    oscillators.push({ node: osc, gain: oscGain });
    return osc;
  };

  const addPlaybackVibrato = (targetParam, rate, depth) => {
    if (!targetParam) return;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(rate, now);
    lfoGain.gain.setValueAtTime(0.00001, now);
    lfoGain.gain.linearRampToValueAtTime(depth, now + 0.16);
    lfo.connect(lfoGain);
    lfoGain.connect(targetParam);
    extraSources.push(lfo);
  };

  const addVibrato = (targets, rate, depth) => {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(rate, now);
    lfoGain.gain.setValueAtTime(0.0001, now);
    lfoGain.gain.linearRampToValueAtTime(depth, now + 0.18);
    lfo.connect(lfoGain);
    targets.forEach(t => { if (t?.frequency) lfoGain.connect(t.frequency); });
    extraSources.push(lfo);
  };

  const addBreathNoise = (gainValue = 0.018, centerFreq = Math.max(900, note.freq * 5)) => {
    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();
    noise.buffer = buildMultiNoiseBuffer(ctx, 1.6);
    noise.loop = true;
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(centerFreq, now);
    noiseFilter.Q.value = 1.2;
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(Math.max(0.0002, gainValue), now + 0.05);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(mixer);
    extraSources.push(noise);
  };

  const addNoiseBurst = ({ type = "bandpass", frequency = 2600, q = 1.2, peak = 0.014, attack = 0.004, decay = 0.08, duration = 0.24 } = {}) => {
    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();
    noise.buffer = buildMultiNoiseBuffer(ctx, duration);
    noise.loop = false;
    noiseFilter.type = type;
    noiseFilter.frequency.setValueAtTime(frequency, now);
    noiseFilter.Q.value = q;
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(Math.max(0.0002, peak), now + Math.max(0.003, attack));
    noiseGain.gain.linearRampToValueAtTime(0, now + Math.max(0.03, decay));
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(mixer);
    extraSources.push(noise);
  };

  const addAmbienceSend = (amount = 0.24, delaySeconds = 0.055, feedbackAmount = 0.12) => {
    if (!skyPianoConvolver) return;
    // Scale down to subtle echo, cap feedback to avoid repeats
    const scaledAmount = Math.min(amount * 0.35, 0.12);
    const scaledFeedback = Math.min(feedbackAmount * 0.15, 0.02);
    const sendGain = ctx.createGain();
    sendGain.gain.setValueAtTime(Math.max(0, scaledAmount), now);
    voiceGain.connect(sendGain);
    if (delaySeconds > 0) {
      const delay = ctx.createDelay(0.4);
      const feedback = ctx.createGain();
      const delayFilter = ctx.createBiquadFilter();
      delay.delayTime.setValueAtTime(delaySeconds, now);
      feedback.gain.setValueAtTime(Math.max(0, scaledFeedback), now);
      delayFilter.type = "lowpass";
      delayFilter.frequency.setValueAtTime(2800, now);
      delayFilter.Q.value = 0.6;
      sendGain.connect(delay);
      delay.connect(delayFilter);
      delayFilter.connect(skyPianoConvolver);
      delayFilter.connect(feedback);
      feedback.connect(delay);
      return;
    }
    sendGain.connect(skyPianoConvolver);
  };

  let releaseSeconds = 0.45;
  let autoStopAfter = 1.35;
  let releaseHoldLevel = 0.08;

  // Smooth fade-in to prevent clicks
  const fadeInTime = 0.004;
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(3200, now);
  filter.Q.value = 1.2;
  voiceGain.gain.setValueAtTime(0, now);
  voiceGain.gain.linearRampToValueAtTime(0.0001, now + fadeInTime);

  // === SAMPLE-BASED PLAYBACK ===
  if (sampleConfig && sampleEntry?.status === "ready" && sampleEntry.buffer) {
    const source = ctx.createBufferSource();
    source.buffer = sampleEntry.buffer;
    source.playbackRate.setValueAtTime(note.freq / sampleConfig.rootFreq, now);
    source.loop = Boolean(sampleConfig.loop && options.sustain);

    if (source.loop) {
      source.loopStart = Number(sampleConfig.loopStart || 0.18);
      source.loopEnd = Number(sampleConfig.loopEnd || Math.max(source.loopStart + 0.2, sampleEntry.buffer.duration - 0.05));
    }

    source.connect(mixer);
    extraSources.push(source);

    if (isSkyNightlyInstrument(instrumentId)) {
      const profile = getSkyNightlyInstrumentProfile(instrument);
      filter.type = profile.filterType;
      filter.frequency.setValueAtTime(profile.filterFrequency, now);
      filter.Q.value = profile.filterQ;

      if (profile.ambienceAmount > 0) {
        addAmbienceSend(profile.ambienceAmount, profile.ambienceDelay, profile.ambienceFeedback);
      }

      voiceGain.gain.setValueAtTime(0, now + fadeInTime);
      voiceGain.gain.linearRampToValueAtTime(profile.peakGain, now + fadeInTime + profile.attackSeconds);
      voiceGain.gain.linearRampToValueAtTime(profile.sustainGain, now + fadeInTime + Math.max(0.11, profile.attackSeconds + 0.08));

      const shouldKeepHolding = Boolean(options.sustain && source.loop);
      releaseSeconds = profile.releaseSeconds;
      releaseHoldLevel = Math.max(0.06, Number(profile.sustainGain || 0.08));

      if (shouldKeepHolding) {
        autoStopAfter = 0;
      } else {
        const bufferDuration = Number(sampleEntry.buffer?.duration || 1.6);
        const fadeAt = Math.max(0.45, Math.min(bufferDuration + 0.18, profile.autoStopAfter));
        voiceGain.gain.linearRampToValueAtTime(0, now + fadeAt);
        autoStopAfter = fadeAt + 0.08;
      }
    }

    source.start(now);

    let stopped = false;
    const stop = (overrideRelease = releaseSeconds) => {
      if (stopped) return;
      stopped = true;
      const stopAt = ctx.currentTime;
      const safeRelease = Math.max(0.05, Number(overrideRelease || releaseSeconds));
      try {
        voiceGain.gain.cancelScheduledValues(stopAt);
        voiceGain.gain.setValueAtTime(Math.max(0.0001, releaseHoldLevel), stopAt);
        voiceGain.gain.linearRampToValueAtTime(0, stopAt + safeRelease);
      } catch { /* ignore */ }
      const tailPadding = isSkyNightlyInstrument(instrumentId) ? 0.42 : 0.12;
      const cleanupDelay = (safeRelease + tailPadding) * 1000 + 50;
      extraSources.forEach(node => {
        try { node.stop(stopAt + safeRelease + tailPadding); } catch { /* ignore */ }
      });
      setTimeout(() => {
        try { voiceGain.disconnect(); } catch { /* ignore */ }
        try { mixer.disconnect(); } catch { /* ignore */ }
        try { filter.disconnect(); } catch { /* ignore */ }
      }, cleanupDelay);
    };

    if (!options.sustain && autoStopAfter > 0) {
      window.setTimeout(() => stop(releaseSeconds), Math.max(120, Math.round((autoStopAfter + 0.08) * 1000)));
    }

    return { stop, instrumentId, noteId: note.id };
  }

  // === OSCILLATOR FALLBACK (exact from SabSab) ===
  switch (instrumentId) {
    case "piano":
    case "sky-piano":
    case "sky-grandpiano":
    case "sky-winterpiano": {
      addOscillator([1, 0.78, 0.42, 0.24, 0.14, 0.08], note.freq, 0.56, -2.5);
      addOscillator([1, 0.78, 0.42, 0.24, 0.14, 0.08], note.freq, 0.34, 3.2);
      addOscillator("sine", note.freq * 2, 0.11);
      addOscillator("sine", note.freq * 0.5, 0.06);
      addNoiseBurst({ type: "highpass", frequency: 2400, q: 0.7, peak: 0.015, attack: 0.003, decay: 0.05, duration: 0.18 });
      filter.frequency.setValueAtTime(4600, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.7);
      filter.Q.value = 1.6;
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.05, toneLevel * 1.5), now + 0.006);
      releaseHoldLevel = Math.max(0.016, toneLevel * 0.44);
      voiceGain.gain.linearRampToValueAtTime(releaseHoldLevel, now + 0.14);
      voiceGain.gain.linearRampToValueAtTime(0, now + 1.45);
      releaseSeconds = 0.72;
      autoStopAfter = 1.48;
      break;
    }
    case "sky-harp": {
      const bow = addOscillator([1, 0.82, 0.58, 0.41, 0.29, 0.21, 0.15], note.freq, 0.34, -4);
      const edge = addOscillator([1, 0.71, 0.49, 0.34, 0.24, 0.17], note.freq, 0.26, 4);
      addOscillator("sine", note.freq * 2, 0.08);
      addBreathNoise(0.006, Math.max(1000, note.freq * 3.6));
      addVibrato([bow, edge], 5.15, Math.max(2.2, note.freq * 0.0048));
      addAmbienceSend(0.56, 0.082, 0.2);
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(2250, now + 0.7);
      filter.Q.value = 1.45;
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.04, toneLevel * 1.12), now + 0.02);
      releaseHoldLevel = Math.max(0.031, toneLevel * (options.sustain ? 0.98 : 0.94));
      voiceGain.gain.linearRampToValueAtTime(releaseHoldLevel, now + 0.11);
      if (!options.sustain) {
        voiceGain.gain.linearRampToValueAtTime(0, now + 2.28);
      }
      releaseSeconds = options.sustain ? 0.84 : 0.66;
      autoStopAfter = options.sustain ? 0 : 2.22;
      break;
    }
    case "sky-panflute":
    case "sky-flute":
    case "sky-ocarina":
    case "sky-mantaocarina": {
      const main = addOscillator("sine", note.freq, 0.72);
      const overtone = addOscillator("sine", note.freq * 2, 0.11);
      addOscillator([1, 0.1, 0.025], note.freq, 0.12, 2.5);
      addBreathNoise(0.007, Math.max(850, note.freq * 4.2));
      addNoiseBurst({ type: "bandpass", frequency: Math.max(900, note.freq * 3.6), q: 1.6, peak: 0.0045, attack: 0.004, decay: 0.055, duration: 0.16 });
      addVibrato([main, overtone], 4.05, Math.max(0.7, note.freq * 0.0019));
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.value = 1.5;
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.044, toneLevel * 1.28), now + 0.025);
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.017, toneLevel * (options.sustain ? 0.56 : 0.42)), now + 0.2);
      if (!options.sustain) {
        voiceGain.gain.linearRampToValueAtTime(0, now + 0.84);
      }
      releaseSeconds = options.sustain ? 0.42 : 0.55;
      autoStopAfter = options.sustain ? 0 : 0.88;
      break;
    }
    case "sky-guitar":
    case "sky-lightguitar":
    case "sky-contrabass":
    case "sky-pipa": {
      const pluck = addOscillator([1, 0.58, 0.23, 0.11, 0.04], note.freq, 0.52, -1.5);
      const chime = addOscillator("triangle", note.freq * 2, 0.1, 2.2);
      addOscillator("sine", note.freq * 0.5, 0.06);
      addNoiseBurst({ type: "highpass", frequency: Math.max(1800, note.freq * 4.1), q: 0.9, peak: 0.01, attack: 0.003, decay: 0.06, duration: 0.18 });
      addVibrato([pluck, chime], 4.2, Math.max(0.28, note.freq * 0.0008));
      addAmbienceSend(0.18, 0.055, 0.1);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(3400, now);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 0.72);
      filter.Q.value = 1.15;
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.048, toneLevel * 1.36), now + 0.008);
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.014, toneLevel * 0.38), now + 0.22);
      voiceGain.gain.linearRampToValueAtTime(0, now + 1.95);
      releaseSeconds = 0.7;
      autoStopAfter = 1.98;
      break;
    }
    case "sky-aurora": {
      const body = addOscillator("sine", note.freq, 0.5);
      const shimmer = addOscillator("triangle", note.freq * 1.002, 0.12);
      addOscillator("sine", note.freq * 2, 0.06);
      addBreathNoise(0.003, Math.max(800, note.freq * 3));
      addVibrato([body, shimmer], 4.5, Math.max(0.3, note.freq * 0.001));
      addAmbienceSend(0.5, 0.06, 0.15);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(4500, now);
      filter.Q.value = 0.6;
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.04, toneLevel * 0.8), now + 0.025);
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.02, toneLevel * (options.sustain ? 0.5 : 0.35)), now + 0.15);
      if (!options.sustain) {
        voiceGain.gain.linearRampToValueAtTime(0, now + 2.8);
      }
      releaseSeconds = options.sustain ? 1.0 : 0.8;
      autoStopAfter = options.sustain ? 0 : 2.85;
      break;
    }
    case "sky-horn":
    case "sky-trumpet": {
      const main = addOscillator([1, 0.7, 0.4, 0.2], note.freq, 0.5, -1);
      addOscillator("sine", note.freq * 2, 0.12);
      addBreathNoise(0.005, Math.max(800, note.freq * 3.5));
      addVibrato([main], 4.5, Math.max(0.5, note.freq * 0.0015));
      addAmbienceSend(0.2, 0.04, 0.08);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(4000, now);
      filter.frequency.exponentialRampToValueAtTime(2500, now + 0.5);
      filter.Q.value = 0.9;
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.04, toneLevel * 1.1), now + 0.015);
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.02, toneLevel * (options.sustain ? 0.65 : 0.5)), now + 0.15);
      if (!options.sustain) {
        voiceGain.gain.linearRampToValueAtTime(0, now + 1.8);
      }
      releaseSeconds = options.sustain ? 0.6 : 0.5;
      autoStopAfter = options.sustain ? 0 : 1.85;
      break;
    }
    case "sky-xylophone": {
      addOscillator("sine", note.freq, 0.52);
      addOscillator("sine", note.freq * 2.92, 0.26);
      addOscillator("sine", note.freq * 4.15, 0.15);
      addOscillator("sine", note.freq * 6.8, 0.08);
      addNoiseBurst({ type: "bandpass", frequency: 4100, q: 5.4, peak: 0.012, attack: 0.003, decay: 0.12, duration: 0.28 });
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.value = 0.85;
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.042, toneLevel * 1.22), now + 0.004);
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.011, toneLevel * 0.24), now + 0.24);
      voiceGain.gain.linearRampToValueAtTime(0, now + 1.9);
      releaseSeconds = 1.04;
      autoStopAfter = 1.95;
      break;
    }
    default: {
      addOscillator("sine", note.freq, 0.52);
      addOscillator("sine", note.freq * 2.92, 0.26);
      addOscillator("sine", note.freq * 4.15, 0.15);
      addOscillator("sine", note.freq * 6.8, 0.08);
      addNoiseBurst({ type: "bandpass", frequency: 4100, q: 5.4, peak: 0.012, attack: 0.003, decay: 0.12, duration: 0.28 });
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.value = 0.85;
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.042, toneLevel * 1.22), now + 0.004);
      voiceGain.gain.linearRampToValueAtTime(Math.max(0.011, toneLevel * 0.24), now + 0.24);
      voiceGain.gain.linearRampToValueAtTime(0, now + 1.9);
      releaseSeconds = 1.04;
      autoStopAfter = 1.95;
      break;
    }
  }

  oscillators.forEach(({ node }) => node.start(now));
  extraSources.forEach(node => node.start(now));

  let stopped = false;
  const stop = (overrideRelease = releaseSeconds) => {
    if (stopped) return;
    stopped = true;
    const stopAt = ctx.currentTime;
    const safeRelease = Math.max(0.05, Number(overrideRelease || releaseSeconds));
    try {
      voiceGain.gain.cancelScheduledValues(stopAt);
      voiceGain.gain.setValueAtTime(Math.max(0.0001, releaseHoldLevel), stopAt);
      voiceGain.gain.linearRampToValueAtTime(0, stopAt + safeRelease);
    } catch { /* ignore */ }
    const tailPadding = 0.2;
    const cleanupDelay = (safeRelease + tailPadding) * 1000 + 50;
    oscillators.forEach(({ node }) => {
      try { node.stop(stopAt + safeRelease + tailPadding); } catch { /* ignore */ }
    });
    extraSources.forEach(node => {
      try { node.stop(stopAt + safeRelease + tailPadding); } catch { /* ignore */ }
    });
    setTimeout(() => {
      try { voiceGain.disconnect(); } catch { /* ignore */ }
      try { mixer.disconnect(); } catch { /* ignore */ }
      try { filter.disconnect(); } catch { /* ignore */ }
    }, cleanupDelay);
  };

  if (!options.sustain && autoStopAfter > 0) {
    window.setTimeout(() => stop(releaseSeconds), Math.max(120, Math.round((autoStopAfter + 0.08) * 1000)));
  }

  return { stop, instrumentId, noteId: note.id };
}

// ==================== NOTE PLAY / HOLD SYSTEM (from SabSab) ====================

let voiceCounter = 0;
function createVoiceId() {
  return `voice-${++voiceCounter}-${Date.now()}`;
}

function startHeldNote(noteId, instrumentId) {
  const note = NOTES.find(n => n.id === noteId);
  if (!note) return "";

  const instrument = INSTRUMENTS.find(i => i.id === instrumentId) || INSTRUMENTS[0];
  if (!instrument.sustain) {
    playNote(noteId, instrumentId);
    return "";
  }

  const voiceId = createVoiceId();

  const ctx = ensureAudioContext(true);
  if (!ctx || !skyPianoMasterGain) return "";

  const voice = createVoice(note, instrumentId, { sustain: true });
  if (voice) {
    const safetyTimer = window.setTimeout(() => stopHeldNote(voiceId), 12000);
    activeVoices[voiceId] = { ...voice, voiceId, noteId, instrumentId, safetyTimer };
  }

  return voiceId;
}

function stopHeldNote(voiceId) {
  const safeVoiceId = String(voiceId || "").trim();
  if (!safeVoiceId) return;

  const voice = activeVoices[safeVoiceId];

  if (voice?.safetyTimer) {
    try { window.clearTimeout(voice.safetyTimer); } catch { /* ignore */ }
  }

  try {
    const instrumentId = String(voice?.instrumentId || "");
    const isNightly = isSkyNightlyInstrument(instrumentId);
    const isAurora = instrumentId === "sky-aurora";
    const isAiry = ["sky-flute", "sky-panflute", "sky-ocarina", "sky-mantaocarina", "sky-horn", "sky-trumpet"].includes(instrumentId);

    const releaseTime = isAurora ? 1.45
      : isNightly ? (isAiry ? 0.92 : 0.72)
      : 0.56;
    voice?.stop?.(releaseTime);
  } catch { /* ignore */ }

  delete activeVoices[safeVoiceId];

  Object.keys(localHeldNotes).forEach(heldNoteId => {
    if (localHeldNotes[heldNoteId] === safeVoiceId) {
      delete localHeldNotes[heldNoteId];
    }
  });
}

function playNote(noteId, instrumentId) {
  const note = NOTES.find(n => n.id === noteId);
  if (!note) return;

  const ctx = ensureAudioContext(true);
  if (!ctx || !skyPianoMasterGain) return;

  // Voice stealing: stop previous voice on same note+instrument to prevent stacking
  const voiceKey = noteId + ':' + instrumentId;
  const prevVoice = recentPlayVoices[voiceKey];
  if (prevVoice?.stop) {
    try { prevVoice.stop(0.03); } catch { /* ignore */ }
  }

  const voice = createVoice(note, instrumentId, { sustain: false });
  if (voice) {
    recentPlayVoices[voiceKey] = voice;
  }
}

// ==================== SONGS ====================

const SONGS = [
  {
    title: 'Twinkle Twinkle', info: 'Traditionnel', bpm: 110,
    notes: [
      {n:'c3',d:1},{n:'c3',d:1},{n:'g3',d:1},{n:'g3',d:1},
      {n:'a3',d:1},{n:'a3',d:1},{n:'g3',d:2},
      {n:'f3',d:1},{n:'f3',d:1},{n:'e3',d:1},{n:'e3',d:1},
      {n:'d3',d:1},{n:'d3',d:1},{n:'c3',d:2},
      {n:'g3',d:1},{n:'g3',d:1},{n:'f3',d:1},{n:'f3',d:1},
      {n:'e3',d:1},{n:'e3',d:1},{n:'d3',d:2},
      {n:'g3',d:1},{n:'g3',d:1},{n:'f3',d:1},{n:'f3',d:1},
      {n:'e3',d:1},{n:'e3',d:1},{n:'d3',d:2},
      {n:'c3',d:1},{n:'c3',d:1},{n:'g3',d:1},{n:'g3',d:1},
      {n:'a3',d:1},{n:'a3',d:1},{n:'g3',d:2},
      {n:'f3',d:1},{n:'f3',d:1},{n:'e3',d:1},{n:'e3',d:1},
      {n:'d3',d:1},{n:'d3',d:1},{n:'c3',d:2}
    ]
  },
  {
    title: 'Ode à la Joie', info: 'Beethoven', bpm: 108,
    notes: [
      {n:'e3',d:1},{n:'e3',d:1},{n:'f3',d:1},{n:'g3',d:1},
      {n:'g3',d:1},{n:'f3',d:1},{n:'e3',d:1},{n:'d3',d:1},
      {n:'c3',d:1},{n:'c3',d:1},{n:'d3',d:1},{n:'e3',d:1},
      {n:'e3',d:1.5},{n:'d3',d:0.5},{n:'d3',d:2},
      {n:'e3',d:1},{n:'e3',d:1},{n:'f3',d:1},{n:'g3',d:1},
      {n:'g3',d:1},{n:'f3',d:1},{n:'e3',d:1},{n:'d3',d:1},
      {n:'c3',d:1},{n:'c3',d:1},{n:'d3',d:1},{n:'e3',d:1},
      {n:'d3',d:1.5},{n:'c3',d:0.5},{n:'c3',d:2}
    ]
  },
  {
    title: 'Frère Jacques', info: 'Traditionnel français', bpm: 120,
    notes: [
      {n:'c3',d:1},{n:'d3',d:1},{n:'e3',d:1},{n:'c3',d:1},
      {n:'c3',d:1},{n:'d3',d:1},{n:'e3',d:1},{n:'c3',d:1},
      {n:'e3',d:1},{n:'f3',d:1},{n:'g3',d:2},
      {n:'e3',d:1},{n:'f3',d:1},{n:'g3',d:2},
      {n:'g3',d:0.75},{n:'a3',d:0.25},{n:'g3',d:0.5},{n:'f3',d:0.5},
      {n:'e3',d:1},{n:'c3',d:1},
      {n:'g3',d:0.75},{n:'a3',d:0.25},{n:'g3',d:0.5},{n:'f3',d:0.5},
      {n:'e3',d:1},{n:'c3',d:1},
      {n:'c3',d:1},{n:'g3',d:1},{n:'c3',d:2},
      {n:'c3',d:1},{n:'g3',d:1},{n:'c3',d:2}
    ]
  },
  {
    title: 'Amazing Grace', info: 'Traditionnel', bpm: 80,
    notes: [
      {n:'c3',d:1},{n:'e3',d:2},{n:'g3',d:0.5},{n:'e3',d:0.5},
      {n:'g3',d:2},{n:'e3',d:1},
      {n:'c3',d:2},{n:'c3',d:1},
      {n:'c3',d:1},{n:'e3',d:2},{n:'g3',d:0.5},{n:'e3',d:0.5},
      {n:'g3',d:2},{n:'a3',d:1},
      {n:'g3',d:3},
      {n:'a3',d:1},{n:'g3',d:2},{n:'e3',d:0.5},{n:'c3',d:0.5},
      {n:'c3',d:2},{n:'c3',d:1},
      {n:'c3',d:1},{n:'e3',d:2},{n:'g3',d:0.5},{n:'e3',d:0.5},
      {n:'g3',d:2},{n:'e3',d:1},
      {n:'c3',d:3}
    ]
  },
  {
    title: 'Au Clair de la Lune', info: 'Traditionnel français', bpm: 100,
    notes: [
      {n:'c3',d:1},{n:'c3',d:1},{n:'c3',d:1},{n:'d3',d:1},
      {n:'e3',d:2},{n:'d3',d:2},
      {n:'c3',d:1},{n:'e3',d:1},{n:'d3',d:1},{n:'d3',d:1},
      {n:'c3',d:4},
      {n:'c3',d:1},{n:'c3',d:1},{n:'c3',d:1},{n:'d3',d:1},
      {n:'e3',d:2},{n:'d3',d:2},
      {n:'c3',d:1},{n:'e3',d:1},{n:'d3',d:1},{n:'d3',d:1},
      {n:'c3',d:4}
    ]
  },
  {
    title: 'Joyeux Anniversaire', info: 'Traditionnel', bpm: 100,
    notes: [
      {n:'c3',d:0.75},{n:'c3',d:0.25},{n:'d3',d:1},{n:'c3',d:1},
      {n:'f3',d:1},{n:'e3',d:2},
      {n:'c3',d:0.75},{n:'c3',d:0.25},{n:'d3',d:1},{n:'c3',d:1},
      {n:'g3',d:1},{n:'f3',d:2},
      {n:'c3',d:0.75},{n:'c3',d:0.25},{n:'c4',d:1},{n:'a3',d:1},
      {n:'f3',d:1},{n:'e3',d:1},{n:'d3',d:1},
      {n:'b3',d:0.75},{n:'b3',d:0.25},{n:'a3',d:1},{n:'f3',d:1},
      {n:'g3',d:1},{n:'f3',d:2}
    ]
  },
  {
    title: 'Sakura Sakura', info: 'Traditionnel japonais', bpm: 90,
    notes: [
      {n:'a3',d:1},{n:'a3',d:1},{n:'b3',d:2},
      {n:'a3',d:1},{n:'a3',d:1},{n:'b3',d:2},
      {n:'a3',d:1},{n:'b3',d:1},{n:'c4',d:1},{n:'a3',d:1},
      {n:'f3',d:1},{n:'a3',d:0.5},{n:'f3',d:0.5},{n:'e3',d:2},
      {n:'c3',d:1},{n:'c3',d:1},{n:'e3',d:2},
      {n:'c3',d:1},{n:'c3',d:1},{n:'e3',d:2},
      {n:'a3',d:1},{n:'b3',d:1},{n:'c4',d:1},{n:'a3',d:1},
      {n:'f3',d:1},{n:'a3',d:0.5},{n:'f3',d:0.5},{n:'e3',d:2},
      {n:'e3',d:1},{n:'f3',d:1},{n:'e3',d:1},{n:'c3',d:1},
      {n:'e3',d:4}
    ]
  },
  {
    title: 'Mary Had a Little Lamb', info: 'Traditionnel', bpm: 120,
    notes: [
      {n:'e3',d:1},{n:'d3',d:1},{n:'c3',d:1},{n:'d3',d:1},
      {n:'e3',d:1},{n:'e3',d:1},{n:'e3',d:2},
      {n:'d3',d:1},{n:'d3',d:1},{n:'d3',d:2},
      {n:'e3',d:1},{n:'g3',d:1},{n:'g3',d:2},
      {n:'e3',d:1},{n:'d3',d:1},{n:'c3',d:1},{n:'d3',d:1},
      {n:'e3',d:1},{n:'e3',d:1},{n:'e3',d:1},{n:'e3',d:1},
      {n:'d3',d:1},{n:'d3',d:1},{n:'e3',d:1},{n:'d3',d:1},
      {n:'c3',d:4}
    ]
  }
];

// ==================== SONG PLAYER ====================

class SongPlayer {
  constructor(onNotePlay) {
    this.onNotePlay = onNotePlay;
    this.timeouts = [];
    this.isPlaying = false;
    this.currentSong = null;
    this.onStop = null;
  }

  play(song, instrumentId) {
    this.stop();
    this.isPlaying = true;
    this.currentSong = song;
    const beatMs = 60000 / song.bpm;
    let time = 0;
    song.notes.forEach(note => {
      const t = setTimeout(() => {
        playNote(note.n, instrumentId);
        if (this.onNotePlay) this.onNotePlay(note.n);
      }, time);
      this.timeouts.push(t);
      time += note.d * beatMs;
    });
    const endT = setTimeout(() => {
      this.isPlaying = false;
      this.currentSong = null;
      if (this.onStop) this.onStop();
    }, time + 500);
    this.timeouts.push(endT);
  }

  playRecording(events, fallbackInstrumentId) {
    this.stop();
    this.isPlaying = true;
    events.forEach(evt => {
      const t = setTimeout(() => {
        playNote(evt.noteId, evt.instrumentId || fallbackInstrumentId);
        if (this.onNotePlay) this.onNotePlay(evt.noteId);
      }, evt.time);
      this.timeouts.push(t);
    });
    if (events.length > 0) {
      const lastTime = events[events.length - 1].time;
      const endT = setTimeout(() => {
        this.isPlaying = false;
        if (this.onStop) this.onStop();
      }, lastTime + 1500);
      this.timeouts.push(endT);
    }
  }

  stop() {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    this.isPlaying = false;
    this.currentSong = null;
  }
}

// ==================== RECORDER ====================

class Recorder {
  constructor() {
    this.events = [];
    this.startTime = 0;
    this.isRecording = false;
  }
  start() {
    this.events = [];
    this.startTime = Date.now();
    this.isRecording = true;
  }
  startOverdub() {
    if (!this.hasData()) return this.start();
    this.startTime = Date.now();
    this.isRecording = true;
  }
  addNote(noteId, instrumentId) {
    if (!this.isRecording) return;
    this.events.push({ noteId, instrumentId, time: Date.now() - this.startTime });
  }
  stop() {
    this.isRecording = false;
    this.events.sort((a, b) => a.time - b.time);
  }
  hasData() { return this.events.length > 0; }
}

// ==================== MAIN APP ====================

class App {
  constructor() {
    this.STORAGE_KEYS = {
      userSongs: 'ouissouiss-songs',
      recorderDraft: 'ouissouiss-recorder-draft',
      currentInstrument: 'ouissouiss-current-instrument',
      volume: 'ouissouiss-volume'
    };

    this.recorder = new Recorder();
    this.currentInstrument = this._getSavedInstrument();
    this.keyElements = {};
    this.pressedKeys = new Set();
    this._samplesReady = true;

    this.songPlayer = new SongPlayer(noteId => this._flashKey(noteId));
    this.songPlayer.onStop = () => this._onPlaybackStop();

    this._initAudioUnlock();
    this._buildInstruments();
    this._buildKeyboard();
    this._restoreRecorderDraft();
    this._buildSongs();
    this._initControls();
    this._initVolume();
    this._refreshSongActionButtons();
    this._initKeyboardShortcuts();
    this._initTouchEvents();
  }

  _getSavedInstrument() {
    const savedId = localStorage.getItem(this.STORAGE_KEYS.currentInstrument);
    return INSTRUMENTS.find(i => i.id === savedId) || INSTRUMENTS[0];
  }

  _getUserSongs() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.userSongs) || '[]');
    } catch {
      return [];
    }
  }

  _setUserSongs(songs) {
    localStorage.setItem(this.STORAGE_KEYS.userSongs, JSON.stringify(songs));
  }

  _saveRecorderDraft() {
    localStorage.setItem(this.STORAGE_KEYS.recorderDraft, JSON.stringify(this.recorder.events || []));
  }

  _restoreRecorderDraft() {
    try {
      const parsed = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.recorderDraft) || '[]');
      if (Array.isArray(parsed)) {
        this.recorder.events = parsed.filter(evt => evt?.noteId && typeof evt.time === 'number');
        this.recorder.events.sort((a, b) => a.time - b.time);
      }
    } catch {
      this.recorder.events = [];
    }
  }

  _initAudioUnlock() {
    const overlay = document.getElementById('audio-unlock');
    const unlock = () => {
      ensureAudioContext(true);
      // Show loading text
      const p = overlay.querySelector('.overlay-content p');
      if (p) p.textContent = '✦ Chargement... ✦';
      this._samplesReady = false;
      warmupSamples(this.currentInstrument.id).then(() => {
        this._samplesReady = true;
        overlay.classList.add('hidden');
        setTimeout(() => overlay.style.display = 'none', 500);
      });
    };
    overlay.addEventListener('click', unlock, { once: true });
    overlay.addEventListener('touchstart', unlock, { once: true });
  }

  _buildInstruments() {
    const select = document.getElementById('instrument-select');
    INSTRUMENTS.forEach(inst => {
      const opt = document.createElement('option');
      opt.value = inst.id;
      opt.textContent = `${inst.emoji} ${inst.name}`;
      if (inst.id === this.currentInstrument.id) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', () => {
      const inst = INSTRUMENTS.find(i => i.id === select.value);
      if (inst) this._selectInstrument(inst);
    });
  }

  _selectInstrument(inst) {
    // Stop all held voices from previous instrument to prevent parasitic sounds
    Object.keys(localHeldNotes).forEach(noteId => {
      const voiceId = localHeldNotes[noteId];
      if (voiceId) stopHeldNote(voiceId);
    });
    Object.keys(localHeldNotes).forEach(k => delete localHeldNotes[k]);
    this.pressedKeys.clear();
    document.querySelectorAll('.key.active').forEach(k => k.classList.remove('active'));

    this.currentInstrument = inst;
    currentInstrumentId = inst.id;
    localStorage.setItem(this.STORAGE_KEYS.currentInstrument, inst.id);
    const select = document.getElementById('instrument-select');
    if (select.value !== inst.id) select.value = inst.id;

    // Block note playing until samples are loaded
    this._samplesReady = false;
    select.disabled = true;
    warmupSamples(inst.id).then(() => {
      this._samplesReady = true;
      select.disabled = false;
    });
  }

  _buildKeyboard() {
    const keyboard = document.getElementById('keyboard');
    KEY_LAYOUT.forEach(row => {
      row.forEach(noteId => {
        const note = NOTES.find(n => n.id === noteId);
        const keyLabel = getKeyLabelForNote(noteId);
        const key = document.createElement('button');
        key.className = 'key';
        key.dataset.note = noteId;
        key.innerHTML = `
          <span class="note-name">${note ? note.name : noteId}</span>
          <span class="key-shortcut">${keyLabel}</span>
        `;
        key.addEventListener('mousedown', e => {
          e.preventDefault();
          this._triggerNote(noteId, key);
        });
        key.addEventListener('mouseup', () => this._releaseNote(noteId, key));
        key.addEventListener('mouseleave', () => this._releaseNote(noteId, key));
        this.keyElements[noteId] = key;
        keyboard.appendChild(key);
      });
    });
  }

  _initTouchEvents() {
    const keyboard = document.getElementById('keyboard');
    keyboard.addEventListener('touchstart', e => {
      e.preventDefault();
      ensureAudioContext(true);
      for (const touch of e.changedTouches) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const key = el && el.closest('.key');
        if (key?.dataset.note) {
          this._triggerNote(key.dataset.note, key);
        }
      }
    }, { passive: false });

    keyboard.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const touch of e.changedTouches) {
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        const key = el && el.closest('.key');
        if (key?.dataset.note) {
          const noteId = key.dataset.note;
          if (!this.keyElements[noteId]?.classList.contains('active')) {
            Object.entries(this.keyElements).forEach(([id, keyEl]) => {
              if (id !== noteId) this._releaseNote(id, keyEl);
            });
            this._triggerNote(noteId, key);
          }
        }
      }
    }, { passive: false });

    keyboard.addEventListener('touchend', e => {
      e.preventDefault();
      Object.entries(this.keyElements).forEach(([id, keyEl]) => this._releaseNote(id, keyEl));
    }, { passive: false });
  }

  _initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      if (e.repeat) return;
      const binding = getSkyKeyboardBinding(e);
      if (!binding) return;
      e.preventDefault();
      ensureAudioContext(true);
      const key = this.keyElements[binding.noteId];
      if (key) this._triggerNote(binding.noteId, key);
    });

    document.addEventListener('keyup', e => {
      const binding = getSkyKeyboardBinding(e);
      if (!binding) return;
      const key = this.keyElements[binding.noteId];
      if (key) this._releaseNote(binding.noteId, key);
    });
  }

  _triggerNote(noteId, button) {
    if (this.pressedKeys.has(noteId)) return;
    if (this._samplesReady === false) return; // Wait for samples to load
    this.pressedKeys.add(noteId);

    const instrument = this.currentInstrument;
    this.recorder.addNote(noteId, instrument.id);
    this._saveRecorderDraft();

    if (instrument.sustain) {
      const existingVoiceId = localHeldNotes[noteId];
      if (existingVoiceId) return;

      const voiceId = startHeldNote(noteId, instrument.id);
      if (voiceId) {
        localHeldNotes[noteId] = voiceId;
        if (button) {
          button.dataset.activeVoiceId = voiceId;
          button.classList.add('active');
        }
      }
    } else {
      playNote(noteId, instrument.id);
      if (button) {
        button.classList.add('active');
        clearTimeout(button._flashTimer);
        button._flashTimer = window.setTimeout(() => button.classList.remove('active'), 220);
      }
    }
  }

  _releaseNote(noteId, button) {
    if (!this.pressedKeys.has(noteId)) return;
    this.pressedKeys.delete(noteId);

    const voiceId = button?.dataset.activeVoiceId || localHeldNotes[noteId];
    if (voiceId) {
      delete button?.dataset?.activeVoiceId;
      delete localHeldNotes[noteId];
      stopHeldNote(voiceId);
    }

    if (button) button.classList.remove('active');
  }

  _flashKey(noteId) {
    const el = this.keyElements[noteId];
    if (!el) return;
    el.classList.add('active');
    clearTimeout(el._flashTimer);
    el._flashTimer = setTimeout(() => el.classList.remove('active'), 220);
  }

  _initControls() {
    const btnRec = document.getElementById('btn-rec');
    const btnOverdub = document.getElementById('btn-overdub');
    const btnPlay = document.getElementById('btn-play');
    const btnStop = document.getElementById('btn-stop');
    const btnClear = document.getElementById('btn-clear');
    const btnSave = document.getElementById('btn-save');

    const stopRecording = () => {
      this.recorder.stop();
      this._saveRecorderDraft();
      btnRec.classList.remove('recording');
      btnOverdub.classList.remove('recording');
      btnRec.innerHTML = '<span class="icon">●</span> Rec';
      btnOverdub.innerHTML = '<span class="icon">⊕</span> Superposer';
      if (this.recorder.hasData()) {
        btnPlay.disabled = false;
        btnClear.disabled = false;
        btnSave.disabled = false;
        btnOverdub.disabled = false;
      }
    };

    btnRec.addEventListener('click', () => {
      if (this.recorder.isRecording) {
        stopRecording();
      } else {
        this.songPlayer.stop();
        this.recorder.start();
        this._saveRecorderDraft();
        btnRec.classList.add('recording');
        btnRec.innerHTML = '<span class="icon">■</span> Stop Rec';
        btnOverdub.disabled = true;
        btnPlay.disabled = true;
        btnStop.disabled = true;
        btnSave.disabled = true;
      }
    });

    btnOverdub.addEventListener('click', () => {
      if (this.recorder.isRecording) {
        stopRecording();
      } else {
        if (!this.recorder.hasData()) return;
        this.songPlayer.stop();
        // Play existing recording while overdubbing
        ensureAudioContext(true);
        this.songPlayer.playRecording(this.recorder.events, this.currentInstrument.id);
        this.recorder.startOverdub();
        btnOverdub.classList.add('recording');
        btnOverdub.innerHTML = '<span class="icon">■</span> Stop';
        btnRec.disabled = true;
        btnPlay.disabled = true;
        btnSave.disabled = true;
      }
    });

    btnPlay.addEventListener('click', () => {
      if (!this.recorder.hasData()) return;
      ensureAudioContext(true);
      btnStop.disabled = false;
      btnPlay.disabled = true;
      this.songPlayer.playRecording(this.recorder.events, this.currentInstrument.id);
    });

    btnStop.addEventListener('click', () => {
      this.songPlayer.stop();
      if (this.recorder.isRecording) {
        stopRecording();
        btnRec.disabled = false;
      }
      this._onPlaybackStop();
    });

    btnClear.addEventListener('click', () => {
      this.recorder.events = [];
      this._saveRecorderDraft();
      btnPlay.disabled = true;
      btnClear.disabled = true;
      btnStop.disabled = true;
      btnSave.disabled = true;
      btnOverdub.disabled = true;
    });

    btnSave.addEventListener('click', () => {
      if (!this.recorder.hasData()) return;
      const name = prompt('Nom de la partition :');
      if (!name || !name.trim()) return;
      const userSongs = this._getUserSongs();
      userSongs.push({
        title: name.trim(),
        info: 'Ma partition',
        events: JSON.parse(JSON.stringify(this.recorder.events)),
        createdAt: Date.now()
      });
      this._setUserSongs(userSongs);
      this._rebuildSongs();
    });

    if (this.recorder.hasData()) {
      btnPlay.disabled = false;
      btnClear.disabled = false;
      btnSave.disabled = false;
      btnOverdub.disabled = false;
    }
  }

  _initVolume() {
    const slider = document.getElementById('volume-slider');
    const icon = document.getElementById('volume-icon');
    if (!slider) return;

    const updateVolume = (val) => {
      musicVolume = val / 100;
      localStorage.setItem(this.STORAGE_KEYS.volume, String(val));
      if (skyPianoMasterGain) {
        skyPianoMasterGain.gain.setValueAtTime(musicVolume * 2.8, skyPianoCtx.currentTime);
      }
      icon.textContent = val == 0 ? '🔇' : val < 40 ? '🔉' : '🔊';
    };

    const savedVolume = Number(localStorage.getItem(this.STORAGE_KEYS.volume));
    if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 100) {
      slider.value = String(savedVolume);
      updateVolume(savedVolume);
    } else {
      updateVolume(Number(slider.value));
    }

    slider.addEventListener('input', () => updateVolume(Number(slider.value)));
    icon.addEventListener('click', () => {
      if (Number(slider.value) > 0) {
        slider.dataset.prev = slider.value;
        slider.value = 0;
      } else {
        slider.value = slider.dataset.prev || 60;
      }
      updateVolume(Number(slider.value));
    });
  }

  _onPlaybackStop() {
    const btnPlay = document.getElementById('btn-play');
    const btnStop = document.getElementById('btn-stop');
    const btnRec = document.getElementById('btn-rec');
    const btnOverdub = document.getElementById('btn-overdub');
    btnStop.disabled = true;
    btnRec.disabled = false;
    if (this.recorder.hasData()) {
      btnPlay.disabled = false;
      btnOverdub.disabled = false;
    }
  }

  _buildSongs() {
    const select = document.getElementById('song-select');
    if (!select) return;

    const previousValue = select.value;
    const options = [];

    SONGS.forEach((song, index) => {
      options.push(`<option value="builtin:${index}">Sky: ${this._escapeHtml(song.title)} — ${this._escapeHtml(song.info)}</option>`);
    });

    this._getUserSongs().forEach((song, index) => {
      options.push(`<option value="user:${index}">Mes partitions: ${this._escapeHtml(song.title)}</option>`);
    });

    select.innerHTML = options.join('');
    if (options.length === 0) {
      select.innerHTML = '<option value="">Aucune partition</option>';
      select.value = '';
    } else if (options.some(opt => opt.includes(`value="${previousValue}"`))) {
      select.value = previousValue;
    }

    if (!this._songMenuBound) {
      this._songMenuBound = true;
      document.getElementById('btn-song-play')?.addEventListener('click', () => this._playSelectedSong());
      document.getElementById('btn-song-download')?.addEventListener('click', () => this._downloadSelectedSong());
      document.getElementById('btn-song-delete')?.addEventListener('click', () => this._deleteSelectedSong());
      select.addEventListener('change', () => this._refreshSongActionButtons());
    }

    this._refreshSongActionButtons();
  }

  _rebuildSongs() {
    this._buildSongs();
  }

  _getSelectedSongMeta() {
    const select = document.getElementById('song-select');
    const value = select?.value || '';
    if (!value.includes(':')) return null;
    const [type, rawIndex] = value.split(':');
    const index = Number(rawIndex);
    if (!Number.isInteger(index) || index < 0) return null;

    if (type === 'builtin') {
      const song = SONGS[index];
      return song ? { type, index, song } : null;
    }

    if (type === 'user') {
      const songs = this._getUserSongs();
      const song = songs[index];
      return song ? { type, index, song } : null;
    }

    return null;
  }

  _refreshSongActionButtons() {
    const selected = this._getSelectedSongMeta();
    const playBtn = document.getElementById('btn-song-play');
    const downloadBtn = document.getElementById('btn-song-download');
    const deleteBtn = document.getElementById('btn-song-delete');
    if (!playBtn || !downloadBtn || !deleteBtn) return;

    playBtn.disabled = !selected;
    downloadBtn.disabled = !selected;
    const isUserSong = selected?.type === 'user';
    deleteBtn.disabled = !isUserSong;
  }

  _playSelectedSong() {
    const selected = this._getSelectedSongMeta();
    if (!selected) return;

    ensureAudioContext(true);
    document.getElementById('btn-stop').disabled = false;

    if (selected.type === 'builtin') {
      this.songPlayer.play(selected.song, this.currentInstrument.id);
    } else {
      this.songPlayer.playRecording(selected.song.events || [], this.currentInstrument.id);
    }
  }

  _downloadSelectedSong() {
    const selected = this._getSelectedSongMeta();
    if (!selected) return;

    const btn = document.getElementById('btn-song-download');
    if (btn.disabled) return;
    btn.disabled = true;
    btn.innerHTML = '<span class="icon">⏳</span> Export...';

    ensureAudioContext(true);

    // Collect all instrument IDs used and warmup their samples first
    const instrumentIds = new Set();
    if (selected.type === 'builtin') {
      instrumentIds.add(this.currentInstrument.id);
    } else {
      const events = selected.song.events || [];
      events.forEach(evt => instrumentIds.add(evt.instrumentId || this.currentInstrument.id));
      if (instrumentIds.size === 0) instrumentIds.add(this.currentInstrument.id);
    }

    Promise.all([...instrumentIds].map(id => warmupSamples(id))).then(() => {
      this._startAudioExport(selected, btn);
    });
  }

  _startAudioExport(selected, btn) {
    // Calculate total duration and note schedule
    const noteSchedule = [];

    if (selected.type === 'builtin') {
      const song = selected.song;
      const beatMs = 60000 / song.bpm;
      let timeMs = 0;
      song.notes.forEach(note => {
        noteSchedule.push({ timeSec: timeMs / 1000, noteId: note.n, instrumentId: this.currentInstrument.id });
        timeMs += note.d * beatMs;
      });
    } else {
      const events = selected.song.events || [];
      events.forEach(evt => {
        noteSchedule.push({ timeSec: evt.time / 1000, noteId: evt.noteId, instrumentId: evt.instrumentId || this.currentInstrument.id });
      });
    }

    const lastTimeSec = noteSchedule.length > 0 ? noteSchedule[noteSchedule.length - 1].timeSec : 0;
    const totalSeconds = lastTimeSec + 4;
    const sampleRate = skyToneContext.sampleRate;

    let offCtx;
    try {
      offCtx = new OfflineAudioContext(2, Math.ceil(sampleRate * totalSeconds), sampleRate);
    } catch (e) {
      console.error('OfflineAudioContext not supported:', e);
      alert('Export audio non supporté sur ce navigateur.');
      btn.innerHTML = '<span class="icon">⬇</span> Télécharger';
      btn.disabled = false;
      return;
    }

    // Build offline audio chain
    const offMasterGain = offCtx.createGain();
    const offWetGain = offCtx.createGain();
    const offConvolver = offCtx.createConvolver();
    const offCompressor = offCtx.createDynamicsCompressor();
    offConvolver.buffer = buildSkyImpulseBuffer(offCtx);
    offConvolver.normalize = true;

    const offDryGain = offCtx.createGain();
    offDryGain.gain.value = 0.92;
    offWetGain.gain.value = 0.13;
    offMasterGain.gain.value = Math.max(0.24, musicVolume * 2.8);

    offCompressor.threshold.setValueAtTime(-18, 0);
    offCompressor.knee.setValueAtTime(14, 0);
    offCompressor.ratio.setValueAtTime(3, 0);
    offCompressor.attack.setValueAtTime(0.003, 0);
    offCompressor.release.setValueAtTime(0.08, 0);

    offMasterGain.connect(offDryGain);
    offMasterGain.connect(offConvolver);
    offConvolver.connect(offWetGain);
    offDryGain.connect(offCompressor);
    offWetGain.connect(offCompressor);
    offCompressor.connect(offCtx.destination);

    // Temporarily swap globals so createVoice routes to offline chain
    const saved = {
      ctx: skyToneContext,
      master: skyPianoMasterGain,
      wet: skyPianoWetGain,
      conv: skyPianoConvolver,
      comp: skyPianoCompressor
    };

    skyToneContext = offCtx;
    skyPianoMasterGain = offMasterGain;
    skyPianoWetGain = offWetGain;
    skyPianoConvolver = offConvolver;
    skyPianoCompressor = offCompressor;

    try {
      noteSchedule.forEach(({ timeSec, noteId, instrumentId }) => {
        const note = NOTES.find(n => n.id === noteId);
        if (!note) return;
        createVoice(note, instrumentId, { sustain: false, timeOffset: timeSec });
      });
    } finally {
      // Always restore globals immediately
      skyToneContext = saved.ctx;
      skyPianoMasterGain = saved.master;
      skyPianoWetGain = saved.wet;
      skyPianoConvolver = saved.conv;
      skyPianoCompressor = saved.comp;
    }

    offCtx.startRendering().then(audioBuffer => {
      const wavBlob = this._encodeWAV(audioBuffer);
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const title = selected.song.title || selected.song.info || 'partition';
      a.download = title.replace(/[^a-zA-Z0-9àâéèêëïîôùûüçÀÂÉÈÊËÏÎÔÙÛÜÇ _-]/g, '') + '.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      btn.innerHTML = '<span class="icon">⬇</span> Télécharger';
      btn.disabled = false;
    }).catch(err => {
      console.error('Export error:', err);
      alert('Erreur lors de l\'export audio.');
      btn.innerHTML = '<span class="icon">⬇</span> Télécharger';
      btn.disabled = false;
    });
  }

  _encodeWAV(audioBuffer) {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;
    const buffer = new ArrayBuffer(44 + length * numChannels * 2);
    const view = new DataView(buffer);

    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numChannels * 2, true);

    const channels = [];
    for (let c = 0; c < numChannels; c++) channels.push(audioBuffer.getChannelData(c));

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let c = 0; c < numChannels; c++) {
        const sample = Math.max(-1, Math.min(1, channels[c][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  _deleteSelectedSong() {
    const selected = this._getSelectedSongMeta();
    if (!selected || selected.type !== 'user') return;
    if (!confirm(`Supprimer « ${selected.song.title} » ?`)) return;

    const songs = this._getUserSongs();
    songs.splice(selected.index, 1);
    this._setUserSongs(songs);
    this._rebuildSongs();
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// ==================== ANIMATED STARS ====================

(function generateStars() {
  const container = document.getElementById('stars');
  if (!container) return;

  const STAR_COUNT = 130;
  const colors = [
    'rgba(255,255,255,',
    'rgba(255,220,150,',
    'rgba(200,220,255,',
  ];

  const frag = document.createDocumentFragment();

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 1 + Math.random() * 2.2;
    const bright = 0.45 + Math.random() * 0.5;
    const colorBase = colors[Math.floor(Math.random() * colors.length)];

    star.style.left = x + '%';
    star.style.top = y + '%';
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.color = colorBase + bright + ')';
    star.style.setProperty('--bright', bright.toString());

    const animateStar = () => {
      const visibleTime = 3500 + Math.random() * 7000;
      const hiddenTime = 1200 + Math.random() * 2200;

      star.classList.add('is-visible');
      window.setTimeout(() => {
        star.classList.remove('is-visible');

        window.setTimeout(() => {
          // Reappear from a new random position for a natural sky flicker.
          star.style.left = (Math.random() * 100) + '%';
          star.style.top = (Math.random() * 100) + '%';
          animateStar();
        }, hiddenTime);
      }, visibleTime);
    };

    window.setTimeout(animateStar, Math.random() * 3000);

    frag.appendChild(star);
  }

  container.appendChild(frag);
})();

// ==================== YOUTUBE PLAYER ====================

(function initYouTubePlayer() {
  const input = document.getElementById('youtube-url');
  const btn = document.getElementById('btn-yt-load');
  const wrapper = document.getElementById('youtube-player-wrapper');
  const playerDiv = document.getElementById('youtube-player');
  const statusEl = document.getElementById('youtube-status');
  const resultsEl = document.getElementById('youtube-results');
  const STORAGE_KEY = 'ouiss_yt_query';

  if (!input || !btn || !wrapper || !playerDiv) return;

  // --- Helpers ---

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function clearResults() {
    if (resultsEl) resultsEl.innerHTML = '';
  }

  function extractVideoId(text) {
    if (!text) return null;
    let m;
    m = text.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = text.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = text.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = text.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    return null;
  }

  function isUrl(text) {
    return /^https?:\/\//i.test(text) || /youtu\.?be/i.test(text);
  }

  // --- Playback ---

  function playVideoById(videoId) {
    const url = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
    wrapper.classList.add('visible');
    playerDiv.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.title = 'YouTube';
    playerDiv.appendChild(iframe);
  }

  // --- Fetch helper ---

  async function fetchJson(url, timeoutMs) {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), timeoutMs || 8000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } finally {
      clearTimeout(tid);
    }
  }

  // --- Discover working Invidious instances dynamically ---

  let cachedInstances = null;

  async function getInvidiousInstances() {
    if (cachedInstances) return cachedInstances;

    // Hardcoded known-good instances as immediate fallback
    const hardcoded = [
      'https://iv.melmac.space',
      'https://invidious.materialio.us',
      'https://invidious.fdn.fr',
      'https://inv.tux.pizza',
      'https://invidious.nerdvpn.de',
      'https://invidious.protokolla.fi',
    ];

    // Try to discover more from the public instance list
    try {
      const data = await fetchJson('https://api.invidious.io/instances.json?sort_by=type,health', 5000);
      if (Array.isArray(data)) {
        const discovered = data
          .filter(([, info]) => info && info.type === 'https' && info.api === true && info.cors === true)
          .map(([, info]) => info.uri)
          .filter(Boolean)
          .slice(0, 10);
        if (discovered.length > 0) {
          cachedInstances = discovered;
          return cachedInstances;
        }
      }
    } catch (_) { /* use hardcoded */ }

    cachedInstances = hardcoded;
    return cachedInstances;
  }

  // --- Search via Invidious API ---

  async function searchInvidious(query) {
    const encoded = encodeURIComponent(query);
    const instances = await getInvidiousInstances();

    for (const base of instances) {
      try {
        const data = await fetchJson(`${base}/api/v1/search?q=${encoded}&type=video`, 8000);
        if (!Array.isArray(data)) continue;

        const items = data
          .filter(item => item.videoId && item.type === 'video')
          .slice(0, 10)
          .map(item => ({
            videoId: item.videoId,
            title: item.title || 'Video',
            author: item.author || '',
            duration: item.lengthSeconds || 0,
            thumb: (item.videoThumbnails && item.videoThumbnails.length > 0)
              ? item.videoThumbnails.find(t => t.quality === 'medium')?.url
                || item.videoThumbnails[0]?.url
                || `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`
              : `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`,
          }));

        if (items.length > 0) return items;
      } catch (_) { /* try next instance */ }
    }
    return [];
  }

  // --- Render results ---

  function renderResults(items) {
    clearResults();
    if (!resultsEl) return;

    items.forEach((item, idx) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'yt-result';

      const thumb = document.createElement('img');
      thumb.className = 'yt-thumb';
      // Always use YouTube's own thumbnail CDN (no CORS issue for images)
      thumb.src = `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
      thumb.alt = item.title;
      thumb.loading = idx === 0 ? 'eager' : 'lazy';

      const meta = document.createElement('div');
      meta.className = 'yt-meta';

      const title = document.createElement('div');
      title.className = 'yt-title';
      title.textContent = item.title;

      const sub = document.createElement('div');
      sub.className = 'yt-sub';
      const dur = item.duration ? formatDuration(item.duration) : '';
      sub.textContent = [item.author, dur].filter(Boolean).join(' • ');

      meta.appendChild(title);
      meta.appendChild(sub);
      card.appendChild(thumb);
      card.appendChild(meta);

      card.addEventListener('click', () => {
        const prev = resultsEl.querySelector('.yt-result.active');
        if (prev) prev.classList.remove('active');
        card.classList.add('active');
        playVideoById(item.videoId);
        setStatus(`Lecture : ${item.title}`);
      });

      resultsEl.appendChild(card);

      // Auto-play first result
      if (idx === 0) {
        card.classList.add('active');
        playVideoById(item.videoId);
      }
    });
  }

  function formatDuration(seconds) {
    if (!seconds || seconds < 0) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  // --- Main action ---

  async function handleInput() {
    const raw = input.value.trim();
    if (!raw) return;

    // Case 1: Direct YouTube link
    if (isUrl(raw)) {
      const vid = extractVideoId(raw);
      if (vid) {
        clearResults();
        playVideoById(vid);
        setStatus('Lecture de la video.');
        saveQuery(raw);
        return;
      }
    }

    // Case 2: Search query
    setStatus(`Recherche de "${raw}"...`);
    clearResults();

    const results = await searchInvidious(raw);

    if (results.length === 0) {
      // Ultimate fallback: open YouTube search in the iframe
      setStatus(`Ouverture de YouTube pour "${raw}"...`);
      wrapper.classList.add('visible');
      playerDiv.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/results?search_query=${encodeURIComponent(raw)}`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.title = 'YouTube Search';
      playerDiv.appendChild(iframe);
      saveQuery(raw);
      return;
    }

    renderResults(results);
    setStatus(`${results.length} resultats pour "${raw}".`);
    saveQuery(raw);
  }

  function saveQuery(val) {
    try { localStorage.setItem(STORAGE_KEY, val); } catch (_) {}
  }

  // --- Events ---

  btn.addEventListener('click', () => handleInput().catch(() => setStatus('Erreur lors de la recherche.')));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInput().catch(() => setStatus('Erreur lors de la recherche.'));
    }
    e.stopPropagation();
  });
  input.addEventListener('keyup', (e) => e.stopPropagation());
  input.addEventListener('keypress', (e) => e.stopPropagation());

  // Restore last query
  try {
    const last = localStorage.getItem(STORAGE_KEY);
    if (last) {
      input.value = last;
      handleInput().catch(() => {});
    }
  } catch (_) {}
})();

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
