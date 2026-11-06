// Sistèm Audio pou KatDigital
// Jwe bèl mizik enstrimantal reyèl (otantik, san pawòl) pou chak okazyon :
// Nwèl, Nouvèl Ane, Lanmou, ak Tradisyon Ayisyen 1804.
// Sipòte tou yon fichye odyo pèsonalize si itilizatè a telechaje pa l.

export const AUDIO_TRACKS = {
  festif_violon: '/audio/deck_the_halls.wav',
  jingle_bells: '/audio/deck_the_halls.wav', // fallback pou ansyen kat
  we_wish_you: '/audio/we_wish_you.wav',
  deck_the_halls: '/audio/deck_the_halls.wav',
  silent_night: '/audio/silent_night.wav',
  bon_ane: '/audio/radetzky_march.wav',
  joy_to_the_world: '/audio/joy_to_the_world.wav',
  auld_lang_syne: '/audio/auld_lang_syne.wav',
  romance: '/audio/canon_in_d.wav',
  romance_piano: '/audio/romance_piano.wav',
  haitian_tradition: '/audio/haiti_1804.ogg',
  haiti_soup_joumou: '/audio/haiti_soup_joumou.wav'
};

export const MUSIC_OPTIONS = [
  {
    id: 'festif_violon',
    label: 'Senfoni Nwèl • Violon & Fèt',
    desc: 'Bèl melodi violon tradisyonèl Nwèl ak anbyans kokennchenn fèt',
    category: 'noel',
    src: '/audio/deck_the_halls.wav'
  },
  {
    id: 'we_wish_you',
    label: 'We Wish You a Merry Christmas',
    desc: 'Bèl klasik fèt Nwèl plen lajwa ak anbyans fanmi',
    category: 'noel',
    src: '/audio/we_wish_you.wav'
  },
  {
    id: 'silent_night',
    label: 'Douce Nuit • Silent Night',
    desc: 'Melodi selès dous e trankil pou lapè ak lafwa',
    category: 'noel',
    src: '/audio/silent_night.wav'
  },
  {
    id: 'bon_ane',
    label: 'Bòn Ane 2027 • Radetzky March',
    desc: 'Bèl fanfare jwaye e plen enèji pou nouvo ane a',
    category: 'nouvel-an',
    src: '/audio/radetzky_march.wav'
  },
  {
    id: 'joy_to_the_world',
    label: 'Joy to the World • Selebrasyon',
    desc: 'Fanfare ak klòch viktwa ak kokennchenn lajwa',
    category: 'nouvel-an',
    src: '/audio/joy_to_the_world.wav'
  },
  {
    id: 'auld_lang_syne',
    label: '31 Desanm • Auld Lang Syne',
    desc: 'Melodi tradisyonèl souvni ak pase men nan ane a',
    category: 'nouvel-an',
    src: '/audio/auld_lang_syne.wav'
  },
  {
    id: 'romance',
    label: 'Lanmou • Canon in D (Pachelbel)',
    desc: 'Pi popilè melodi amoure pou moun ou renmen',
    category: 'mennaj',
    src: '/audio/canon_in_d.wav'
  },
  {
    id: 'romance_piano',
    label: 'Dousè Lanmou • Pyano Romantik',
    desc: 'Melodi pyano amoure dous e delika',
    category: 'mennaj',
    src: '/audio/romance_piano.wav'
  },
  {
    id: 'haitian_tradition',
    label: 'Omaj 1804 • La Dessalinienne',
    desc: 'Im nasyonal ak grandè zansèt yo pou 1ye Janvye',
    category: 'tradition',
    src: '/audio/haiti_1804.ogg'
  },
  {
    id: 'haiti_soup_joumou',
    label: 'Soup Joumou • Fanfare 1ye Janvye',
    desc: 'Melodi fèt nasyonal ak chalè soup joumou',
    category: 'tradition',
    src: '/audio/haiti_soup_joumou.wav'
  },
  {
    id: 'none',
    label: 'San Mizik (Mòd Silans)',
    desc: 'Ouvri kat la dousman an silans san mizik',
    category: 'silent'
  }
];

let currentAudioElement = null;
let preloadedAudio = null;
let preloadedSrc = null;
let isPlaying = false;

/**
 * Prechaje odyo a davans pou lè itilizatè klike li pati imedyatman san tan datant
 */
