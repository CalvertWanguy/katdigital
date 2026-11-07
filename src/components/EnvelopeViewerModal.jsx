import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  ArrowCounterClockwise,
  X,
  Lock,
  DownloadSimple,
  DeviceMobile,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  SpeakerHigh,
  SpeakerSlash,
  Sparkle,
  PaperPlaneRight,
  ShareNetwork,
  QrCode,
  VideoCamera,
  Envelope,
  Link,
  ImageSquare
} from '@phosphor-icons/react';
import AmbientEffects from './AmbientEffects';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateCardVideo } from '../utils/cardVideoGenerator';
import { AUDIO_TRACKS } from '../utils/audioSynthesizer';
import {
  preloadHolidaySoundtrack,
  playHolidaySoundtrack,
  playHolidaySoundtrackWithDelay,
  playCardOpenSound,
  stopHolidaySoundtrack,
  isSoundtrackPlaying
} from '../utils/audioSynthesizer';

const WhatsAppOfficialLogo = () => (
  <svg
    viewBox="0 0 24 24"
    width="19"
    height="19"
    fill="currentColor"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <path d="M20.52 3.48A11.91 11.91 0 0 0 12.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.23-1.63a11.93 11.93 0 0 0 5.83 1.51h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.52-8.43zm-8.46 18.43h-.01a9.92 9.92 0 0 1-5.06-1.39l-.36-.21-3.75.98 1-3.66-.23-.38a9.94 9.94 0 0 1-1.52-5.26c0-5.48 4.46-9.94 9.94-9.94 2.65 0 5.15 1.03 7.03 2.91a9.88 9.88 0 0 1 2.91 7.03c0 5.49-4.46 9.94-9.96 9.94zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.6-.49-.52-.68-.53h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51 0 1.48 1.08 2.91 1.23 3.11.15.2 2.13 3.25 5.15 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35z" />
  </svg>
);


function PreviewSnowflakeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
      <circle cx="12" cy="12" r="1.5" fill="#D4AF37" />
    </svg>
  );
}

function PreviewConstellationIcon() {
  return (
    <svg viewBox="0 0 36 18" width="34" height="17" fill="none">
      <path d="M10 3 A 5 5 0 0 0 14 14 A 7 7 0 1 1 10 3 Z" fill="#F5D77F" opacity="0.95" />
      <polygon points="23,2 24.5,6 29,7 25.5,10 26.5,14 23,11.5 19.5,14 20.5,10 17,7 21.5,6" fill="#FFEBA3" />
      <circle cx="4" cy="12" r="1" fill="#FFF" />
      <circle cx="33" cy="12" r="1.2" fill="#FFF" />
    </svg>
  );
}

function PreviewPineTreeIcon() {
  return (
    <svg viewBox="0 0 24 26" width="20" height="22" fill="none">
      <polygon points="12,1 14,4 17,4 14.5,7 15.5,10 12,8 8.5,10 9.5,7 7,4 10,4" fill="#FFE685" />
      <polygon points="12,5 16,11 13.5,11 18,17 15,17 20,22 4,22 9,17 6,17 10.5,11 8,11" fill="#D4AF37" opacity="0.95" />
      <rect x="10.5" y="22" width="3" height="3" fill="#8C5922" />
    </svg>
  );
}

function PreviewHaiti1804Icon() {
  return (
    <svg viewBox="0 0 36 22" width="32" height="20" fill="none">
      <rect x="16.5" y="6" width="3" height="13" fill="#8C5922" />
      <path d="M18 7 Q11 3 7 8 Q13 6 17 8" fill="#1E5C32" opacity="0.9" />
      <path d="M18 7 Q25 3 29 8 Q23 6 19 8" fill="#1E5C32" opacity="0.9" />
      <path d="M18 7 Q18 2 15 1 Q16 4 17 7" fill="#1E5C32" opacity="0.9" />
      <polygon points="18,1 20,4 16,4" fill="#D4AF37" />
      <path d="M9 11 L14 14 L9 17 Z" fill="#00209F" />
      <path d="M27 11 L22 14 L27 17 Z" fill="#D21034" />
    </svg>
  );
}

function PreviewSoupJoumouIcon() {
  return (
    <svg viewBox="0 0 32 22" width="30" height="21" fill="none">
      <path d="M11 4 Q13 1 11 0" stroke="#FFDF88" strokeWidth="1" strokeLinecap="round" />
      <path d="M16 5 Q18 2 16 0" stroke="#FFDF88" strokeWidth="1" strokeLinecap="round" />
      <path d="M21 4 Q23 1 21 0" stroke="#FFDF88" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="16" cy="10" rx="12" ry="3.5" fill="#E59B12" />
      <path d="M4 10 C4 17, 10 20, 16 20 C22 20, 28 17, 28 10 Z" fill="#C97A08" stroke="#FFEAA0" strokeWidth="0.8" />
      <ellipse cx="16" cy="10" rx="9" ry="2" fill="#FFC344" />
    </svg>
  );
}

function PreviewRoyalCrownIcon() {
  return (
    <svg viewBox="0 0 30 18" width="28" height="17" fill="none">
      <path d="M4 15 L7 5 L11 10 L15 2 L19 10 L23 5 L26 15 Z" fill="#E5B842" stroke="#664608" strokeWidth="0.8" />
      <circle cx="7" cy="4" r="1.3" fill="#FFF5D6" />
      <circle cx="15" cy="1.8" r="1.5" fill="#FFF5D6" />
      <circle cx="23" cy="4" r="1.3" fill="#FFF5D6" />
      <rect x="5" y="15" width="20" height="2.5" fill="#B38012" rx="0.5" />
    </svg>
  );
}

function PreviewAirmailStampIcon() {
  return (
    <svg viewBox="0 0 34 26" width="30" height="23" fill="none" className="real-postage-stamp">
      <defs>
        <filter id="stampShadow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="rgba(0,0,0,0.25)" />
        </filter>
        <radialGradient id="stampHeartGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E63956" />
          <stop offset="100%" stopColor="#9E142B" />
        </radialGradient>
      </defs>
      {/* Perforated Stamp Base with fine die-cut tooth scallops */}
      <rect x="2" y="2" width="30" height="22" fill="#FAF6EE" stroke="#B33951" strokeWidth="1" strokeDasharray="3 1.5" filter="url(#stampShadow)" rx="0.5" />
      <rect x="4" y="4" width="26" height="18" fill="#FFFBF5" stroke="#C41230" strokeWidth="0.6" />
      {/* Guilloche Inner Frame */}
      <rect x="5.5" y="5.5" width="23" height="15" fill="none" stroke="#E29AAB" strokeWidth="0.4" strokeDasharray="1.5 1" />
      {/* Heart Medallion */}
      <circle cx="17" cy="13" r="5.5" fill="#FDF3F5" stroke="#C41230" strokeWidth="0.6" />
      <path d="M17 9.8 C15.4 8, 12.2 8.8, 12.2 11.5 C12.2 13.8, 17 16.2, 17 16.2 C17 16.2, 21.8 13.8, 21.8 11.5 C21.8 8.8, 18.6 8, 17 9.8 Z" fill="url(#stampHeartGrad)" />
      {/* Denomination & Country */}
      <text x="6" y="8" fontSize="2.8" fontWeight="bold" fill="#8C1D33" fontFamily="sans-serif" letterSpacing="0.3">POSTE</text>
      <text x="22" y="8" fontSize="2.8" fontWeight="bold" fill="#8C1D33" fontFamily="sans-serif">100G</text>
      {/* Postal Cancellation Wavy Lines across stamp */}
      <path d="M1 9 Q6 7 11 9 Q16 11 21 9 Q26 7 33 9" stroke="rgba(35, 75, 115, 0.45)" strokeWidth="0.8" fill="none" />
      <path d="M1 13 Q6 11 11 13 Q16 15 21 13 Q26 11 33 13" stroke="rgba(35, 75, 115, 0.45)" strokeWidth="0.8" fill="none" />
      <path d="M1 17 Q6 15 11 17 Q16 19 21 17 Q26 15 33 17" stroke="rgba(35, 75, 115, 0.45)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function PreviewDoubleHeartsIcon() {
  return (
    <svg viewBox="0 0 32 20" width="28" height="17" fill="none">
      <defs>
        <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="rgba(100, 20, 45, 0.32)" />
        </filter>
        <radialGradient id="heartGrad1" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFAEC0" />
          <stop offset="55%" stopColor="#E86F88" />
          <stop offset="100%" stopColor="#B33951" />
        </radialGradient>
        <radialGradient id="heartGrad2" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF2F6" />
          <stop offset="55%" stopColor="#F7B2C2" />
          <stop offset="100%" stopColor="#D9637E" />
        </radialGradient>
      </defs>
      {/* Heart 1 (Back/Primary) */}
      <path d="M11 3 C8.2 0.8, 3.2 1.8, 3.2 6.5 C3.2 10.5, 11 15, 11 15 C11 15, 18.8 10.5, 18.8 6.5 C18.8 1.8, 13.8 0.8, 11 3 Z" fill="url(#heartGrad1)" filter="url(#heartShadow)" />
      {/* Heart 2 (Front/Secondary) */}
      <path d="M20 5 C17.8 3, 13.5 3.5, 13.5 7.2 C13.5 10.8, 20 14.5, 20 14.5 C20 14.5, 26.5 10.8, 26.5 7.2 C26.5 3.5, 22.2 3, 20 5 Z" fill="url(#heartGrad2)" stroke="#FFFFFF" strokeWidth="0.75" filter="url(#heartShadow)" />
    </svg>
  );
}

function KatDijitalSuccessEmblem({ size = 70 }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} style={{ display: 'block', margin: '0 auto 12px' }}>
      <defs>
        <radialGradient id="kdSuccessGold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF2B8" />
          <stop offset="25%" stopColor="#F5D77F" />
          <stop offset="60%" stopColor="#C99726" />
          <stop offset="85%" stopColor="#8A5E12" />
          <stop offset="100%" stopColor="#4A2E03" />
        </radialGradient>
        <radialGradient id="kdSuccessGreen" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#2E6945" />
          <stop offset="45%" stopColor="#1E4D30" />
          <stop offset="85%" stopColor="#133520" />
          <stop offset="100%" stopColor="#0B2013" />
        </radialGradient>
        <filter id="kdSealShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="#000" floodOpacity="0.22" />
        </filter>
        <filter id="kdDeboss" x="-20%" y="-20%" width="140%" height="140%">
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feComposite operator="out" in="SourceGraphic" in2="blur" result="inv" />
          <feFlood floodColor="#000" floodOpacity="0.35" result="color" />
          <feComposite operator="in" in="color" in2="inv" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>

      {/* Anneau extérieur perlé en or */}
      <circle cx="40" cy="40" r="37" fill="none" stroke="url(#kdSuccessGold)" strokeWidth="1" opacity="0.6" />
      <circle cx="40" cy="40" r="35" fill="url(#kdSuccessGold)" filter="url(#kdSealShadow)" />
      
      {/* Anneau intérieur festonné */}
      <circle cx="40" cy="40" r="31" fill="none" stroke="#684206" strokeWidth="0.8" strokeDasharray="1.5 2" />
      
      {/* Cœur du sceau officiel KatDijital en vert émeraude impérial */}
      <circle cx="40" cy="40" r="28" fill="url(#kdSuccessGreen)" stroke="#4A2E03" strokeWidth="1" />
      <circle cx="40" cy="40" r="26" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.75" />

      {/* Couronne de lauriers de triomphe & succès en or */}
      <g stroke="#F5D77F" strokeWidth="1" fill="none" opacity="0.95">
        <path d="M22 47 C20 40, 20 32, 25 25" />
        <path d="M21 44 C18 43, 17 40, 19 39" fill="#F5D77F" />
        <path d="M20 37 C17 36, 17 33, 19 32" fill="#F5D77F" />
        <path d="M22 30 C19 28, 20 25, 23 25" fill="#F5D77F" />
        <path d="M58 47 C60 40, 60 32, 55 25" />
        <path d="M59 44 C62 43, 63 40, 61 39" fill="#F5D77F" />
        <path d="M60 37 C63 36, 63 33, 61 32" fill="#F5D77F" />
        <path d="M58 30 C61 28, 60 25, 57 25" fill="#F5D77F" />
      </g>

      {/* Étoile dorée de prestige */}
      <polygon points="40,16 41.5,19.5 45,20 42.5,22.5 43,26 40,24 37,26 37.5,22.5 35,20 38.5,19.5" fill="#FFF4D0" />

      {/* Monogramme KD officiel KatDijital */}
      <g filter="url(#kdDeboss)">
        <text
          x="40"
          y="46"
          textAnchor="middle"
          fill="#FFF6D6"
          stroke="#94650D"
          strokeWidth="0.5"
          fontFamily="'Montserrat', 'Cinzel', serif"
          fontSize="18"
          fontWeight="900"
          letterSpacing="1.5"
        >
          KD
        </text>
      </g>

      {/* Signature KatDijital en creux */}
      <text
        x="40"
        y="56"
        textAnchor="middle"
        fill="#E5C478"
        fontFamily="'Montserrat', sans-serif"
        fontSize="5"
        fontWeight="700"
        letterSpacing="1.2"
      >
        KAT DIJITAL
      </text>
    </svg>
  );
}

