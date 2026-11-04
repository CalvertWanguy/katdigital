// Sistèm Audio Web Audio API pou KatDigital
// Jwe bèl melodi fèt (Nwèl, Bòn Ane, Lanmou) san bezwen dosye mp3 ekstèn
// Sipòte tou yon lyen odyo pèsonalize si itilizatè a ajoute pa l

let audioCtx = null;
let currentNotesTimeout = [];
let isPlaying = false;
let customAudioElement = null;
let masterGain = null;

function getAudioContext() {
  if (!audioCtx || audioCtx.state === 'closed') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Jwe yon nòt avèk son klòch fèt / bwat mizik (Celesta / Chime)
function playTone(freq, startTime, duration = 0.5, type = 'sine') {
  if (!isPlaying) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'closed') return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    if (masterGain) {
      gain.connect(masterGain);
    } else {
      gain.connect(ctx.destination);
    }

    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch (e) {
    // Si kontek la te fèmen antretan
  }
}

// Nòt mizikal nan Hertz
const N = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
};

// Pati melodi Nwèl (Jingle Bells)
const MELODIES = {
  jingle_bells: [
    { n: N.E4, d: 0.28 }, { n: N.E4, d: 0.28 }, { n: N.E4, d: 0.56 },
    { n: N.E4, d: 0.28 }, { n: N.E4, d: 0.28 }, { n: N.E4, d: 0.56 },
    { n: N.E4, d: 0.28 }, { n: N.G4, d: 0.28 }, { n: N.C4, d: 0.4 }, { n: N.D4, d: 0.2 }, { n: N.E4, d: 0.8 },
    { n: N.F4, d: 0.28 }, { n: N.F4, d: 0.28 }, { n: N.F4, d: 0.4 }, { n: N.F4, d: 0.2 },
    { n: N.F4, d: 0.28 }, { n: N.E4, d: 0.28 }, { n: N.E4, d: 0.3 }, { n: N.E4, d: 0.2 },
    { n: N.G4, d: 0.28 }, { n: N.G4, d: 0.28 }, { n: N.F4, d: 0.28 }, { n: N.D4, d: 0.28 }, { n: N.C4, d: 0.8 }
  ],
  bon_ane: [
    { n: N.C4, d: 0.4 }, { n: N.F4, d: 0.4 }, { n: N.F4, d: 0.2 }, { n: N.G4, d: 0.2 }, { n: N.F4, d: 0.2 }, { n: N.E4, d: 0.2 },
    { n: N.D4, d: 0.4 }, { n: N.D4, d: 0.4 }, { n: N.D4, d: 0.4 }, { n: N.G4, d: 0.4 }, { n: N.G4, d: 0.2 }, { n: N.A4, d: 0.2 },
    { n: N.G4, d: 0.2 }, { n: N.F4, d: 0.2 }, { n: N.E4, d: 0.4 }, { n: N.C4, d: 0.4 }, { n: N.C4, d: 0.4 },
    { n: N.A4, d: 0.4 }, { n: N.A4, d: 0.2 }, { n: N.B4, d: 0.2 }, { n: N.A4, d: 0.2 }, { n: N.G4, d: 0.2 },
    { n: N.F4, d: 0.4 }, { n: N.D4, d: 0.4 }, { n: N.C4, d: 0.2 }, { n: N.C4, d: 0.2 }, { n: N.D4, d: 0.4 }, { n: N.G4, d: 0.4 }, { n: N.E4, d: 0.4 }, { n: N.F4, d: 0.9 }
  ],
  romance: [
    { n: N.C4, d: 0.6 }, { n: N.E4, d: 0.6 }, { n: N.G4, d: 0.6 }, { n: N.C5, d: 0.8 },
    { n: N.B4, d: 0.4 }, { n: N.A4, d: 0.4 }, { n: N.G4, d: 0.7 }, { n: N.E4, d: 0.5 },
    { n: N.F4, d: 0.5 }, { n: N.A4, d: 0.5 }, { n: N.C5, d: 0.8 }, { n: N.G4, d: 1.0 }
  ],
  haitian_tradition: [
    { n: N.C4, d: 0.3 }, { n: N.D4, d: 0.3 }, { n: N.E4, d: 0.3 }, { n: N.G4, d: 0.5 },
    { n: N.E4, d: 0.3 }, { n: N.G4, d: 0.3 }, { n: N.A4, d: 0.6 },
    { n: N.G4, d: 0.3 }, { n: N.E4, d: 0.3 }, { n: N.C4, d: 0.6 },
    { n: N.D4, d: 0.3 }, { n: N.E4, d: 0.3 }, { n: N.D4, d: 0.3 }, { n: N.C4, d: 0.8 }
  ]
};

