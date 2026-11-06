// Sistèm Audio pou KatDigital
// Jwe bèl mizik enstrimantal reyèl (otantik, san pawòl) pou chak okazyon :
// Nwèl, Nouvèl Ane, Lanmou, ak Tradisyon Ayisyen 1804.
// Sipòte tou yon fichye odyo pèsonalize si itilizatè a telechaje pa l.

export const AUDIO_TRACKS = {
  jingle_bells: '/audio/jingle_bells.wav',
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
    id: 'jingle_bells',
    label: 'Klòch Nwèl • Jingle Bells',
    desc: 'Melodi selebrasyon Nwèl ak ritm ak klòch fèt',
    category: 'noel',
    src: '/audio/jingle_bells.wav'
  },
  {
    id: 'we_wish_you',
    label: 'We Wish You a Merry Christmas',
    desc: 'Bèl klasik fèt Nwèl plen lajwa ak anbyans fanmi',
    category: 'noel',
    src: '/audio/we_wish_you.wav'
  },
  {
    id: 'deck_the_halls',
    label: 'Deck the Halls • Nwèl Fèt',
    desc: 'Tradisyon jwaye ak klòch Nwèl k ap sonnen',
    category: 'noel',
    src: '/audio/deck_the_halls.wav'
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

/**
 * Tcheke si gen mizik k ap jwe kounye a
 */
export function isSoundtrackPlaying() {
  return isPlaying && currentAudioElement !== null && !currentAudioElement.paused;
}
