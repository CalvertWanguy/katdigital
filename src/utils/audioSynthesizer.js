// Sistèm Audio pou KatDigital
// Jwe bèl mizik enstrimantal reyèl (otantik, san pawòl) pou chak okazyon :
// Nwèl, Nouvèl Ane, Lanmou, ak Tradisyon Ayisyen 1804.
// Sipòte tou yon fichye odyo pèsonalize si itilizatè a telechaje pa l.

export const AUDIO_TRACKS = {
  jingle_bells: '/audio/jingle_bells.mp3',
  we_wish_you: '/audio/we_wish_you.mp3',
  bon_ane: '/audio/radetzky_march.ogg',
  romance: '/audio/canon_in_d.ogg',
  haitian_tradition: '/audio/haiti_1804.ogg'
};

export const MUSIC_OPTIONS = [
  {
    id: 'jingle_bells',
    label: 'Klòch Nwèl • Jingle Bells (Enstrimantal)',
    desc: 'Melodi selebrasyon Nwèl ak ritm ak klòch fèt',
    category: 'noel',
    src: '/audio/jingle_bells.mp3'
  },
  {
    id: 'we_wish_you',
    label: 'We Wish You a Merry Christmas (Enstrimantal)',
    desc: 'Bèl klasik fèt Nwèl plen lajwa ak anbyans fanmi',
    category: 'noel',
    src: '/audio/we_wish_you.mp3'
  },
  {
    id: 'bon_ane',
    label: 'Swè Bòn Ane 2027 • Selebrasyon & Lajwa (Fanfare)',
    desc: 'Bèl fanfare jwaye e plen enèji pou akeyi nouvo ane 2027 la',
    category: 'nouvel-an',
    src: '/audio/radetzky_march.ogg'
  },
  {
    id: 'romance',
    label: 'Melodi Lanmou • Canon in D - Pachelbel (Pyano)',
    desc: 'Pi popilè melodi amoure ak dousè pou moun ou renmen',
    category: 'mennaj',
    src: '/audio/canon_in_d.ogg'
  },
  {
    id: 'haitian_tradition',
    label: 'Omaj 1804 & Tradisyon • La Dessalinienne (Fanfare)',
    desc: 'Im nasyonal ak grandè zansèt yo pou 1ye Janvye & Soup Joumou',
    category: 'tradition',
    src: '/audio/haiti_1804.ogg'
  },
  {
    id: 'none',
    label: 'San Mizik (Mòd Silans)',
    desc: 'Ouvri kat la dousman an silans san mizik',
    category: 'silent'
  }
];

let currentAudioElement = null;
let isPlaying = false;

/**
 * Jwe melodi fèt la selon ID mizik la oswa URL personnalisé a
 */
export function playHolidaySoundtrack(musicId = 'jingle_bells', customAudioUrl = null) {
  stopHolidaySoundtrack();

  if (musicId === 'none') {
    isPlaying = false;
    return false;
  }

  // Chwazi sous odyo a
  let src = null;
  if (customAudioUrl && typeof customAudioUrl === 'string' && customAudioUrl.trim()) {
    src = customAudioUrl.trim();
  } else {
    src = AUDIO_TRACKS[musicId] || AUDIO_TRACKS.jingle_bells;
  }

  if (!src) return false;

  try {
    currentAudioElement = new Audio(src);
    currentAudioElement.loop = true;
    currentAudioElement.volume = 0.65;

    const playPromise = currentAudioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
        })
        .catch((err) => {
          // Si navigatè a mande yon klik itilizatè anvan li kòmanse odyo a
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