export const MUSIC_OPTIONS = [
  { id: 'jingle_bells', label: 'Klòch Nwèl (Jingle Bells)', theme: 'noel' },
  { id: 'bon_ane', label: 'Swè Bòn Ane 2027', theme: 'nouvel-an' },
  { id: 'romance', label: 'Melodi Lanmou & Dousè', theme: 'mennaj' },
  { id: 'haitian_tradition', label: 'Omaj 1804 & Tradisyon', theme: 'tradition' },
  { id: 'none', label: 'San Mizik (Mòd Silans)', theme: 'silent' }
];

export function playHolidaySoundtrack(musicId = 'jingle_bells', customAudioUrl = null) {
  stopHolidaySoundtrack();

  // Si itilizatè a bay yon lyen mp3 pa l
  if (customAudioUrl && customAudioUrl.trim()) {
    try {
      customAudioElement = new Audio(customAudioUrl.trim());
      customAudioElement.volume = 0.55;
      customAudioElement.loop = true;
      customAudioElement.play().catch(() => {});
      isPlaying = true;
      return true;
    } catch (e) {
      console.warn('Odyo pèsonalize pa ka jwe, n ap itilize melodi ofisyèl la:', e);
    }
  }

  if (musicId === 'none') {
    isPlaying = false;
    return false;
  }

  const score = MELODIES[musicId] || MELODIES.jingle_bells;
  const ctx = getAudioContext();
  if (!ctx) return false;

  isPlaying = true;
  let totalDuration = 0;

  function scheduleLoop() {
    if (!isPlaying) return;
    const now = ctx.currentTime + 0.1;
    let offset = 0;

    score.forEach((item) => {
      playTone(item.n, now + offset, item.d * 1.5, 'sine');
      playTone(item.n * 2, now + offset, item.d * 0.8, 'triangle');
      offset += item.d;
    });

    totalDuration = offset;
    const timer = setTimeout(() => {
      if (isPlaying) {
        scheduleLoop();
      }
    }, (totalDuration + 1.2) * 1000);

    currentNotesTimeout.push(timer);
  }

  scheduleLoop();
  return true;
}

export function stopHolidaySoundtrack() {
  isPlaying = false;

  // 1. Klè tout timers ki te pwograme nòt yo
  currentNotesTimeout.forEach((t) => clearTimeout(t));
  currentNotesTimeout = [];

  // 2. Koupe odyo pèsonalize si l te genyen
  if (customAudioElement) {
    try {
      customAudioElement.pause();
      customAudioElement.currentTime = 0;
    } catch (e) {}
    customAudioElement = null;
  }

  // 3. FÈMEN KONTEK ODYO A NÈT : tout frekans ak klòch ki te deja pwograme kanpe imedyatman
  if (masterGain && audioCtx) {
    try {
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.disconnect();
    } catch (e) {}
    masterGain = null;
  }

  if (audioCtx) {
    try {
      audioCtx.close().catch(() => {});
    } catch (e) {}
    audioCtx = null;
  }
}

export function isSoundtrackPlaying() {
  return isPlaying;
}