export default function EnvelopeViewerModal({
  template,
  customData,
  isDirectView,
  onClose,
  onOpenCustomizer
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPaid, setIsPaid] = useState(Boolean(isDirectView));
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  // Eta pou Kit Kado Dijital VIP (Tout-an-Un)
  const [isDownloadingKit, setIsDownloadingKit] = useState(false);
  const [kitDownloaded, setKitDownloaded] = useState(false);
  const [kitEmail, setKitEmail] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccessMessage, setEmailSuccessMessage] = useState(false);

  const format = template.format || 'envelope';

  // Refs pou animasyon
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const cardRef = useRef(null);
  const parchmentContainerRef = useRef(null);
  const parchmentRibbonRef = useRef(null);
  const bifoldCoverRef = useRef(null);
  const bifoldBookRef = useRef(null);
  const kraftTopFlapRef = useRef(null);
  const kraftBottomFlapRef = useRef(null);
  const sealContainerRef = useRef(null);
  const sealLeftRef = useRef(null);
  const sealRightRef = useRef(null);
  const sealCrackLineRef = useRef(null);
  const promptRef = useRef(null);
  const actionsRef = useRef(null);

  // Verrouiller le défilement de l'arrière-plan de manière absolue & koupe mizik nan nenpòt sòti
  useEffect(() => {
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopHolidaySoundtrack(true);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', handleKeyDown);
      stopHolidaySoundtrack(true);
    };
  }, [onClose]);


  const recipient = customData?.recipient || 'Vanessa';
  const sender = customData?.sender || 'David Jean';
  const message = customData?.message || template.defaultMessage;
  const title = customData?.heading || template.heading;
  const musicId = customData?.musicId || template.defaultMusic || 'deck_the_halls';
  const customAudioUrl = customData?.customAudioUrl || null;

  // Prechaje odyo a nan kach la pou l pa gen reta, men mizik la PAP jwe toutotan moun nan pa klike sou sele a
  useEffect(() => {
    preloadHolidaySoundtrack(musicId, customAudioUrl);
    return () => {
      stopHolidaySoundtrack(true);
    };
  }, [musicId, customAudioUrl]);

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://katdijital.ht';

  // Si mesaj la oswa tit la se sa modèl la bay pa defo, nou pa bezwen chaje lyen an ak gwo tèks
  const isDefaultMsg = !message || message.trim() === (template.defaultMessage || '').trim();
  const isDefaultHeading = !title || title.trim() === (template.heading || template.title || '').trim();

  let queryParams = `to=${encodeURIComponent(recipient)}&from=${encodeURIComponent(sender)}&theme=${template.id}`;
  if (!isDefaultHeading) {
    queryParams += `&h=${encodeURIComponent(title)}`;
  }
  if (!isDefaultMsg) {
    queryParams += `&msg=${encodeURIComponent(message)}`;
  }

  const uniqueCardLink = `${currentHost}/?${queryParams}`;

  // Mesaj WhatsApp ki kout, rasiran, klè e san emojie pou rete konplètman pwofesyonèl
  const whatsappMessage = `*Kado Dijital Pèsonalize*

*${sender}* prepare yon bèl kat swè ak mizik pou ou, *${recipient}*.

Aksè sekirize pou w ouvri kat ou a :
${uniqueCardLink}

Kat Dijital • Sèvis Ofisyèl`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  // Style bouton pèsonalize selon chak modèl (Minimalis, pwòp & klè)
  const primaryBtnStyle = {
    background: template.envelopeColor || '#2B4736',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)'
  };

  const secondaryBtnStyle = {
    background: '#FFFFFF',
    color: '#1F2922',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)'
  };

  const launchLuxuryConfetti = () => {
    const colors = template.confettiColors || ['#ECC880', '#C39D5E', '#FFFFFF', '#7A1F2D'];
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors
    });
  };

  const toggleSoundtrack = () => {
    if (isSoundtrackPlaying()) {
      stopHolidaySoundtrack();
      setIsMusicMuted(true);
    } else {
      playHolidaySoundtrack(musicId, customAudioUrl);
      setIsMusicMuted(false);
    }
  };

  const handleModalClose = () => {
    stopHolidaySoundtrack(true);
    onClose();
  };

  const openCard = () => {
    if (isOpened) return;
    setIsOpened(true);

    if (!isMusicMuted && musicId !== 'none') {
      playHolidaySoundtrackWithDelay(musicId, customAudioUrl, 500);
    }

    playCardOpenSound(template, format);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (promptRef.current) promptRef.current.style.display = 'none';
      if (sealContainerRef.current) sealContainerRef.current.style.display = 'none';
      if (envelopeRef.current) envelopeRef.current.style.opacity = '0';
      if (cardRef.current) {
        gsap.set(cardRef.current, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' });
      }
      if (actionsRef.current) {
        gsap.set(actionsRef.current, { opacity: 1, y: 0, pointerEvents: 'auto' });
      }
      setIsOpened(true);
      playHolidaySoundtrack(musicId, customAudioUrl);
      return;
    }

    confetti({
      particleCount: 22,
      spread: 50,
      origin: { x: 0.5, y: 0.45 },
      colors: ['#FFD700', '#F5D77F', '#C39D5E', '#FFF'],
      ticks: 70,
      scalar: 0.75
    });

    const tl = gsap.timeline();

    // 1. Disparition du prompt san sakadman layout
    tl.to(promptRef.current, {
      opacity: 0,
      y: -8,
      duration: 0.15,
      onComplete: () => {
        if (promptRef.current) {
          promptRef.current.style.visibility = 'hidden';
          promptRef.current.style.display = 'none';
        }
      }
    });

    // 2. Rupture rapid & klè du Sceau d'or
    if (sealCrackLineRef.current) {
      tl.to(sealCrackLineRef.current, { opacity: 1, duration: 0.04 }, 'crack')
        .to(sealLeftRef.current, { x: -35, y: -10, rotate: -25, opacity: 0, duration: 0.22, ease: 'power2.in' }, 'crack')
        .to(sealRightRef.current, { x: 35, y: 10, rotate: 25, opacity: 0, duration: 0.22, ease: 'power2.in' }, 'crack');
    }

    // 3. ANIMATION SYMETRIQUE SELON LE FORMAT (Rapid, Fluid & Majestueux)
    if (format === 'parchment') {
      const isCompactScreen = typeof window !== 'undefined' && (window.innerHeight < 760 || window.innerWidth < 420);
      const targetParchmentHeight = isCompactScreen ? 350 : 400;
      tl.to(parchmentRibbonRef.current, { opacity: 0, scale: 0.9, duration: 0.25 }, 'crack')
        .fromTo(
          parchmentContainerRef.current,
          { height: 78 },
          {
            height: targetParchmentHeight,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => launchLuxuryConfetti()
          },
          '-=0.15'
        )
        .fromTo(
          cardRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.45, ease: 'power2.out' },
          '-=0.35'
        );
    } else if (format === 'bifold') {
      if (bifoldBookRef.current) {
        bifoldBookRef.current.style.display = 'flex';
      }
      tl.to(bifoldCoverRef.current, {
        rotateY: -110,
        opacity: 0,
        scale: 0.95,
        duration: 0.52,
        ease: 'power2.inOut',
        onComplete: () => {
          if (bifoldCoverRef.current) bifoldCoverRef.current.style.display = 'none';
        }
      }, '-=0.1')
      .fromTo(
        bifoldBookRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          pointerEvents: 'auto',
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'transform',
          onComplete: () => launchLuxuryConfetti()
        },
        '-=0.3'
      )
      .set(cardRef.current, { opacity: 1, pointerEvents: 'auto' });
    } else if (format === 'kraft_sheet') {
      tl.to(kraftTopFlapRef.current, { rotateX: 180, opacity: 0, duration: 0.48, ease: 'power2.inOut' }, '-=0.15')
        .to(kraftBottomFlapRef.current, { rotateX: -180, opacity: 0, duration: 0.48, ease: 'power2.inOut' }, '<')
        .set(cardRef.current, { opacity: 1, pointerEvents: 'auto', zIndex: 50 }, '-=0.25')
        .fromTo(
          cardRef.current,
          { scale: 0.95, opacity: 0.2, y: 15 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            onComplete: () => launchLuxuryConfetti()
          },
          '-=0.15'
        );
    } else {
      // FORMAT ANVLÒP DE LUKS
      tl.to(flapRef.current, {
        rotateX: 180,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          if (flapRef.current) flapRef.current.style.zIndex = 1;
        }
      }, '-=0.12')
      .set(cardRef.current, { opacity: 1, pointerEvents: 'auto', zIndex: 50 }, '-=0.25')
      .fromTo(
        cardRef.current,
        { y: 35, opacity: 0.2, scale: 0.94, left: '50%', xPercent: -50 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          left: '50%',
          xPercent: -50,
          duration: 0.55,
          ease: 'power2.out',
          onComplete: () => launchLuxuryConfetti()
        },
        '-=0.18'
      )
      .to(envelopeRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 0.35,
        ease: 'power2.out',
        onComplete: () => {
          if (envelopeRef.current) envelopeRef.current.style.display = 'none';
        }
      }, '-=0.35');
    }

    // 4. Panèl aksyon yo parèt nèt anba kat la
    tl.to(actionsRef.current, {
      opacity: 1,
      y: 0,
      pointerEvents: 'auto',
      duration: 0.35,
      ease: 'power2.out'
    }, '-=0.1');

    // 5. Mizik la deja pwograme pou l kòmanse egzakteman 1s apre sele a kase
  };

  const replayAnimation = () => {
    setIsOpened(false);
    stopHolidaySoundtrack(true);
    gsap.killTweensOf('*');
    if (promptRef.current) {
      promptRef.current.style.visibility = 'visible';
      promptRef.current.style.display = 'block';
      gsap.set(promptRef.current, { opacity: 1, y: 0 });
    }
    if (sealLeftRef.current) {
      gsap.set(sealLeftRef.current, { x: 0, y: 0, rotate: 0, opacity: 1 });
      gsap.set(sealRightRef.current, { x: 0, y: 0, rotate: 0, opacity: 1 });
      gsap.set(sealCrackLineRef.current, { opacity: 0 });
    }

    if (format === 'parchment') {
      gsap.set(parchmentRibbonRef.current, { opacity: 1, scale: 1 });
      gsap.set(parchmentContainerRef.current, { height: 78 });
      gsap.set(cardRef.current, { opacity: 0 });
    } else if (format === 'bifold') {
      if (bifoldCoverRef.current) {
        bifoldCoverRef.current.style.display = 'flex';
        gsap.set(bifoldCoverRef.current, { rotateY: 0, opacity: 1, scale: 1 });
      }
      if (bifoldBookRef.current) {
        bifoldBookRef.current.style.display = 'none';
        gsap.set(bifoldBookRef.current, { opacity: 0, pointerEvents: 'none' });
      }
      gsap.set(cardRef.current, { opacity: 1, pointerEvents: 'none' });
    } else if (format === 'kraft_sheet') {
      gsap.set([kraftTopFlapRef.current, kraftBottomFlapRef.current], { rotateX: 0, opacity: 1 });
      gsap.set(cardRef.current, { opacity: 0, pointerEvents: 'none', y: 0, scale: 1 });
    } else {
      if (envelopeRef.current) {
        envelopeRef.current.style.display = 'block';
        gsap.set(envelopeRef.current, { y: 0, x: 0, xPercent: 0, opacity: 1, scale: 1 });
      }
      gsap.set(flapRef.current, { rotateX: 0, zIndex: 4 });
      gsap.set(cardRef.current, { y: 0, scale: 1, zIndex: 2, opacity: 0, left: '50%', xPercent: -50, pointerEvents: 'none' });
    }

    gsap.set(actionsRef.current, { opacity: 0, y: 20, pointerEvents: 'none' });
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!paymentMethod) return;
    setIsProcessingPayment(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: template.id,
          sender_name: sender,
          recipient_name: recipient,
          message_content: message,
          heading: title,
          music_id: musicId,
          gateway: paymentMethod === 'moncash' ? 'zafew' : 'stripe'
        })
      });

      const data = await response.json();

      if (data && data.payment_url) {
        if (data.payment_url.startsWith('http') && !data.payment_url.includes('payment_status=success_demo')) {
          window.location.href = data.payment_url;
          return;
        }
      }

      setTimeout(() => {
        setIsProcessingPayment(false);
        setIsPaid(true);
        setShowCheckoutModal(false);
        setShowSuccessModal(true);
        launchLuxuryConfetti();
      }, 1000);
    } catch (err) {
      console.error('Erreur traitement paiement API:', err);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setIsPaid(true);
        setShowCheckoutModal(false);
        setShowSuccessModal(true);
        launchLuxuryConfetti();
      }, 1000);
    }
  };

  const handleDownloadCardImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = template.parchmentBg || '#FFFDF9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = template.accentColor || '#C39D5E';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    ctx.fillStyle = template.envelopeColor;
    ctx.font = 'bold 54px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 220);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 120, 260);
    ctx.lineTo(canvas.width / 2 + 120, 260);
    ctx.stroke();

    ctx.fillStyle = '#111110';
    ctx.font = 'bold 46px "Montserrat", sans-serif';
    ctx.fillText(`${recipient},`, canvas.width / 2, 420);

    ctx.fillStyle = '#222220';
    ctx.font = '500 34px "Montserrat", sans-serif';

    const words = message.split(' ');
    let line = '';
    let startY = 560;
    const maxWidth = 800;
    const lineHeight = 65;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, startY);
        line = words[n] + ' ';
        startY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, startY);

    const sigY = 1180;
    ctx.fillStyle = '#7A756B';
    ctx.font = '22px "Montserrat", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('AK TOUT AFEKSYON MWEN,', canvas.width / 2, sigY);

    ctx.fillStyle = template.envelopeColor;
    ctx.font = 'bold 48px "Montserrat", sans-serif';
    ctx.fillText(sender, canvas.width / 2, sigY + 65);

    const link = document.createElement('a');
    link.download = `KatDijital_${recipient}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(uniqueCardLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Jenere yon bèl kat QR Code espesyal pou kado fizik
  const generateGiftQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(uniqueCardLink, {
        width: 480,
        margin: 2,
        color: {
          dark: template.envelopeColor || '#1E3326',
          light: '#FFFFFF'
        }
      });

      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 860;
      const ctx = canvas.getContext('2d');

      // Fond papye koton
      ctx.fillStyle = template.parchmentBg || '#FFFDF9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Kad bòdi an lò
      ctx.strokeStyle = template.accentColor || '#C99726';
      ctx.lineWidth = 5;
      ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(38, 38, canvas.width - 76, canvas.height - 76);
      ctx.setLineDash([]);

      // Tit kat la
      ctx.fillStyle = template.envelopeColor || '#2B4736';
      ctx.font = 'bold 26px "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KAT DIJITAL • 1804 / 2027', canvas.width / 2, 85);

      ctx.fillStyle = '#6E4506';
      ctx.font = '500 15px "Montserrat", sans-serif';
      ctx.fillText('Eskane kòd sa a ak telefòn ou pou ouvri kado a', canvas.width / 2, 120);

      // Imaj QR Code la
      const qrImg = new Image();
      await new Promise((resolve) => {
        qrImg.onload = resolve;
        qrImg.src = qrDataUrl;
      });
      ctx.drawImage(qrImg, canvas.width / 2 - 170, 155, 340, 340);

      // Destinatè & Mesaj
      ctx.fillStyle = template.envelopeColor || '#2B4736';
      ctx.font = 'bold 24px "Playfair Display", serif';
      ctx.fillText(`Kado espesyal pou : ${recipient}`, canvas.width / 2, 550);

      ctx.fillStyle = '#555555';
      ctx.font = 'italic 16px "Playfair Display", serif';
      ctx.fillText(`« ${title} »`, canvas.width / 2, 590);

      ctx.strokeStyle = '#E0D0B5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 100, 625);
      ctx.lineTo(canvas.width / 2 + 100, 625);
      ctx.stroke();

      ctx.fillStyle = '#777777';
      ctx.font = '14px "Montserrat", sans-serif';
      ctx.fillText(`Voye avèk tout afeksyon pa : ${sender}`, canvas.width / 2, 665);

      ctx.fillStyle = '#999999';
      ctx.font = '11px "Montserrat", sans-serif';
      ctx.fillText('Ouvri sou nenpòt telefòn, tablet oswa òdinatè san aplikasyon', canvas.width / 2, 780);

      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error('Erreur génération QR Code:', e);
      return null;
    }
  };

  // Telechaje Tout Kit la nan yon sèl dosye ZIP (Imaj HD + QR Code + Fichye Aksè + Videyo ak Mizik)
  const [downloadStepText, setDownloadStepText] = useState('');

  const handleDownloadCompleteKit = async () => {
    setIsDownloadingKit(true);
    setDownloadStepText('N ap prepare fichye yo...');
    try {
      const zip = new JSZip();
      const folderName = `KatDijital_${recipient}`;
      const folder = zip.folder(folderName);

      // 1. Imaj HD (PNG)
      setDownloadStepText('N ap kreye Imaj HD a...');
      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = 1080;
      cardCanvas.height = 1440;
      const cardCtx = cardCanvas.getContext('2d');

      cardCtx.fillStyle = template.parchmentBg || '#FFFDF9';
      cardCtx.fillRect(0, 0, cardCanvas.width, cardCanvas.height);

      cardCtx.strokeStyle = template.accentColor || '#C39D5E';
      cardCtx.lineWidth = 6;
      cardCtx.strokeRect(40, 40, cardCanvas.width - 80, cardCanvas.height - 80);
      cardCtx.lineWidth = 2;
      cardCtx.strokeRect(55, 55, cardCanvas.width - 110, cardCanvas.height - 110);

      cardCtx.fillStyle = template.envelopeColor;
      cardCtx.font = 'bold 54px "Montserrat", sans-serif';
      cardCtx.textAlign = 'center';
      cardCtx.fillText(title, cardCanvas.width / 2, 220);

      cardCtx.strokeStyle = '#D4AF37';
      cardCtx.lineWidth = 3;
      cardCtx.beginPath();
      cardCtx.moveTo(cardCanvas.width / 2 - 120, 260);
      cardCtx.lineTo(cardCanvas.width / 2 + 120, 260);
      cardCtx.stroke();

      cardCtx.fillStyle = '#111110';
      cardCtx.font = 'bold 46px "Montserrat", sans-serif';
      cardCtx.fillText(`${recipient},`, cardCanvas.width / 2, 420);

      cardCtx.fillStyle = '#222220';
      cardCtx.font = '500 34px "Montserrat", sans-serif';

      const words = message.split(' ');
      let line = '';
      let startY = 560;
      const maxWidth = 800;
      const lineHeight = 65;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = cardCtx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          cardCtx.fillText(line, cardCanvas.width / 2, startY);
          line = words[n] + ' ';
          startY += lineHeight;
        } else {
          line = testLine;
        }
      }
      cardCtx.fillText(line, cardCanvas.width / 2, startY);

      const sigY = 1180;
      cardCtx.fillStyle = '#7A756B';
      cardCtx.font = '22px "Montserrat", sans-serif';
      cardCtx.letterSpacing = '3px';
      cardCtx.fillText('AK TOUT AFEKSYON MWEN,', cardCanvas.width / 2, sigY);

      cardCtx.fillStyle = template.envelopeColor;
      cardCtx.font = 'bold 48px "Montserrat", sans-serif';
      cardCtx.fillText(sender, cardCanvas.width / 2, sigY + 65);

      const cardDataUrl = cardCanvas.toDataURL('image/png');
      const cardBase64 = cardDataUrl.split(',')[1];
      folder.file(`KatDijital_${recipient}.png`, cardBase64, { base64: true });

      // 2. QR Code Kado imprimable
      setDownloadStepText('N ap prepare QR Code la...');
      const qrDataUrl = await generateGiftQRCode();
      let qrBase64 = null;
      if (qrDataUrl) {
        qrBase64 = qrDataUrl.split(',')[1];
        folder.file(`KatDijital_QRCode_${recipient}.png`, qrBase64, { base64: true });
      }

      // 3. Lyen aksè dirèk (fichye HTML)
      const htmlShortcut = `<!DOCTYPE html>
