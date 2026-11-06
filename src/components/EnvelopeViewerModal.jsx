import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  X,
  Lock,
  Download,
  Smartphone,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX
} from 'lucide-react';
import AmbientEffects from './AmbientEffects';
import {
  preloadHolidaySoundtrack,
  playHolidaySoundtrack,
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
  const [paymentMethod, setPaymentMethod] = useState('moncash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

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
        stopHolidaySoundtrack();
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
      stopHolidaySoundtrack();
    };
  }, [onClose]);


  const recipient = customData?.recipient || 'Vanessa';
  const sender = customData?.sender || 'David Jean';
  const message = customData?.message || template.defaultMessage;
  const title = customData?.heading || template.heading;
  const musicId = customData?.musicId || template.defaultMusic || 'jingle_bells';
  const customAudioUrl = customData?.customAudioUrl || null;

  // Prechaje mizik la davans pou pa gen okenn reta lè itilizatè klike pou ouvri kat la
  useEffect(() => {
    preloadHolidaySoundtrack(musicId, customAudioUrl);
  }, [musicId, customAudioUrl]);

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://katdigital.ht';
  const uniqueCardLink = `${currentHost}/?to=${encodeURIComponent(recipient)}&from=${encodeURIComponent(sender)}&theme=${template.id}&msg=${encodeURIComponent(message)}&h=${encodeURIComponent(title)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Ou resevwa yon bèl kat espesyal de ${sender} !\nKlike la a pou w ouvri kat ou a :\n${uniqueCardLink}`
  )}`;

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

  const playWaxBreakAndChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(ctx.currentTime);
    } catch (e) {}
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
    stopHolidaySoundtrack();
    onClose();
  };

  const openCard = () => {
    if (isOpened) return;
    setIsOpened(true);

    playCardOpenSound(template, format);

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
      const targetParchmentHeight = isCompactScreen ? 335 : 380;
      tl.to(parchmentRibbonRef.current, { opacity: 0, scale: 0.9, duration: 0.25 }, 'crack')
        .fromTo(
          parchmentContainerRef.current,
          { height: 60 },
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
        { opacity: 0, scale: 0.94, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          pointerEvents: 'auto',
          duration: 0.5,
          ease: 'power2.out',
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
          { scale: 0.95, opacity: 0.2, y: 15, clearProps: 'left,x,xPercent' },
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

    // 5. Melodi fèt la kòmanse sèlman APRÈ lèt la fin parèt devan je moun nan
    tl.add(() => {
      if (!isMusicMuted && musicId !== 'none') {
        playHolidaySoundtrack(musicId, customAudioUrl);
      }
    }, '+=0.05');
  };

  const replayAnimation = () => {
    setIsOpened(false);
    stopHolidaySoundtrack();
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
      gsap.set(parchmentContainerRef.current, { height: 60 });
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
      gsap.set(cardRef.current, { opacity: 0, pointerEvents: 'none', clearProps: 'left,x,xPercent' });
    } else {
      if (envelopeRef.current) {
        envelopeRef.current.style.display = 'block';
        gsap.set(envelopeRef.current, { y: 0, opacity: 1, scale: 1 });
      }
      gsap.set(flapRef.current, { rotateX: 0, zIndex: 4 });
      gsap.set(cardRef.current, { y: 0, scale: 1, zIndex: 2, opacity: 0, left: '50%', xPercent: -50, pointerEvents: 'none' });
    }

    gsap.set(actionsRef.current, { opacity: 0, y: 20, pointerEvents: 'none' });
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaid(true);
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
      launchLuxuryConfetti();
    }, 1200);
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

  return (
    <div className="viewer-modal">
      {/* Animasyon Anbyans (Nèj, Kè k ap flote, Zétwal) */}
      <AmbientEffects type={template.ambientAnimation || 'snow'} />

      <button className="btn-close-modal" onClick={handleModalClose} aria-label="Fèmen">
        <X size={20} />
      </button>

      {/* Kontwòl Mizik Flotan */}
      {musicId !== 'none' && (
        <button
          type="button"
          className="btn-floating-music"
          onClick={toggleSoundtrack}
          title={isMusicMuted ? 'Limen Mizik' : 'Koupe Mizik'}
        >
          {isMusicMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>{isMusicMuted ? 'Mizik Eten' : 'Mizik Limen'}</span>
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
                  className="real-envelope"
                  style={{ background: template.envelopeColor }}
                  onClick={openCard}
                >
                  <div className="real-liner" />

                  <div className="envelope-front-pocket">
                    <div className="envelope-fold-left" style={{ borderLeftColor: template.pocketColors?.left || '#6E1A27' }} />
                    <div className="envelope-fold-right" style={{ borderRightColor: template.pocketColors?.right || '#631622' }} />
                    <div className="envelope-fold-bottom" style={{ borderBottomColor: template.pocketColors?.bottom || '#7A1F2D' }} />
                  </div>

                  <div ref={flapRef} className="real-envelope-flap" style={{ borderTopColor: template.flapColor || '#8B2535' }} />

                  <div ref={sealContainerRef} className="real-wax-seal" title="Kase sele an lò a">
                    <div ref={sealLeftRef} className="seal-half seal-left">
                      <svg viewBox="0 0 54 54" className="seal-svg">
                        <defs>
                          <radialGradient id="goldWaxGrad1" cx="35%" cy="30%" r="65%">
                            <stop offset="0%" stopColor="#FFF4D0" />
                            <stop offset="25%" stopColor="#F5D77F" />
                            <stop offset="60%" stopColor="#C99726" />
                            <stop offset="85%" stopColor="#966B12" />
                            <stop offset="100%" stopColor="#543603" />
                          </radialGradient>
                        </defs>
                        <circle cx="27" cy="27" r="25" fill="url(#goldWaxGrad1)" stroke="#7A5207" strokeWidth="1.2" />
                        <circle cx="27" cy="27" r="21" fill="none" stroke="#FFEAA0" strokeWidth="1" strokeDasharray="2,2" opacity="0.85" />
                        <path d="M17 33h20v2.5H17zm1.5-3.5l1.5-7.5 4.5 4.5 2.5-6.5 2.5 6.5 4.5-4.5 1.5 7.5h-17z" fill="#FFF3C4" stroke="#5C3B04" strokeWidth="0.8" />
                        <circle cx="27" cy="18" r="1.5" fill="#FFF" />
                        <circle cx="20" cy="21" r="1.2" fill="#FFF" />
                        <circle cx="34" cy="21" r="1.2" fill="#FFF" />
                      </svg>
                    </div>

                    <div ref={sealRightRef} className="seal-half seal-right">
                      <svg viewBox="0 0 54 54" className="seal-svg">
                        <circle cx="27" cy="27" r="25" fill="url(#goldWaxGrad1)" stroke="#7A5207" strokeWidth="1.2" />
                        <circle cx="27" cy="27" r="21" fill="none" stroke="#FFEAA0" strokeWidth="1" strokeDasharray="2,2" opacity="0.85" />
                        <path d="M17 33h20v2.5H17zm1.5-3.5l1.5-7.5 4.5 4.5 2.5-6.5 2.5 6.5 4.5-4.5 1.5 7.5h-17z" fill="#FFF3C4" stroke="#5C3B04" strokeWidth="0.8" />
                        <circle cx="27" cy="18" r="1.5" fill="#FFF" />
                        <circle cx="20" cy="21" r="1.2" fill="#FFF" />
                        <circle cx="34" cy="21" r="1.2" fill="#FFF" />
                      </svg>
                    </div>

                    <div ref={sealCrackLineRef} className="seal-crack-line" />
                  </div>
                </div>

                {/* Kat papye ki glise soti nan anvlòp la */}
                <div ref={cardRef} className="real-card">
                  <div className="real-card-border" style={{ borderColor: template.accentColor || '#D4AF37' }} />

                  <div style={{ marginTop: 6, marginBottom: 4 }}>
                    <h2 className="card-main-title" style={{ color: template.envelopeColor }}>
                      {title}
                    </h2>
                    <div className="card-separator" style={{ background: template.accentColor || '#D4AF37' }} />
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
                      <h2 className="card-main-title" style={{ color: template.envelopeColor }}>
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

                  {/* Ruban ak sele an lò ki fèmen l anvan ouvèti */}
                  {!isOpened && (
                    <div ref={parchmentRibbonRef} className="parchment-closed-band">
                      <div className="parchment-ribbon-gold" />
                      <div ref={sealContainerRef} className="real-wax-seal" style={{ position: 'relative', top: 0, left: 0, transform: 'none' }}>
                        <div ref={sealLeftRef} className="seal-half seal-left">
                          <svg viewBox="0 0 54 54" className="seal-svg">
                            <circle cx="27" cy="27" r="25" fill="#C99726" stroke="#7A5207" strokeWidth="1.2" />
                            <circle cx="27" cy="27" r="18" fill="none" stroke="#FFE79A" strokeWidth="1" strokeDasharray="3 2" />
                            <circle cx="27" cy="27" r="7" fill="#E8B83D" stroke="#9E6D14" strokeWidth="1" />
                          </svg>
                        </div>
                        <div ref={sealRightRef} className="seal-half seal-right">
                          <svg viewBox="0 0 54 54" className="seal-svg">
                            <circle cx="27" cy="27" r="25" fill="#C99726" stroke="#7A5207" strokeWidth="1.2" />
                            <circle cx="27" cy="27" r="18" fill="none" stroke="#FFE79A" strokeWidth="1" strokeDasharray="3 2" />
                            <circle cx="27" cy="27" r="7" fill="#E8B83D" stroke="#9E6D14" strokeWidth="1" />
                          </svg>
                        </div>
                        <div ref={sealCrackLineRef} className="seal-crack-line" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Rouleau du bas en bois doré */}
                <div className="parchment-roller parchment-roller-bottom" style={{ background: template.rodColor || '#855A25' }}>
                  <div className="roller-knob-left" />
                  <div className="roller-knob-right" />
                </div>
              </div>
            )}

            {/* ========================================================
                FORMAT 3 : BIFOLD LIV PAPETRI (FOLIO 3D DOUB PAJ OUVERTI)
                ======================================================== */}
            {format === 'bifold' && (
              <div className="bifold-book-stage">
                {/* 1. Kouvèti Fèmen (Vizib anvan klike) */}
                <div
                  ref={bifoldCoverRef}
                  className="bifold-closed-cover"
                  style={{
                    background: `linear-gradient(135deg, ${template.coverColor || '#1E3326'} 0%, #122118 100%)`,
                    borderColor: template.accentColor || '#D4AF37'
                  }}
                  onClick={openCard}
                  title="Klike pou w ouvri liv papetri a"
                >
                  <div className="bifold-spine-edge-left" />

                  <div className="bifold-cover-inner-border" style={{ borderColor: template.accentColor || '#D4AF37' }}>
                    <div className="bifold-corner bifold-corner-tl" />
                    <div className="bifold-corner bifold-corner-tr" />
                    <div className="bifold-corner bifold-corner-bl" />
                    <div className="bifold-corner bifold-corner-br" />

                    <div className="bifold-cover-top">
                      <div className="bifold-cover-star" />
                    </div>

                    <div className="bifold-cover-center">
                      <h3 className="bifold-cover-main-title">{template.title}</h3>
                      <p className="bifold-cover-subtitle">{title}</p>

                      <div className="bifold-seal-wrap">
                        <div className="bifold-gold-seal">
                          <svg viewBox="0 0 60 60" className="bifold-seal-svg">
                            <circle cx="30" cy="30" r="28" fill="#D4AF37" stroke="#8F711C" strokeWidth="1.5" />
                            <circle cx="30" cy="30" r="21" fill="none" stroke="#FFF5CC" strokeWidth="1" strokeDasharray="2,2" />
                            <circle cx="30" cy="30" r="8" fill="#E8C35A" stroke="#99731E" strokeWidth="1" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bifold-cover-bottom">
                      <span className="bifold-tap-hint">KLIKE SOU LIV LA POU W OUVERTI L</span>
                    </div>
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
                        <svg viewBox="0 0 80 80" width="56" height="56" fill="none">
                          <polygon points="40,12 48,26 43,26 52,38 46,38 56,52 24,52 34,38 28,38 37,26 32,26" fill="#D4AF37" opacity="0.9" />
                          <rect x="37" y="52" width="6" height="8" fill="#9B7320" />
                          <polygon points="40,6 42,10 46,10 43,13 44,17 40,14 36,17 37,13 34,10 38,10" fill="#FFF4BD" />
                          <circle cx="34" cy="32" r="1.5" fill="#FFF" />
                          <circle cx="44" cy="30" r="1.5" fill="#FFF" />
                          <circle cx="38" cy="42" r="1.5" fill="#FFF" />
                          <circle cx="48" cy="46" r="1.5" fill="#FFF" />
                        </svg>
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
                      <h2 className="card-main-title" style={{ color: template.envelopeColor, fontSize: '19px' }}>
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
                FORMAT 4 : LÈT PAPYE KRAFT & DANTÈL
                ======================================================== */}
            {format === 'kraft_sheet' && (
              <div className="kraft-letter-stage" onClick={openCard}>
                <div
                  ref={kraftTopFlapRef}
                  className="kraft-fold-flap kraft-flap-top"
                  style={{ background: template.kraftColor || '#E8D5B7' }}
                />
                <div
                  ref={kraftBottomFlapRef}
                  className="kraft-fold-flap kraft-flap-bottom"
                  style={{ background: template.kraftColor || '#E8D5B7' }}
                />

                {/* Kat papye kraft santre */}
                <div ref={cardRef} className="real-card card-kraft-texture" style={{ opacity: 0 }}>
                  <div className="real-card-border" style={{ borderColor: '#B33951' }} />

                  <div style={{ marginTop: 6, marginBottom: 4 }}>
                    <h2 className="card-main-title" style={{ color: '#6B3045' }}>
                      {title}
                    </h2>
                    <div className="card-separator" style={{ background: '#B33951' }} />
                  </div>

                  <div className="card-message-area">
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

                  <div className="card-signature-box" style={{ borderTopColor: '#DEC5B6' }}>
                    <div className="card-signature-label">Ak tout afeksyon mwen,</div>
                    <div className="card-signature-name" style={{ color: '#6B3045' }}>{sender}</div>
                  </div>
                </div>

                {!isOpened && (
                  <div className="kraft-seal-center">
                    <div ref={sealContainerRef} className="real-wax-seal" style={{ position: 'relative', top: 0, left: 0, transform: 'none' }}>
                      <div ref={sealLeftRef} className="seal-half seal-left">
                        <svg viewBox="0 0 54 54" className="seal-svg">
                          <circle cx="27" cy="27" r="25" fill="#B33951" stroke="#681525" strokeWidth="1.2" />
                          <path d="M27 18 C27 18, 22 13, 17 17 C12 21, 15 28, 27 36 C39 28, 42 21, 37 17 C32 13, 27 18, 27 18 Z" fill="#FFF0F3" />
                        </svg>
                      </div>
                      <div ref={sealRightRef} className="seal-half seal-right">
                        <svg viewBox="0 0 54 54" className="seal-svg">
                          <circle cx="27" cy="27" r="25" fill="#B33951" stroke="#681525" strokeWidth="1.2" />
                          <path d="M27 18 C27 18, 22 13, 17 17 C12 21, 15 28, 27 36 C39 28, 42 21, 37 17 C32 13, 27 18, 27 18 Z" fill="#FFF0F3" />
                        </svg>
                      </div>
                      <div ref={sealCrackLineRef} className="seal-crack-line" />
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Panèl aksyon : Style Image 4 (Rectangulaire, compact, épuré, sans icônes superflues) */}
          <div ref={actionsRef} className="card-actions-panel">
            {isPaid ? (
              <>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-stationery-whatsapp"
                >
                  <WhatsAppOfficialLogo />
                  <span>PATAJE SOU WHATSAPP</span>
                </a>

                {isDirectView ? (
                  <button
                    className="btn-stationery-secondary"
                    style={secondaryBtnStyle}
                    onClick={() => {
                      stopHolidaySoundtrack();
                      onOpenCustomizer(template);
                    }}
                  >
                    Kreye pa w la tou
                  </button>
                ) : (
                  <div className="stationery-btn-row">
                    <button
                      className="btn-stationery-sub"
                      onClick={handleDownloadCardImage}
                    >
                      Telechaje PNG
                    </button>
                    <button
                      className="btn-stationery-sub"
                      onClick={handleCopyLink}
                    >
                      {copiedLink ? 'Kopye !' : 'Kopye lyen'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="stationery-main-btns-row">
                <button
                  className="btn-stationery-primary"
                  style={primaryBtnStyle}
                  onClick={() => {
                    stopHolidaySoundtrack();
                    onOpenCustomizer(template);
                  }}
                >
                  Pèsonalize kat la
                </button>

                <button
                  className="btn-stationery-secondary"
                  style={secondaryBtnStyle}
                  onClick={() => setShowCheckoutModal(true)}
                >
                  Debloke modèl sa a
                </button>
              </div>
            )}

            <button
              type="button"
              className="btn-stationery-link"
              onClick={replayAnimation}
            >
              <RotateCcw size={12} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              <span>Gade ouvèti a ankò</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================
          MODAL DE PAIEMENT EXPRESS (MONCASH / STRIPE)
          ========================================================== */}
      {showCheckoutModal && (
        <div className="checkout-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="checkout-card" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-header-row">
              <div>
                <span className="checkout-badge">
                  <ShieldCheck size={12} />
                  <span>Peman an Sekirite</span>
                </span>
                <h3 className="checkout-title">
                  Debloke Kat pou {recipient}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="customizer-close-btn"
                aria-label="Fèmen"
              >
                <X size={17} />
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
                    <Smartphone size={17} color="#C41230" />
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
                    <CreditCard size={17} color="#2B4736" />
                  </div>
                </div>
              </div>

              {paymentMethod === 'moncash' ? (
                <div className="form-group-clean">
                  <label className="form-label-clean">
                    <Smartphone size={13} style={{ color: '#C41230' }} />
                    <span>Nimewo Telefòn MonCash :</span>
                  </label>
                  <div className="phone-input-wrap">
                    <span className="phone-prefix-badge">+509</span>
                    <input
                      type="tel"
                      placeholder="34 56 7890"
                      className="form-input-clean form-input-phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <span className="payment-helper-note">
                    W ap resevwa yon notifikasyon pou apwouve 100 Goud la sou kont MonCash ou.
                  </span>
                </div>
              ) : (
                <div className="form-group-clean">
                  <label className="form-label-clean">
                    <CreditCard size={13} style={{ color: '#2B4736' }} />
                    <span>Nimewo Kat Kredi (Visa / Mastercard) :</span>
                  </label>
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    className="form-input-clean"
                    required
                  />
                  <div className="form-row-2" style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input type="text" placeholder="MM / AA" className="form-input-clean" required />
                    <input type="text" placeholder="CVC" className="form-input-clean" required />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`btn-checkout-confirm ${paymentMethod === 'moncash' ? 'is-moncash' : 'is-stripe'}`}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <span>N ap trete peman an...</span>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Konfime & Peye {paymentMethod === 'moncash' ? '100 Goud' : '$2.99 USD'}</span>
                  </>
                )}
              </button>

              <div className="security-footer-note">
                <ShieldCheck size={14} color="#2B4736" />
                <span>Peman 100% Sekirize • Otantifikasyon Enstantane</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE SUCCÈS APRÈS PAIEMENT */}
      {showSuccessModal && (
        <div className="checkout-overlay">
          <div className="checkout-card" style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} color="#2E7D32" />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#2B4736', marginBottom: 8 }}>
              Kat ou a Debloke ak Siksè !
            </h3>

            <p style={{ fontSize: 13.5, color: '#555', lineHeight: 1.5, marginBottom: 20 }}>
              Kat dijital pou <strong>{recipient}</strong> pare. Ou ka pataje l kounye a sou WhatsApp oswa kopye lyen espesyal la.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-stationery-whatsapp"
                style={{ width: '100%', maxWidth: 'none' }}
              >
                <WhatsAppOfficialLogo />
                <span>Voye bay {recipient} sou WhatsApp</span>
              </a>

              <button
                type="button"
                className="btn-stationery-primary"
                style={{ width: '100%', maxWidth: 'none', background: '#FFFFFF', color: '#2B4736', borderColor: '#2B4736' }}
                onClick={() => {
                  setShowSuccessModal(false);
                  handleDownloadCardImage();
                }}
              >
                <Download size={14} style={{ marginRight: 6 }} />
                <span>Telechaje Imaj Kat la (PNG)</span>
              </button>

              <button
                type="button"
                className="btn-stationery-link"
                style={{ color: '#777', marginTop: 6 }}
                onClick={() => setShowSuccessModal(false)}
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