export function preloadHolidaySoundtrack(musicId = 'jingle_bells', customAudioUrl = null) {
  if (musicId === 'none') return;
  const src = (customAudioUrl && typeof customAudioUrl === 'string' && customAudioUrl.trim())
    ? customAudioUrl.trim()
    : (AUDIO_TRACKS[musicId] || AUDIO_TRACKS.jingle_bells);

  if (!src) return;

  if (preloadedAudio && preloadedSrc === src) {
    return;
  }

  try {
    preloadedAudio = new Audio();
    preloadedAudio.preload = 'auto';
    preloadedAudio.src = src;
    preloadedAudio.loop = true;
    preloadedAudio.volume = 0.68;
    preloadedSrc = src;
    preloadedAudio.load();
  } catch (e) {
    console.warn('Preload audio error:', e);
  }
}

/**
 * Jwe melodi fèt la imedyatman
 */
export function playHolidaySoundtrack(musicId = 'jingle_bells', customAudioUrl = null) {
  stopHolidaySoundtrack();

  if (musicId === 'none') {
    isPlaying = false;
    return false;
  }

  let src = null;
  if (customAudioUrl && typeof customAudioUrl === 'string' && customAudioUrl.trim()) {
    src = customAudioUrl.trim();
  } else {
    src = AUDIO_TRACKS[musicId] || AUDIO_TRACKS.jingle_bells;
  }

  if (!src) return false;

  try {
    if (preloadedAudio && preloadedSrc === src) {
      currentAudioElement = preloadedAudio;
      currentAudioElement.currentTime = 0;
    } else {
      currentAudioElement = new Audio(src);
      currentAudioElement.loop = true;
      currentAudioElement.volume = 0.68;
      preloadedAudio = currentAudioElement;
      preloadedSrc = src;
    }

    const playPromise = currentAudioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
        })
        .catch((err) => {
          console.warn('Odyo a mande yon jès itilizatè pou demare:', err);
          isPlaying = false;
        });
    }

    isPlaying = true;
    return true;
  } catch (err) {
    console.error('Erè lè n ap jwe odyo a:', err);
    isPlaying = false;
    return false;
  }
}

/**
 * Koupe oswa kanpe mizik la nèt
 */
export function stopHolidaySoundtrack() {
  isPlaying = false;
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch (e) {}
    currentAudioElement = null;
  }
}

let audioCtxInstance = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioCtxInstance || audioCtxInstance.state === 'closed') {
    audioCtxInstance = new AudioCtx();
  }
  if (audioCtxInstance.state === 'suspended') {
    audioCtxInstance.resume();
  }
  return audioCtxInstance;
}

/**
 * Jwe yon son krake sele & ouvèti kat rich, pèsonalize pou chak fòma ak modèl
 */