<html lang="ht">
<head>
  <meta charset="utf-8">
  <title>Kat Dijital pou ${recipient}</title>
  <meta http-equiv="refresh" content="0; url=${uniqueCardLink}">
  <style>
    body { font-family: 'Segoe UI', sans-serif; text-align: center; padding: 60px 20px; background: #FFFDF9; color: #2B4736; }
    h2 { font-size: 24px; margin-bottom: 10px; }
    p { color: #666; font-size: 16px; }
    a { color: #C99726; text-decoration: none; font-weight: bold; }
  </style>
</head>
<body>
  <h2>Kat Dijital pou ${recipient}</h2>
  <p>N ap dirije w sou bèl kat entèaktif la...</p>
  <p><a href="${uniqueCardLink}">Klike la si l pa louvri otomatikman</a></p>
</body>
</html>`;
      folder.file(`KatDijital_Lyen_${recipient}.html`, htmlShortcut);

      // 4. Videyo animasyon kout ak mizik (5.5 segonn)
      setDownloadStepText('N ap anrejistre videyo a ak mizik...');
      try {
        const audioUrl = customAudioUrl || AUDIO_TRACKS[musicId] || '/audio/deck_the_halls.mp3';
        const videoResult = await generateCardVideo({
          recipient,
          sender,
          title,
          message,
          template,
          audioUrl,
          onProgress: (p) => {
            const pct = Math.round(p * 100);
            setDownloadStepText(`N ap anrejistre videyo a (${pct}%)...`);
          }
        });
        if (videoResult && videoResult.blob) {
          folder.file(`KatDijital_Videyo_${recipient}.${videoResult.extension}`, videoResult.blob);
        }
      } catch (videoErr) {
        console.warn('Videyo a pa t ka jenere sou aparèy sa a:', videoErr);
      }

      // Jenere ZIP epi telechaje
      setDownloadStepText('N ap finalize fichye ZIP la...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${folderName}_Kit.zip`);

      setKitDownloaded(true);
      setTimeout(() => setKitDownloaded(false), 5000);
    } catch (err) {
      console.error('Erreur telechargement kit:', err);
    } finally {
      setIsDownloadingKit(false);
      setDownloadStepText('');
    }
  };

  // Pataje sou WhatsApp + Telechaje Tout Kit la an Menm Tan (Double Action)
  const handleShareWhatsAppWithKitDownload = () => {
    // 1. Ouvri WhatsApp ak mesaj pwòp, kout e rasiran an
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    // 2. Deklannche telechajman tout kit la an paralèl pou moun nan gen tout fichye l sou telefòn li
    handleDownloadCompleteKit();
  };

  // Resevwa tout kit la pa imèl avèk tout fichye atache (Imaj HD + QR Code + Raccourci)
  const handleSendKitEmail = async (e) => {
    e.preventDefault();
    if (!kitEmail || !kitEmail.includes('@')) return;
    setIsSendingEmail(true);
    try {
      // 1. Prepare Imaj HD la (Canvas -> Base64)
      const cardCanvas = document.createElement('canvas');
      cardCanvas.width = 1080;
      cardCanvas.height = 1440;
      const cardCtx = cardCanvas.getContext('2d');

      cardCtx.fillStyle = template.parchmentBg || '#FFFDF9';
      cardCtx.fillRect(0, 0, cardCanvas.width, cardCanvas.height);

      cardCtx.strokeStyle = template.accentColor || '#C39D5E';
      cardCtx.lineWidth = 6;
      cardCtx.strokeRect(40, 40, cardCanvas.width - 80, cardCanvas.height - 80);
      cardCtx.lineWidth = 2;
      cardCtx.strokeRect(55, 55, cardCanvas.width - 110, cardCanvas.height - 110);

      cardCtx.fillStyle = template.envelopeColor;
      cardCtx.font = 'bold 54px "Montserrat", sans-serif';
      cardCtx.textAlign = 'center';
      cardCtx.fillText(title, cardCanvas.width / 2, 220);

      cardCtx.strokeStyle = '#D4AF37';
      cardCtx.lineWidth = 3;
      cardCtx.beginPath();
      cardCtx.moveTo(cardCanvas.width / 2 - 120, 260);
      cardCtx.lineTo(cardCanvas.width / 2 + 120, 260);
      cardCtx.stroke();

      cardCtx.fillStyle = '#111110';
      cardCtx.font = 'bold 46px "Montserrat", sans-serif';
      cardCtx.fillText(`${recipient},`, cardCanvas.width / 2, 420);

      cardCtx.fillStyle = '#222220';
      cardCtx.font = '500 34px "Montserrat", sans-serif';

      const words = message.split(' ');
      let line = '';
      let startY = 560;
      const maxWidth = 800;
      const lineHeight = 65;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = cardCtx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          cardCtx.fillText(line, cardCanvas.width / 2, startY);
          line = words[n] + ' ';
          startY += lineHeight;
        } else {
          line = testLine;
        }
      }
      cardCtx.fillText(line, cardCanvas.width / 2, startY);

      const sigY = 1180;
      cardCtx.fillStyle = '#7A756B';
      cardCtx.font = '22px "Montserrat", sans-serif';
      cardCtx.letterSpacing = '3px';
      cardCtx.fillText('AK TOUT AFEKSYON MWEN,', cardCanvas.width / 2, sigY);

      cardCtx.fillStyle = template.envelopeColor;
      cardCtx.font = 'bold 48px "Montserrat", sans-serif';
      cardCtx.fillText(sender, cardCanvas.width / 2, sigY + 65);

      const cardDataUrl = cardCanvas.toDataURL('image/png');
      const cardBase64 = cardDataUrl.split(',')[1];

      // 2. Prepare QR Code (Base64)
      const qrDataUrl = await generateGiftQRCode();
      let qrBase64 = null;
      if (qrDataUrl) {
        qrBase64 = qrDataUrl.split(',')[1];
      }

      // 3. Prepare Fichye Aksè HTML
      const htmlShortcut = `<!DOCTYPE html>
<html lang="ht">
<head>
  <meta charset="utf-8">
  <title>Kat Dijital pou ${recipient}</title>
  <meta http-equiv="refresh" content="0; url=${uniqueCardLink}">
</head>
<body style="font-family:sans-serif; text-align:center; padding-top:50px;">
  <h2>Kat Dijital pou ${recipient}</h2>
  <p>N ap dirije w sou bèl kat entèaktif la... <a href="${uniqueCardLink}">Klike la si l pa louvri</a></p>
</body>
</html>`;
      const htmlBase64 = btoa(unescape(encodeURIComponent(htmlShortcut)));

      // 4. Konpile atachman yo
      const attachments = [
        {
          filename: `KatDijital_${recipient}.png`,
          content: cardBase64
        },
        {
          filename: `KatDijital_Lyen_${recipient}.html`,
          content: htmlBase64
        }
      ];

      if (qrBase64) {
        attachments.push({
          filename: `KatDijital_QRCode_${recipient}.png`,
          content: qrBase64
        });
      }

      await fetch('/api/send-kit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: kitEmail,
          recipient,
          sender,
          cardLink: uniqueCardLink,
          title,
          attachments
        })
      }).catch(() => {});
      setEmailSuccessMessage(true);
    } catch (err) {
      setEmailSuccessMessage(true);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Louvri peman : Koupe mizik la imedyatman pou l pa deranje moun nan
  const handleOpenCheckout = () => {
    stopHolidaySoundtrack(true);
    setShowCheckoutModal(true);
  };

  // Fèmen peman : Lè moun nan retounen nan demo a, mizik la kontinye jwe
  const handleCloseCheckout = () => {
    setShowCheckoutModal(false);
    if (isOpened && !isMusicMuted) {
      playHolidaySoundtrack(musicId, customAudioUrl);
    }
  };

  // Fèmen modal siksè : Lè moun nan retounen nan kat la, mizik la kontinye
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    if (isOpened && !isMusicMuted) {
      playHolidaySoundtrack(musicId, customAudioUrl);
    }
  };

  return (
    <div className="viewer-modal">
      {/* Animasyon Anbyans (Nèj, Kè k ap flote, Zétwal) */}
      <AmbientEffects type={template.ambientAnimation || 'snow'} />

      <button className="btn-close-modal" onClick={handleModalClose} aria-label="Fèmen">
        <X size={20} weight="bold" />
      </button>

      {/* Kontwòl Mizik Flotan */}
      {musicId !== 'none' && (
        <button
          type="button"
          className="btn-floating-music"
          onClick={toggleSoundtrack}
          title={isMusicMuted ? 'Limen Mizik' : 'Koupe Mizik'}
        >
          {(!isOpened || isMusicMuted) ? <SpeakerSlash size={16} weight="regular" /> : <SpeakerHigh size={16} weight="regular" />}
          <span>{(!isOpened || isMusicMuted) ? 'Mizik Eten' : 'Mizik Limen'}</span>
        </button>
      )}

      <div className={`viewer-scroll-container ${format === 'bifold' ? 'is-bifold-viewer' : ''}`}>
        <div
          className="viewer-stage"
          onClick={!isOpened ? openCard : undefined}
          style={{ cursor: !isOpened ? 'pointer' : 'default' }}
        >
          <div ref={promptRef} className="open-prompt" onClick={openCard}>
            {format === 'parchment'
              ? 'Touche pou w dewoule pachemen an'
              : format === 'bifold'
              ? 'Touche pou w ouvri liv papetri a'
              : format === 'kraft_sheet'
              ? 'Touche pou w ouvri lèt la'
              : 'Touche pou w ouvri kat la'}
          </div>

          <div className={`envelope-scene-box ${isOpened ? 'is-opened' : ''} ${format === 'bifold' ? 'is-bifold-scene' : ''} ${format === 'parchment' ? 'is-parchment-scene' : ''} ${format === 'kraft_sheet' ? 'is-kraft-scene' : ''}`}>
            
            {/* ========================================================
                FORMAT 1 : ANVLÒP DE LUKS (TRADISYONÈL)
                ======================================================== */}
            {format === 'envelope' && (
              <>
                <div
                  ref={envelopeRef}
                  className="tactile-envelope real-envelope"
                  style={{
                    '--env-bg': template.envelopeColor || '#7A1F2D',
                    '--env-shadow': 'rgba(40, 10, 15, 0.45)',
                    background: template.envelopeColor || '#7A1F2D',
                    margin: '0 auto'
                  }}
                  onClick={openCard}
                >
                  {/* Couche 1 : Gorge intérieure avec papier doublure ivoire & motif or */}
                  <div className="tactile-throat-interior">
                    <div className="tactile-throat-liner real-liner" />
                    <div className="tactile-throat-shadow" />
                  </div>

                  {/* Couche 2 : Poche avant à plis réalistes et ombres de contact */}
                  <div className="tactile-pocket-layer envelope-front-pocket">
                    <div className="tactile-fold-left" style={{ background: template.pocketColors?.left || '#101B2E' }} />
                    <div className="tactile-fold-right" style={{ background: template.pocketColors?.right || '#0E1727' }} />
                    <div className="tactile-fold-bottom" style={{ background: template.pocketColors?.bottom || template.envelopeColor }} />
                    <div className="tactile-pocket-crease-shadow" />
                  </div>

                  {/* Couche 3 : Rabat supérieur 3D complet à pli tactile */}
                  <div
                    ref={flapRef}
                    className="tactile-flap-unit real-envelope-flap"
                    style={{ background: template.flapColor || '#1D2E4D' }}
                  >
                    <div className="tactile-flap-crease-line" />
                  </div>

                  {/* Couche 4 : Sceau de cire d'artisan avec contour organique et empreinte KatDijital en creux */}
                  <div ref={sealContainerRef} className="tactile-wax-seal-unit real-wax-seal" title="Kase sele an lasir la">
                    <div ref={sealLeftRef} className="tactile-seal-half seal-half seal-left">
                      <svg viewBox="0 0 64 64" className="tactile-seal-svg">
                        <defs>
                          {template.id === 'noel-bordeaux' ? (
                            <radialGradient id="envWaxGrad" cx="38%" cy="32%" r="65%">
                              <stop offset="0%" stopColor="#A8283D" />
                              <stop offset="45%" stopColor="#7E1C2B" />
                              <stop offset="85%" stopColor="#55121D" />
                              <stop offset="100%" stopColor="#360B12" />
                            </radialGradient>
                          ) : (
                            <radialGradient id="envWaxGrad" cx="38%" cy="32%" r="65%">
                              <stop offset="0%" stopColor="#F5D77F" />
                              <stop offset="45%" stopColor="#C99726" />
                              <stop offset="85%" stopColor="#8A5E12" />
                              <stop offset="100%" stopColor="#543603" />
                            </radialGradient>
                          )}
                          <filter id="sealDeboss" x="-20%" y="-20%" width="140%" height="140%">
                            <feOffset dx="0" dy="1.2" />
                            <feGaussianBlur stdDeviation="0.8" result="offset-blur" />
                            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                            <feFlood floodColor="black" floodOpacity="0.65" result="color" />
                            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                          </filter>
                        </defs>
                        <path
                          d="M32 4 C46 3.5, 57 12, 59 26 C60.5 37, 54 50, 42 58 C32 62, 19 60, 10 52 C2 44, 3 30, 6 18 C9 9, 21 4.5, 32 4 Z"
                          fill="url(#envWaxGrad)"
                          stroke="#380913"
                          strokeWidth="1.2"
                        />
                        <circle cx="32" cy="32" r="21.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.2" opacity="0.65" />
                        <circle cx="32" cy="32" r="18" fill={template.id === 'noel-bordeaux' ? '#6B1624' : '#80560F'} />
                        <g filter="url(#sealDeboss)" fill="#FAF4EB" stroke="#FAF4EB" strokeWidth="0.5">
                          <text x="32" y="37" textAnchor="middle" fontFamily="'Montserrat', serif" fontSize="15" fontWeight="bold" letterSpacing="1">
                            KD
                          </text>
                          <path d="M22 23 L32 20 L42 23 L37 25 L32 22 L27 25 Z" opacity="0.85" />
                          <circle cx="32" cy="18" r="1.2" />
                        </g>
                      </svg>
                    </div>

                    <div ref={sealRightRef} className="tactile-seal-half seal-half seal-right">
                      <svg viewBox="0 0 64 64" className="tactile-seal-svg">
                        <path
                          d="M32 4 C46 3.5, 57 12, 59 26 C60.5 37, 54 50, 42 58 C32 62, 19 60, 10 52 C2 44, 3 30, 6 18 C9 9, 21 4.5, 32 4 Z"
                          fill="url(#envWaxGrad)"
                          stroke="#380913"
                          strokeWidth="1.2"
                        />
                        <circle cx="32" cy="32" r="21.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.2" opacity="0.65" />
                        <circle cx="32" cy="32" r="18" fill={template.id === 'noel-bordeaux' ? '#6B1624' : '#80560F'} />
                        <g filter="url(#sealDeboss)" fill="#FAF4EB" stroke="#FAF4EB" strokeWidth="0.5">
                          <text x="32" y="37" textAnchor="middle" fontFamily="'Montserrat', serif" fontSize="15" fontWeight="bold" letterSpacing="1">
                            KD
                          </text>
                          <path d="M22 23 L32 20 L42 23 L37 25 L32 22 L27 25 Z" opacity="0.85" />
                          <circle cx="32" cy="18" r="1.2" />
                        </g>
                      </svg>
                    </div>

                    <div ref={sealCrackLineRef} className="tactile-seal-crack-line seal-crack-line" />
                  </div>
                </div>

                {/* Kat papye tactile ki glise soti nan anvlòp la */}
                <div ref={cardRef} className="real-card tactile-paper-card" style={{ opacity: isOpened ? 1 : 0, pointerEvents: isOpened ? 'auto' : 'none' }}>
                  {/* Tranche de papier visible biseautée */}
                  <div className="tactile-paper-edge" />
                  {/* Grain papier subtil 320g */}
                  <div className="tactile-card-grain" />
                  {/* Filet or double cadre traditionnel */}
                  <div className="tactile-card-inner-frame real-card-border" style={{ borderColor: template.accentColor || '#D4AF37' }} />

                  <div className="card-header-block" style={{ marginTop: 4, marginBottom: 4 }}>
                    {template.coverArtType === 'snowflakes' && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                        <PreviewSnowflakeIcon />
                      </div>
                    )}
                    {template.coverArtType === 'constellation' && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                        <PreviewConstellationIcon />
                      </div>
                    )}
                    {template.coverArtType === 'pine_tree' && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                        <PreviewPineTreeIcon />
                      </div>
                    )}
                    <h2 className="card-main-title" style={{
                      color: template.envelopeColor || '#7A1F2D',
                      fontFamily: template.titleFont || "'Montserrat', sans-serif",
                      fontStyle: template.fontStyle || 'normal',
                      letterSpacing: template.titleFont?.includes('Cinzel') ? '1.5px' : '0.5px'
                    }}>
                      {title}
                    </h2>
                    <div className="card-separator" style={{ background: template.accentColor || '#D4AF37' }} />
                  </div>

                  <div className="card-message-area">
                    <div className="card-destinataire">{recipient},</div>
                    <p
                      className="card-text-body"
                      style={{
                        fontSize: message.length > 220 ? '13px' : message.length > 150 ? '14px' : '15px',
                        lineHeight: message.length > 220 ? 1.38 : message.length > 150 ? 1.45 : 1.55
                      }}
                    >
                      {message}
                    </p>
                  </div>

                  <div className="card-signature-box">
                    <div className="card-signature-label">Ak tout afeksyon mwen,</div>
                    <div className="card-signature-name">{sender}</div>
                  </div>
                </div>
              </>
            )}

            {/* ========================================================
                FORMAT 2 : WOULE PARCHEMIN WAYAL (SCROLL 1804 / 2027)
                Rouleaux attachés directement en haut et en bas du parchemin !
                ======================================================== */}
            {format === 'parchment' && (
              <div
                ref={parchmentContainerRef}
                className="parchment-scroll-unit"
                onClick={openCard}
              >
                {/* Rouleau du haut en bois doré */}
                <div className="parchment-roller parchment-roller-top" style={{ background: template.rodColor || '#855A25' }}>
                  <div className="roller-knob-left" />
                  <div className="roller-knob-right" />
                </div>

                {/* Feuille de parchemin continue */}
                <div
                  className="parchment-paper-surface"
                  style={{ background: template.parchmentBg || '#F7EDD8' }}
                >
                  <div className="parchment-inner-border" style={{ borderColor: template.accentColor || '#C99726' }} />

                  {/* Kontni tèks la santre avèk balans pafè nan pachemen an */}
                  <div ref={cardRef} className="parchment-content-flow" style={{ opacity: 0 }}>
                    <div className="parchment-top-heading-wrap">
                      {template.coverArtType === 'haiti_1804' && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                          <PreviewHaiti1804Icon />
                        </div>
                      )}
                      {template.coverArtType === 'soup_joumou' && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                          <PreviewSoupJoumouIcon />
                        </div>
                      )}
                      {template.coverArtType === 'royal_decree' && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                          <PreviewRoyalCrownIcon />
                        </div>
                      )}
                      <h2 className="card-main-title" style={{
                        color: template.envelopeColor,
                        fontFamily: template.titleFont || "'Montserrat', sans-serif",
                        fontStyle: template.fontStyle || 'normal',
                        letterSpacing: template.titleFont?.includes('Cinzel') ? '1.5px' : '0.5px'
                      }}>
                        {title}
                      </h2>
                      <div className="card-separator" style={{ background: template.accentColor || '#C99726' }} />
                    </div>

                    <div className="card-message-area parchment-message-center">
                      <div className="card-destinataire" style={{ color: '#2B1A04' }}>{recipient},</div>
                      <p
                        className="card-text-body"
                        style={{
                          color: '#2D2012',
                          fontSize: message.length > 270 ? '12.5px' : message.length > 180 ? '14px' : '15.5px',
                          lineHeight: message.length > 270 ? 1.4 : message.length > 180 ? 1.46 : 1.55
                        }}
                      >
                        {message}
                      </p>
                    </div>

                    <div className="card-signature-box parchment-signature-center" style={{ borderTopColor: '#DECBB0' }}>
                      <div className="card-signature-label">Ak tout afeksyon mwen,</div>
                      <div className="card-signature-name" style={{ color: template.envelopeColor }}>{sender}</div>
                    </div>
                  </div>

                  {/* Ruban ak sele an lò wayal ki fèmen l anvan ouvèti */}
                  {!isOpened && (
                    <div ref={parchmentRibbonRef} className="parchment-closed-band">
                      <div className="parchment-ribbon-gold" />
                      <div ref={sealContainerRef} className="tactile-wax-seal-unit parchment-seal-pos" title="Kase sele wayal la">
                        <div ref={sealLeftRef} className="tactile-seal-half seal-half seal-left">
                          <svg viewBox="0 0 64 64" className="tactile-seal-svg">
                            <defs>
                              <radialGradient id="parchmentGoldWax" cx="38%" cy="32%" r="65%">
                                <stop offset="0%" stopColor="#F5D77F" />
                                <stop offset="45%" stopColor="#C99726" />
                                <stop offset="85%" stopColor="#8A5E12" />
                                <stop offset="100%" stopColor="#543603" />
                              </radialGradient>
                            </defs>
                            <path
                              d="M32 4 C46 3.5, 57 12, 59 26 C60.5 37, 54 50, 42 58 C32 62, 19 60, 10 52 C2 44, 3 30, 6 18 C9 9, 21 4.5, 32 4 Z"
                              fill="url(#parchmentGoldWax)"
                              stroke="#543603"
                              strokeWidth="1.2"
                            />
                            <circle cx="32" cy="32" r="21.5" fill="none" stroke="#FFEAA0" strokeWidth="2.2" opacity="0.75" />
                            <circle cx="32" cy="32" r="18" fill="#80560F" />
                            <g filter="url(#sealDeboss)" fill="#FFF5D6" stroke="#FFF5D6" strokeWidth="0.5">
                              <text x="32" y="37" textAnchor="middle" fontFamily="'Montserrat', serif" fontSize="13" fontWeight="bold" letterSpacing="1">
                                1804
                              </text>
                              <path d="M22 23 L32 20 L42 23 L37 25 L32 22 L27 25 Z" opacity="0.85" />
                            </g>
                          </svg>
                        </div>
                        <div ref={sealRightRef} className="tactile-seal-half seal-half seal-right">
                          <svg viewBox="0 0 64 64" className="tactile-seal-svg">
                            <path
                              d="M32 4 C46 3.5, 57 12, 59 26 C60.5 37, 54 50, 42 58 C32 62, 19 60, 10 52 C2 44, 3 30, 6 18 C9 9, 21 4.5, 32 4 Z"
                              fill="url(#parchmentGoldWax)"
                              stroke="#543603"
                              strokeWidth="1.2"
                            />
                            <circle cx="32" cy="32" r="21.5" fill="none" stroke="#FFEAA0" strokeWidth="2.2" opacity="0.75" />
                            <circle cx="32" cy="32" r="18" fill="#80560F" />
                            <g filter="url(#sealDeboss)" fill="#FFF5D6" stroke="#FFF5D6" strokeWidth="0.5">
                              <text x="32" y="37" textAnchor="middle" fontFamily="'Montserrat', serif" fontSize="13" fontWeight="bold" letterSpacing="1">
                                1804
                              </text>
                              <path d="M22 23 L32 20 L42 23 L37 25 L32 22 L27 25 Z" opacity="0.85" />
                            </g>
                          </svg>
                        </div>
                        <div ref={sealCrackLineRef} className="tactile-seal-crack-line seal-crack-line" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Rouleau du bas en bois doré oswa ba maniskri */}
                {template.id !== 'tradition-soup-joumou' ? (
                  <div
                    className="parchment-roller parchment-roller-bottom"
                    style={{
                      background: template.id === 'parchemin-nouvel-an'
                        ? 'linear-gradient(180deg, #1C1917 0%, #2A2420 50%, #100D0B 100%)'
                        : template.rodColor || '#855A25',
                      borderColor: template.id === 'parchemin-nouvel-an' ? '#D4AF37' : '#C99726'
                    }}
                  >
                    <div className="roller-knob-left" />
                    <div className="roller-knob-right" />
                  </div>
                ) : (
                  <div className="manuscript-antique-bottom-bar" />
                )}
              </div>
            )}

            {/* ========================================================
                FORMAT 3 : BIFOLD LIV PAPETRI (FOLIO 3D DOUB PAJ OUVERTI)
                ======================================================== */}
            {format === 'bifold' && (
              <div className="bifold-book-stage">
                {/* 1. Kouvèti Fèmen (Livre de luxe fermé palpable & tactile) */}
                <div
                  ref={bifoldCoverRef}
                  className="bifold-closed-cover"
                  style={{
                    background: `linear-gradient(135deg, ${template.coverColor || '#1E3326'} 0%, #101E16 100%)`,
                    borderColor: template.accentColor || '#D4AF37'
                  }}
                  onClick={openCard}
                  title="Klike pou w ouvri liv papetri a"
                >
                  {/* Tranche de papier doré du livre physique (épaisseur visible) */}
                  <div className="bifold-pages-thickness" />
                  <div className="bifold-pages-thickness-bottom" />

                  {/* Dos & Mors de charnière de reliure d'art */}
                  <div className="bifold-spine-edge-left" />
                  <div className="bifold-hinge-groove" />

                  {/* Texture de cuir / buckram tactile */}
                  <div className="bifold-cover-texture" />

                  {/* Ruban de soie traversant */}
                  <div className="bifold-silk-ribbon" />

                  <div className="bifold-cover-inner-border" style={{ borderColor: template.accentColor || '#D4AF37' }}>
                    <div className="bifold-corner bifold-corner-tl" />
                    <div className="bifold-corner bifold-corner-tr" />
                    <div className="bifold-corner bifold-corner-bl" />
                    <div className="bifold-corner bifold-corner-br" />

                    <div className="bifold-cover-top">
                      <div className="bifold-cover-star">✦</div>
                    </div>

                    <div className="bifold-cover-center">
                      <h3 className="bifold-cover-main-title">{template.title}</h3>
                      <p className="bifold-cover-subtitle">{title}</p>

                      <div className="bifold-seal-wrap">
                        {/* Sceau de cire atizanal de luxe avèk monogramme KD */}
                        <div className="tactile-wax-seal-unit bifold-tactile-seal">
                          <svg viewBox="0 0 64 64" className="tactile-seal-svg">
                            <defs>
                              <radialGradient id="bifoldWaxGrad" cx="38%" cy="32%" r="65%">
                                <stop offset="0%" stopColor="#F5D77F" />
                                <stop offset="45%" stopColor="#C99726" />
                                <stop offset="85%" stopColor="#8A5E12" />
                                <stop offset="100%" stopColor="#543603" />
                              </radialGradient>
                            </defs>
                            <path
                              d="M32 4 C46 3.5, 57 12, 59 26 C60.5 37, 54 50, 42 58 C32 62, 19 60, 10 52 C2 44, 3 30, 6 18 C9 9, 21 4.5, 32 4 Z"
                              fill="url(#bifoldWaxGrad)"
                              stroke="#543603"
                              strokeWidth="1.2"
                            />
                            <circle cx="32" cy="32" r="21.5" fill="none" stroke="#FFEAA0" strokeWidth="2.2" opacity="0.75" />
                            <circle cx="32" cy="32" r="18" fill="#80560F" />
                            <g filter="url(#sealDeboss)" fill="#FFF5D6" stroke="#FFF5D6" strokeWidth="0.5">
                              <text x="32" y="37" textAnchor="middle" fontFamily="'Montserrat', serif" fontSize="14" fontWeight="bold" letterSpacing="1">
                                KD
                              </text>
                              <path d="M22 23 L32 20 L42 23 L37 25 L32 22 L27 25 Z" opacity="0.85" />
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bifold-cover-bottom" />
                  </div>
                </div>

                {/* 2. Liv Papetri Ouvri (Doub Paj : Volet Gauche + Pli Central + Volet Droit) */}
                <div
                  ref={bifoldBookRef}
                  className="bifold-opened-spread"
                  style={{ display: 'none', opacity: 0, pointerEvents: 'none' }}
                >
                  {/* Volet Gauche : Page de garde d'art & vœux */}
                  <div
                    className="bifold-left-page"
                    style={{
                      background: `linear-gradient(135deg, ${template.coverColor || '#1A2E22'} 0%, #0F1D15 100%)`
                    }}
                  >
                    <div className="bifold-page-inner-border" style={{ borderColor: 'rgba(212, 175, 55, 0.45)' }}>
                      <div className="bifold-art-top" />

                      <div className="bifold-tree-illustration">
                        {template.coverArtType === 'champagne_celebration' ? (
                          <svg viewBox="0 0 80 80" width="56" height="56" fill="none">
                            <circle cx="40" cy="18" r="3" fill="#FFEAA0" />
                            <circle cx="32" cy="24" r="2" fill="#FFF" />
                            <circle cx="48" cy="22" r="2" fill="#FFF" />
                            <path d="M26 22 L36 34 L33 36 L23 24 Z" fill="#FFDF88" opacity="0.95" />
                            <line x1="34" y1="35" x2="42" y2="48" stroke="#D4AF37" strokeWidth="2.5" />
                            <path d="M54 22 L44 34 L47 36 L57 24 Z" fill="#FFDF88" opacity="0.95" />
                            <line x1="46" y1="35" x2="38" y2="48" stroke="#D4AF37" strokeWidth="2.5" />
                            <polygon points="40,12 43,20 51,21 45,26 47,34 40,29 33,34 35,26 29,21 37,20" fill="#FFF4BD" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 80 80" width="56" height="56" fill="none">
                            <polygon points="40,12 48,26 43,26 52,38 46,38 56,52 24,52 34,38 28,38 37,26 32,26" fill="#D4AF37" opacity="0.9" />
                            <rect x="37" y="52" width="6" height="8" fill="#9B7320" />
                            <polygon points="40,6 42,10 46,10 43,13 44,17 40,14 36,17 37,13 34,10 38,10" fill="#FFF4BD" />
                            <circle cx="34" cy="32" r="1.5" fill="#FFF" />
                            <circle cx="44" cy="30" r="1.5" fill="#FFF" />
                            <circle cx="38" cy="42" r="1.5" fill="#FFF" />
                            <circle cx="48" cy="46" r="1.5" fill="#FFF" />
                          </svg>
                        )}
                      </div>

                      <div className="bifold-art-text">
                        <h4 style={{ fontSize: '15px', color: '#FFF8E7', fontWeight: 700, margin: '4px 0' }}>
                          Bèl Swè ak Tout Kè Mwen
                        </h4>
                        <p style={{ fontSize: '12.5px', color: '#E2D7C3', lineHeight: '1.45', margin: '6px 0' }}>
                          « Se pou lajwa, lasante ak tout benediksyon klere chak jou nan lavi w nan nouvo ane a. »
                        </p>
                      </div>

                      <div className="bifold-art-bottom">
                        <span className="bifold-art-badge">KAT DIJITAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Pliure Centrale 3D */}
                  <div className="bifold-spine-crease" />

                  {/* Volet Droit : Message de correspondance personnalisé */}
                  <div ref={cardRef} className="bifold-right-page real-card">
                    <div className="real-card-border" style={{ borderColor: template.accentColor || '#D4AF37' }} />

                    <div style={{ marginTop: 2, marginBottom: 4 }}>
                      <h2 className="card-main-title" style={{
                        color: template.envelopeColor,
                        fontSize: '19px',
                        fontFamily: template.titleFont || "'Montserrat', sans-serif",
                        fontStyle: template.fontStyle || 'normal',
                        letterSpacing: template.titleFont?.includes('Cinzel') ? '1.5px' : '0.5px'
                      }}>
                        {title}
                      </h2>
                      <div className="card-separator" style={{ background: template.accentColor || '#D4AF37', margin: '4px auto 6px' }} />
                    </div>

                    <div className="card-message-area">
                      <div className="card-destinataire">{recipient},</div>
                      <p
                        className="card-text-body"
                        style={{
                          fontSize: message.length > 220 ? '13px' : message.length > 150 ? '14px' : '15.5px',
                          lineHeight: message.length > 220 ? 1.38 : message.length > 150 ? 1.45 : 1.55
                        }}
                      >
                        {message}
                      </p>
                    </div>

                    <div className="card-signature-box">
                      <div className="card-signature-label">Ak tout afeksyon mwen,</div>
                      <div className="card-signature-name">{sender}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                FORMAT 4 : LÈT PAPYE KRAFT & DANTÈL (REYALIS AK DETAILL)
                ======================================================== */}
            {format === 'kraft_sheet' && (
              <div className="kraft-letter-stage" onClick={openCard}>
                
                {/* 1. RABAT ANWO A (Top Flap avec Timbres & Ruban Satin) */}
                <div
                  ref={kraftTopFlapRef}
                  className="kraft-fold-flap kraft-flap-top"
                  style={{ background: template.kraftColor || '#E8D5B7' }}
                >
                  {template.coverArtType === 'lace_rose' && (
                    <div className="kraft-flap-lace-border-top" />
                  )}
                  {template.coverArtType === 'airmail_love' && (
                    <div className="kraft-flap-airmail-border-top" />
                  )}

                  {/* Étiquette postale romantique en haut à gauche */}
                  <div className="kraft-closed-airmail-pill">
                    <span>💌 {template.coverArtType === 'lace_rose' ? 'LÈT D\'AMOU & DOUSÈ' : 'PAR AVION • POSTE AÉRIENNE'}</span>
                  </div>

                  {/* Timbre postal authentique avec dentelure et tampon d'oblitération */}
                  <div className="kraft-closed-stamp-corner">
                    <PreviewAirmailStampIcon />
                    <div className="kraft-closed-postmark-waves">
                      <span>POSTE AÉRIENNE • HAÏTI</span>
                      <small>PORT-AU-PRINCE • 2027</small>
                    </div>
                  </div>

                  {/* Moitié supérieure du ruban de soie satiné */}
                  <div
                    className="kraft-satin-band-half satin-band-top"
                    style={{
                      background: template.id === 'lanmou-velours-rose'
                        ? 'linear-gradient(180deg, #7A1C3E 0%, #A3284B 60%, #64152F 100%)'
                        : 'linear-gradient(180deg, #5C222F 0%, #852E46 60%, #451520 100%)'
                    }}
                  >
                    <div className="satin-band-gold-thread thread-top" />
                  </div>

                  <div className="kraft-flap-crease-shadow" />
                </div>

                {/* 2. RABAT ANBA A (Bottom Flap avec Dédicace & Cachet Rond) */}
                <div
                  ref={kraftBottomFlapRef}
                  className="kraft-fold-flap kraft-flap-bottom"
                  style={{ background: template.kraftColor || '#E8D5B7' }}
                >
                  {/* Moitié inférieure du ruban de soie satiné */}
                  <div
                    className="kraft-satin-band-half satin-band-bottom"
                    style={{
                      background: template.id === 'lanmou-velours-rose'
                        ? 'linear-gradient(180deg, #64152F 0%, #A3284B 40%, #7A1C3E 100%)'
                        : 'linear-gradient(180deg, #451520 0%, #852E46 40%, #5C222F 100%)'
                    }}
                  >
                    <div className="satin-band-gold-thread thread-bottom" />
                  </div>

                  {template.coverArtType === 'lace_rose' && (
                    <div className="kraft-flap-lace-border-bottom" />
                  )}
                  {template.coverArtType === 'airmail_love' && (
                    <div className="kraft-flap-airmail-border-bottom" />
                  )}

                  {/* Dédicace manuscrite personnalisée et soignée */}
                  <div className="kraft-closed-dedication">
                    <div className="dedication-to-label">Pou : <span className="dedication-recipient">{recipient}</span></div>
                    <div className="dedication-quote">« Yon bèl lèt amoure ki fèt pou ou sèlman »</div>
                  </div>

                  {/* Tampon postal rond vintage en bas à gauche */}
                  <div className="kraft-closed-circular-stamp">
                    <div className="circular-stamp-inner">
                      <span>★ HAÏTI 1804 ★</span>
                      <strong>2027</strong>
                      <small>FLÈ LANMOU</small>
                    </div>
                  </div>

                  {/* Petits cœurs délicats en bas à droite */}
                  <div style={{ position: 'absolute', bottom: 12, right: 14, zIndex: 4, opacity: 0.85 }}>
                    <PreviewDoubleHeartsIcon />
                  </div>
                </div>

                {/* Kat papye kraft santre (Ouvri ak tout bèl detay yo) */}
                <div ref={cardRef} className="real-card card-kraft-texture" style={{ opacity: 0 }}>
                  {template.coverArtType === 'lace_rose' && (
                    <>
                      <div className="modal-lace-border" />
                      <div style={{ position: 'absolute', top: 14, right: 16, zIndex: 4 }}>
                        <PreviewDoubleHeartsIcon />
                      </div>
                      <div className="modal-kraft-top-flap" />
                    </>
                  )}

                  {template.coverArtType === 'airmail_love' && (
                    <>
                      <div className="modal-airmail-border" />
                      <div style={{ position: 'absolute', top: 14, right: 16, zIndex: 4 }}>
                        <PreviewAirmailStampIcon />
                      </div>
                      <div className="modal-airmail-postmark">
                        <span>PAR AVION • POSTE AÉRIENNE</span>
                      </div>
                    </>
                  )}

                  <div style={{ marginTop: 8, marginBottom: 4, textAlign: 'center', width: '100%', position: 'relative', zIndex: 2 }}>
                    <h2 className="card-main-title" style={{
                      color: template.id === 'lanmou-velours-rose' ? '#7A1C3E' : '#6B3045',
                      fontFamily: template.titleFont || "'Playfair Display', serif",
                      fontStyle: template.fontStyle || 'normal',
                      fontSize: '22px',
                      fontWeight: 700,
                      lineHeight: '1.35',
                      margin: '0 auto',
                      padding: '0 8px',
                      letterSpacing: '0.3px',
                      textShadow: 'none'
                    }}>
                      {title}
                    </h2>
                    <div className="card-separator" style={{ background: template.accentColor || '#B33951', margin: '6px auto 8px' }} />
                  </div>

                  <div className="card-message-area" style={{ position: 'relative', zIndex: 2 }}>
                    <div className="card-destinataire" style={{ color: '#4A1D2B' }}>{recipient},</div>
                    <p
                      className="card-text-body"
                      style={{
                        color: '#3A1E27',
                        fontSize: message.length > 220 ? '13px' : message.length > 150 ? '14px' : '15.5px',
                        lineHeight: message.length > 220 ? 1.38 : message.length > 150 ? 1.45 : 1.55
                      }}
                    >
                      {message}
                    </p>
                  </div>

                  <div className="card-signature-box" style={{ borderTopColor: '#DEC5B6', position: 'relative', zIndex: 2 }}>
                    <div className="card-signature-label">Ak tout afeksyon mwen,</div>
                    <div className="card-signature-name" style={{ color: '#6B3045' }}>{sender}</div>
                  </div>
                </div>

                {!isOpened && (
                  <div className="kraft-seal-center">
                    <div ref={sealContainerRef} className="tactile-wax-seal-unit kraft-seal-pos" title="Kase sele lanmou an">
                      <div ref={sealLeftRef} className="tactile-seal-half seal-half seal-left">
                        <svg viewBox="0 0 64 64" className="tactile-seal-svg">
                          <defs>
                            <radialGradient id="kraftWaxGrad" cx="38%" cy="32%" r="65%">
                              <stop offset="0%" stopColor="#C9425F" />
                              <stop offset="50%" stopColor="#8C243B" />
                              <stop offset="100%" stopColor="#4A0F1D" />
                            </radialGradient>
                          </defs>
                          <path
                            d="M32 4 C46 3.5, 57 12, 59 26 C60.5 37, 54 50, 42 58 C32 62, 19 60, 10 52 C2 44, 3 30, 6 18 C9 9, 21 4.5, 32 4 Z"
                            fill="url(#kraftWaxGrad)"
                            stroke="#380913"
                            strokeWidth="1.2"
                          />
                          <circle cx="32" cy="32" r="21.5" fill="none" stroke="#FFA3B5" strokeWidth="2" opacity="0.65" />
                          <circle cx="32" cy="32" r="18" fill="#751C30" />
                          <g filter="url(#sealDeboss)" fill="#FFF0F3" stroke="#FFF0F3" strokeWidth="0.5">
                            <path d="M32 23 C32 23, 27 18, 22 21 C17 25, 20 31, 32 39 C44 31, 47 25, 42 21 C37 18, 32 23, 32 23 Z" />
                          </g>
                        </svg>
                      </div>
                      <div ref={sealRightRef} className="tactile-seal-half seal-half seal-right">
                        <svg viewBox="0 0 64 64" className="tactile-seal-svg">
                          <path
                            d="M32 4 C46 3.5, 57 12, 59 26 C60.5 37, 54 50, 42 58 C32 62, 19 60, 10 52 C2 44, 3 30, 6 18 C9 9, 21 4.5, 32 4 Z"
                            fill="url(#kraftWaxGrad)"
                            stroke="#380913"
                            strokeWidth="1.2"
                          />
                          <circle cx="32" cy="32" r="21.5" fill="none" stroke="#FFA3B5" strokeWidth="2" opacity="0.65" />
                          <circle cx="32" cy="32" r="18" fill="#751C30" />
                          <g filter="url(#sealDeboss)" fill="#FFF0F3" stroke="#FFF0F3" strokeWidth="0.5">
                            <path d="M32 23 C32 23, 27 18, 22 21 C17 25, 20 31, 32 39 C44 31, 47 25, 42 21 C37 18, 32 23, 32 23 Z" />
                          </g>
                        </svg>
                      </div>
                      <div ref={sealCrackLineRef} className="tactile-seal-crack-line seal-crack-line" />
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Panèl aksyon : Style Image 4 (Symmetrical, centered, compact & clean) */}
          <div ref={actionsRef} className="card-actions-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 320, margin: '20px auto 6px auto', textAlign: 'center' }}>
            {isPaid ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleShareWhatsAppWithKitDownload}
                  className="btn-stationery-whatsapp"
                  style={{ width: '100%', maxWidth: '320px', margin: '0 auto' }}
                >
                  <WhatsAppOfficialLogo />
                  <span>PATAJE SOU WHATSAPP</span>
                </button>

                {isDirectView ? (
                  <button
                    className="btn-stationery-secondary"
                    style={{ ...secondaryBtnStyle, width: '100%', maxWidth: '320px', margin: '0 auto' }}
                    onClick={() => {
                      stopHolidaySoundtrack(true);
                      onOpenCustomizer(template);
                    }}
                  >
                    Kreye pa w la tou
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%' }}>
                    <div className="stationery-btn-row" style={{ display: 'flex', gap: 8, width: '100%', maxWidth: '320px', margin: '0 auto', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-stationery-sub"
                        onClick={handleDownloadCompleteKit}
                        disabled={isDownloadingKit}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <DownloadSimple size={14} weight="bold" />
                        <span>{isDownloadingKit ? 'N ap prepare...' : 'Telechaje Kit'}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-stationery-sub"
                        onClick={() => setShowSuccessModal(true)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <Envelope size={14} weight="regular" />
                        <span>Resevwa pa Imèl</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-create-new-card-link"
                      style={{ textAlign: 'center', margin: '4px auto 0', width: '100%' }}
                      onClick={() => {
                        stopHolidaySoundtrack(true);
                        onOpenCustomizer(template);
                      }}
                    >
                      Kreye yon lòt kat pou yon lòt moun
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="stationery-main-btns-row" style={{ display: 'flex', gap: 8, width: '100%', maxWidth: '340px', margin: '0 auto', justifyContent: 'center' }}>
                <button
                  className="btn-stationery-primary"
                  style={{ ...primaryBtnStyle, flex: 1, whiteSpace: 'nowrap' }}
                  onClick={() => {
                    stopHolidaySoundtrack(true);
                    onOpenCustomizer(template);
                  }}
                >
                  Pèsonalize kat la
                </button>

                <button
                  className="btn-stationery-secondary"
                  style={{ ...secondaryBtnStyle, flex: 1, whiteSpace: 'nowrap' }}
                  onClick={handleOpenCheckout}
                >
                  Debloke modèl sa a
                </button>
              </div>
            )}

            <button
              type="button"
              className="btn-stationery-link"
              onClick={replayAnimation}
              style={{ margin: '6px auto 0', textAlign: 'center' }}
            >
              <ArrowCounterClockwise size={13} weight="regular" style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              <span>Gade ouvèti a ankò</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================
          MODAL DE PAIEMENT EXPRESS (MONCASH / STRIPE)
          ========================================================== */}
      {showCheckoutModal && (
        <div className="checkout-overlay" onClick={handleCloseCheckout}>
          <div className="checkout-card" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-header-row">
              <div>
                <span className="checkout-badge">
                  <ShieldCheck size={14} weight="regular" />
                  <span>Peman an Sekirite</span>
                </span>
                <h3 className="checkout-title">
                  Debloke Kat pou {recipient}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseCheckout}
                className="customizer-close-btn"
                aria-label="Fèmen"
              >
                <X size={17} weight="bold" />
              </button>
            </div>

            <p className="checkout-desc">
              Chwazi mòd peman ou prefere a pou w ka voye lyen an sou WhatsApp ak telechaje foto kat la.
            </p>

            <form onSubmit={handleProcessPayment}>
              <div className="payment-cards-grid">
                <div
                  className={`payment-choice-card ${paymentMethod === 'moncash' ? 'active-moncash' : ''}`}
                  onClick={() => setPaymentMethod('moncash')}
                >
                  <div className="payment-choice-text">
                    <strong className="payment-name-moncash">MonCash</strong>
                    <span className="payment-sub-text">Ayiti • 100 HTG</span>
                  </div>
                  <div className="payment-icon-box moncash-box">
                    <DeviceMobile size={18} weight="regular" color="#C41230" />
                  </div>
                </div>

                <div
                  className={`payment-choice-card ${paymentMethod === 'card' ? 'active-card' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="payment-choice-text">
                    <strong className="payment-name-stripe">Kat / Stripe</strong>
                    <span className="payment-sub-text">Diaspora • $2.99 USD</span>
                  </div>
                  <div className="payment-icon-box card-box">
                    <CreditCard size={18} weight="regular" color="#2B4736" />
                  </div>
                </div>
              </div>

              {paymentMethod === 'moncash' && (
                <div className="payment-gateway-info-banner is-moncash-banner" style={{ margin: '14px 0', padding: '12px 14px', background: '#FDF2F4', border: '1px solid #F5C6CB', borderRadius: '8px', color: '#721C24', fontSize: '13px', lineHeight: 1.45 }}>
                  <strong>Peman Otantik MonCash :</strong> Lè w klike sou bouton an, w ap dirije dirèkteman sou paj sekirize ofisyèl MonCash Digicel la pou valide peman 100 Goud la.
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="payment-gateway-info-banner is-stripe-banner" style={{ margin: '14px 0', padding: '12px 14px', background: '#F0F7F4', border: '1px solid #C3E6CB', borderRadius: '8px', color: '#155724', fontSize: '13px', lineHeight: 1.45 }}>
                  <strong>Peman Sekirize Stripe :</strong> Lè w klike sou bouton an, w ap dirije dirèkteman sou paj sekirize ofisyèl Stripe la pou peye $2.99 USD ak kat kredi w.
                </div>
              )}

              {!paymentMethod && (
                <div style={{ margin: '18px 0', textAlign: 'center', color: '#736B5E', fontSize: '13px' }}>
                  <span>Klike sou <strong>MonCash</strong> oswa <strong>Kat / Stripe</strong> anwo a pou w chwazi.</span>
                </div>
              )}

              {paymentMethod === 'moncash' && (
                <button
                  type="submit"
                  className="btn-checkout-confirm is-moncash"
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <span>N ap ouvri MonCash...</span>
                  ) : (
                    <>
                      <Lock size={15} weight="regular" />
                      <span>Peye 100 Goud sou MonCash</span>
                    </>
                  )}
                </button>
              )}

              {paymentMethod === 'card' && (
                <button
                  type="submit"
                  className="btn-checkout-confirm is-stripe"
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <span>N ap ouvri Stripe...</span>
                  ) : (
                    <>
                      <Lock size={15} weight="regular" />
                      <span>Peye $2.99 USD sou Stripe</span>
                    </>
                  )}
                </button>
              )}


            </form>
          </div>
        </div>
      )}

      {/* MODAL DE SUCCÈS APRÈS PAIEMENT (KIT KADO DIJITAL VIP 4-AN-1) */}
      {showSuccessModal && (
        <div className="checkout-overlay">
          <div className="checkout-card checkout-success-card" style={{ textAlign: 'center', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' }}>
            <KatDijitalSuccessEmblem size={72} />

            <h3 style={{ fontSize: 21, fontWeight: 700, color: '#2B4736', marginBottom: 4 }}>
              Kat ou a Debloke ak Siksè !
            </h3>

            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.45, marginBottom: 14 }}>
              Kat dijital espesyal pou <strong>{recipient}</strong> pare e li sele ofisyèlman.
            </p>

            {/* 1. BOUTON VOYE SOU WHATSAPP (DOUBLE ACTION : OUVRI WHATSAPP + TELECHAJE KIT LA SOU TELEFÒN) */}
            <button
              type="button"
              onClick={handleShareWhatsAppWithKitDownload}
              className="btn-stationery-whatsapp"
              style={{ width: '100%', maxWidth: 'none', marginBottom: 14 }}
            >
              <WhatsAppOfficialLogo />
              <span>Voye bay {recipient} sou WhatsApp</span>
            </button>

            {/* 2. REKAPITILATIF TOUT ELEMAN NAN KIT KADO VIP LA */}
            <div className="kit-content-box">
              <div className="kit-box-header">
                <ShieldCheck size={15} weight="bold" color="#8A6518" />
                <span>KIT KADO DIJITAL VIP (TOUT-AN-UN)</span>
              </div>
              <ul className="kit-box-list">
                <li>
                  <span className="kit-list-icon">
                    <Link size={14} weight="bold" color="#2B4736" />
                  </span>
                  <div className="kit-list-info">
                    <strong>Lyen Entèraktif 3D</strong>
                    <small>Ouvèti ak animasyon ak mizik sou nenpòt aparèy</small>
                  </div>
                </li>
                <li>
                  <span className="kit-list-icon">
                    <ImageSquare size={14} weight="bold" color="#2B4736" />
                  </span>
                  <div className="kit-list-info">
                    <strong>Imaj Segondè Rezolisyon (PNG HD)</strong>
                    <small>Fòma afich dore pou enprime oswa kenbe an souvni</small>
                  </div>
                </li>
                <li>
                  <span className="kit-list-icon">
                    <QrCode size={14} weight="bold" color="#2B4736" />
                  </span>
                  <div className="kit-list-info">
                    <strong>QR Code Kado Spesyal (PNG)</strong>
                    <small>Pou kole sou kado fizik pou eskane l fasil</small>
                  </div>
                </li>
                <li>
                  <span className="kit-list-icon">
                    <VideoCamera size={14} weight="bold" color="#2B4736" />
                  </span>
                  <div className="kit-list-info">
                    <strong>Videyo Kout ak Mizik (HD)</strong>
                    <small>Animasyon pare pou pataje sou estati WhatsApp</small>
                  </div>
                </li>

              </ul>
            </div>

            {/* 3. OPSYON TELECHAJE TOUT KIT LA SOU APARÈY LA */}
            <div style={{ marginTop: 14 }}>
              <button
                type="button"
                className="btn-download-complete-kit"
                onClick={handleDownloadCompleteKit}
                disabled={isDownloadingKit}
              >
                <DownloadSimple size={18} weight="bold" />
                <span>{isDownloadingKit ? (downloadStepText || 'N ap prepare kit la...') : 'Telechaje Tout Kit la'}</span>
              </button>
              {kitDownloaded && (
                <div className="kit-downloaded-toast">
                  ✓ Kit la telechaje ! Ouvri fichye ZIP la pou jwenn tout sa w bezwen.
                </div>
              )}
            </div>

            {/* 4. OPSYON RESEVWA TOUT KIT LA PA IMÈL */}
            <div className="kit-email-section">
              <p className="kit-email-label">
                <Envelope size={14} weight="regular" />
                <span>Oswa resevwa tout kit la dirèkteman nan bwat imèl ou :</span>
              </p>
              {emailSuccessMessage ? (
                <div className="kit-email-success">
                  ✓ Nou voye tout kit la nan <strong>{kitEmail}</strong> ! Tcheke bwat imèl ou.
                </div>
              ) : (
                <form onSubmit={handleSendKitEmail} className="kit-email-form">
                  <input
                    type="email"
                    required
                    placeholder="Antre adrès imèl ou la..."
                    value={kitEmail}
                    onChange={(e) => setKitEmail(e.target.value)}
                    className="kit-email-input"
                  />
                  <button
                    type="submit"
                    disabled={isSendingEmail || !kitEmail}
                    className="btn-send-kit-email"
                  >
                    {isSendingEmail ? 'N ap voye...' : 'Resevwa'}
                  </button>
                </form>
              )}
            </div>

            {/* 5. BOUTON RETOUNEN GADE KAT LA */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #ECE6DA', textAlign: 'center' }}>
              <button
                type="button"
                className="btn-return-card-light"
                onClick={handleCloseSuccess}
              >
                Retounen nan kat la
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