export function playCardOpenSound(template = {}, format = 'envelope') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Diferansye son an selon fòma ak ID modèl la
    if (format === 'parchment') {
      // 1. PACHEMEN : Son dewoulman papye wayal ak ti klòch nòb
      const bufSize = Math.floor(ctx.sampleRate * 0.35);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        const decay = Math.sin((i / bufSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * decay * 0.22;
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.35);
      filter.Q.value = 1.2;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.28, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseNode.start(now);

      // Klòch wayal dous (587Hz & 880Hz)
      [587.33, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        const st = now + 0.08 + idx * 0.06;
        osc.frequency.setValueAtTime(freq, st);
        oscGain.gain.setValueAtTime(0.18, st);
        oscGain.gain.exponentialRampToValueAtTime(0.001, st + 0.85);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + 0.9);
      });
    } else if (format === 'bifold') {
      // 2. LIV PAPETRI FOLIO : Kouvèti k ap ouvri ak akò 3 nòt
      const oscLow = ctx.createOscillator();
      const oscLowGain = ctx.createGain();
      oscLow.type = 'triangle';
      oscLow.frequency.setValueAtTime(140, now);
      oscLow.frequency.exponentialRampToValueAtTime(75, now + 0.22);
      oscLowGain.gain.setValueAtTime(0.2, now);
      oscLowGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      oscLow.connect(oscLowGain);
      oscLowGain.connect(ctx.destination);
      oscLow.start(now);
      oscLow.stop(now + 0.23);

      // Akò majik (D major: D5, F#5, A5)
      [587.33, 739.99, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        const startT = now + 0.04 + idx * 0.07;
        osc.frequency.setValueAtTime(freq, startT);
        g.gain.setValueAtTime(0.16, startT);
        g.gain.exponentialRampToValueAtTime(0.001, startT + 0.85);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(startT);
        osc.stop(startT + 0.9);
      });
    } else if (format === 'kraft_sheet') {
      // 3. LÈT KRAFT : Pli papye delika ak ti kalimba
      const bufSize = Math.floor(ctx.sampleRate * 0.22);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06)) * 0.2;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 1200;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      noise.connect(f);
      f.connect(g);
      g.connect(ctx.destination);
      noise.start(now);

      // Ti nòt dous lanmou (E5 & A5)
      [659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const og = ctx.createGain();
        osc.type = 'sine';
        const st = now + 0.06 + idx * 0.08;
        osc.frequency.setValueAtTime(freq, st);
        og.gain.setValueAtTime(0.15, st);
        og.gain.exponentialRampToValueAtTime(0.001, st + 0.7);
        osc.connect(og);
        og.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + 0.75);
      });
    } else {
      // 4. ANVLÒP DE LUKS : Vrè son krake sele an lasir fizik (Otantik & Satifèzan)
      // A. Premye krak sèk lasir la (High-frequency Brittle Wax Snap)
      const snapBufSize = Math.floor(ctx.sampleRate * 0.04);
      const snapBuf = ctx.createBuffer(1, snapBufSize, ctx.sampleRate);
      const snapData = snapBuf.getChannelData(0);
      for (let i = 0; i < snapBufSize; i++) {
        snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.006));
      }
      const snapSource = ctx.createBufferSource();
      snapSource.buffer = snapBuf;
      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(3600, now);
      snapFilter.Q.value = 3.2;
      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.42, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapSource.start(now);

      // B. Dezyèm mikwo-krak lasir la (Secondary micro-fracture split)
      const crack2Time = now + 0.016;
      const crack2BufSize = Math.floor(ctx.sampleRate * 0.035);
      const crack2Buf = ctx.createBuffer(1, crack2BufSize, ctx.sampleRate);
      const crack2Data = crack2Buf.getChannelData(0);
      for (let i = 0; i < crack2BufSize; i++) {
        crack2Data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
      }
      const crack2Source = ctx.createBufferSource();
      crack2Source.buffer = crack2Buf;
      const crack2Filter = ctx.createBiquadFilter();
      crack2Filter.type = 'bandpass';
      crack2Filter.frequency.setValueAtTime(2400, crack2Time);
      crack2Filter.Q.value = 2.8;
      const crack2Gain = ctx.createGain();
      crack2Gain.gain.setValueAtTime(0.28, crack2Time);
      crack2Gain.gain.exponentialRampToValueAtTime(0.001, crack2Time + 0.03);
      crack2Source.connect(crack2Filter);
      crack2Filter.connect(crack2Gain);
      crack2Gain.connect(ctx.destination);
      crack2Source.start(crack2Time);

      // C. Enpilsyon kò anvlòp la (Warm cavity pop)
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(190, now);
      popOsc.frequency.exponentialRampToValueAtTime(45, now + 0.065);
      popGain.gain.setValueAtTime(0.35, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.07);

      // D. Friksyon papye k ap dekole (Paper unstick & flap release texture)
      const tearBufSize = Math.floor(ctx.sampleRate * 0.12);
      const tearBuf = ctx.createBuffer(1, tearBufSize, ctx.sampleRate);
      const tearData = tearBuf.getChannelData(0);
      for (let i = 0; i < tearBufSize; i++) {
        const env = Math.exp(-i / (ctx.sampleRate * 0.035));
        tearData[i] = (Math.random() * 2 - 1) * env * 0.25;
      }
      const tearSource = ctx.createBufferSource();
      tearSource.buffer = tearBuf;
      const tearFilter = ctx.createBiquadFilter();
      tearFilter.type = 'bandpass';
      tearFilter.frequency.setValueAtTime(1100, now + 0.01);
      tearFilter.frequency.exponentialRampToValueAtTime(650, now + 0.12);
      tearFilter.Q.value = 1.4;
      const tearGain = ctx.createGain();
      tearGain.gain.setValueAtTime(0.25, now + 0.01);
      tearGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      tearSource.connect(tearFilter);
      tearFilter.connect(tearGain);
      tearGain.connect(ctx.destination);
      tearSource.start(now + 0.01);
    }
  } catch (e) {
    console.warn('Erè nan son ouvèti kat la:', e);
  }
}

/**
 * Tcheke si gen mizik k ap jwe kounye a
 */
export function isSoundtrackPlaying() {
  return isPlaying && currentAudioElement !== null && !currentAudioElement.paused;
}

// Kanpe tout mizik otomatikman si itilizatè a chanje tab, kite sit la oswa minimize navigatè a
if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopHolidaySoundtrack();
    }
  });

  window.addEventListener('pagehide', () => {
    stopHolidaySoundtrack();
  });

  window.addEventListener('beforeunload', () => {
    stopHolidaySoundtrack();
  });
}
