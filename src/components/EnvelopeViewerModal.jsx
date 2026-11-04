import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  X,
  Lock,
  Download,
  Copy,
  Check,
  Smartphone,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';
import AmbientEffects from './AmbientEffects';
import {
  playHolidaySoundtrack,
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

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://katdigital.ht';
  const uniqueCardLink = `${currentHost}/?to=${encodeURIComponent(recipient)}&from=${encodeURIComponent(sender)}&theme=${template.id}&msg=${encodeURIComponent(message)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `🎁 Ou resevwa yon bèl kat fèt fen dane espesyal de ${sender} !\nKlike la a pou w ouvri bèl kat ou a :\n${uniqueCardLink}`
  )}`;

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

    playWaxBreakAndChime();

    // Kòmanse jwe melodi fèt la si li pa an silans
    if (!isMusicMuted && musicId !== 'none') {
      playHolidaySoundtrack(musicId, customAudioUrl);
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

    // 1. Disparition du prompt
    tl.to(promptRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      onComplete: () => {
        if (promptRef.current) promptRef.current.style.display = 'none';
      }
    });

    // 2. Rupture du Sceau d'or
    if (sealCrackLineRef.current) {
      tl.to(sealCrackLineRef.current, { opacity: 1, duration: 0.05 }, 'crack')
        .to(sealLeftRef.current, { x: -35, y: -10, rotate: -30, opacity: 0, duration: 0.35, ease: 'power2.in' }, 'crack')
        .to(sealRightRef.current, { x: 35, y: 10, rotate: 30, opacity: 0, duration: 0.35, ease: 'power2.in' }, 'crack');
    }

    // 3. ANIMATION SYMETRIQUE SELON LE FORMAT
    if (format === 'parchment') {
      // FORMAT PARCHEMIN : Le parchemin unifié s'ouvre verticalement de manière 100% symétrique
      tl.to(parchmentRibbonRef.current, { opacity: 0, scale: 0.9, duration: 0.3 }, 'crack')
        .fromTo(
          parchmentContainerRef.current,
          { height: 60 },
          {
            height: 400,
            duration: 0.85,
            ease: 'power2.out',
            onComplete: () => launchLuxuryConfetti()
          },
          '-=0.15'
        )
        .fromTo(
          cardRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );
    } else if (format === 'bifold') {
      // FORMAT LIV PLIYET : La couverture s'ouvre en 3D avec face arrière sans texte inversé
      tl.to(bifoldCoverRef.current, {
        rotateY: -160,
        duration: 0.85,
        ease: 'power2.inOut',
        onComplete: () => {
          if (bifoldCoverRef.current) bifoldCoverRef.current.style.zIndex = 1;
          launchLuxuryConfetti();
        }
      }, '-=0.15')
      .set(cardRef.current, { opacity: 1, pointerEvents: 'auto', zIndex: 50 }, '-=0.3');
    } else if (format === 'kraft_sheet') {
      // FORMAT LÈT KRAFT : Les 2 rabats s'ouvrent symétriquement
      tl.to(kraftTopFlapRef.current, { rotateX: 180, duration: 0.65, ease: 'power2.inOut' }, '-=0.15')
        .to(kraftBottomFlapRef.current, { rotateX: -180, duration: 0.65, ease: 'power2.inOut' }, '<')
        .set(cardRef.current, { opacity: 1, pointerEvents: 'auto', zIndex: 50 }, '-=0.3')
        .fromTo(
          cardRef.current,
          { scale: 0.96, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.55,
            ease: 'power2.out',
            onComplete: () => launchLuxuryConfetti()
          },
          '-=0.2'
        );
    } else {
      // FORMAT ANVLÒP DE LUKS
      tl.to(flapRef.current, {
        rotateX: 180,
        duration: 0.65,
        ease: 'power2.inOut',
        onComplete: () => {
          if (flapRef.current) flapRef.current.style.zIndex = 1;
        }
      }, '-=0.18')
      .set(cardRef.current, { opacity: 1, pointerEvents: 'auto', zIndex: 50 }, '-=0.3')
      .fromTo(
        cardRef.current,
        { y: 30, opacity: 0.2, scale: 0.94 },
        {
          y: -140,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: 'power2.out',
          onComplete: () => launchLuxuryConfetti()
        },
        '-=0.25'
      )
      .to(envelopeRef.current, {
        y: 45,
        opacity: 0.35,
        scale: 0.94,
        duration: 0.65,
        ease: 'power2.out'
      }, '-=0.55');
    }

    // 4. Panèl aksyon yo parèt nèt anba kat la
    tl.to(actionsRef.current, {
      opacity: 1,
      y: 0,
      pointerEvents: 'auto',
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.1');
  };

  const replayAnimation = () => {
    setIsOpened(false);
    gsap.killTweensOf('*');
    if (promptRef.current) {
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
      gsap.set(bifoldCoverRef.current, { rotateY: 0, zIndex: 30 });
      gsap.set(cardRef.current, { opacity: 1, pointerEvents: 'none' });
    } else if (format === 'kraft_sheet') {
      gsap.set(kraftTopFlapRef.current, { rotateX: 0 });
      gsap.set(kraftBottomFlapRef.current, { rotateX: 0 });
      gsap.set(cardRef.current, { opacity: 0, pointerEvents: 'none' });
    } else {
      gsap.set(flapRef.current, { rotateX: 0, zIndex: 4 });
      gsap.set(cardRef.current, { y: 0, scale: 1, zIndex: 2, opacity: 0, pointerEvents: 'none' });
      gsap.set(envelopeRef.current, { y: 0, opacity: 1, scale: 1 });
    }

    gsap.set(actionsRef.current, { opacity: 0, y: 20, pointerEvents: 'none' });

    setTimeout(openCard, 350);
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
    ctx.font = 'bold 64px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 220);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 120, 260);
    ctx.lineTo(canvas.width / 2 + 120, 260);
    ctx.stroke();

    ctx.fillStyle = '#111110';
    ctx.font = 'bold 52px "Playfair Display", Georgia, serif';
    ctx.fillText(`${recipient},`, canvas.width / 2, 420);

    ctx.fillStyle = '#222220';
    ctx.font = 'italic 40px "Cormorant Garamond", Georgia, serif';

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
    ctx.font = 'bold 48px "Playfair Display", Georgia, serif';
    ctx.fillText(sender, canvas.width / 2, sigY + 65);

    const link = document.createElement('a');
    link.download = `KatDigital_${recipient}.png`;
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

      <div className="viewer-scroll-container">
        <div className="viewer-stage">
          <div ref={promptRef} className="open-prompt" onClick={openCard}>
            {format === 'parchment'
              ? 'Klike sou sele a pou w dewoule pachemen an'
              : format === 'bifold'
              ? 'Klike pou w ouvri liv papetri a'
              : format === 'kraft_sheet'
              ? 'Klike sou sele a pou w ouvri lèt la'
              : 'Klike sou sele a pou w ouvri l'}
          </div>

          <div className="envelope-scene-box">
            
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
                    <p className="card-text-body">{message}</p>
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

                  {/* Kontni tèks la */}
                  <div ref={cardRef} className="parchment-content-flow" style={{ opacity: 0 }}>
                    <div style={{ marginTop: 10, marginBottom: 4 }}>
                      <h2 className="card-main-title" style={{ color: template.envelopeColor, fontFamily: 'Cormorant Garamond, serif' }}>
                        {title}
                      </h2>
                      <div className="card-separator" style={{ background: template.accentColor || '#C99726' }} />
                    </div>

                    <div className="card-message-area">
                      <div className="card-destinataire" style={{ color: '#2B1A04' }}>{recipient},</div>
                      <p className="card-text-body" style={{ color: '#2D2012' }}>{message}</p>
                    </div>

                    <div className="card-signature-box" style={{ borderTopColor: '#DECBB0' }}>
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
                            <text x="27" y="32" fontSize="13" textAnchor="middle" fill="#FFF8D6" fontWeight="bold">1804</text>
                          </svg>
                        </div>
                        <div ref={sealRightRef} className="seal-half seal-right">
                          <svg viewBox="0 0 54 54" className="seal-svg">
                            <circle cx="27" cy="27" r="25" fill="#C99726" stroke="#7A5207" strokeWidth="1.2" />
                            <text x="27" y="32" fontSize="13" textAnchor="middle" fill="#FFF8D6" fontWeight="bold">1804</text>
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
                FORMAT 3 : BIFOLD LIV PAPETRI (FOLIO 3D SANS TEXTE INVERSÉ)
                ======================================================== */}
            {format === 'bifold' && (
              <div className="bifold-book-stage" onClick={openCard}>
                {/* Couverture qui s'ouvre avec dos propre */}
                <div
                  ref={bifoldCoverRef}
                  className="bifold-cover-flipper"
                >
                  {/* Face avant de la couverture */}
                  <div className="bifold-cover-face bifold-cover-front" style={{ background: template.coverColor || '#1E3326' }}>
                    <div className="bifold-cover-emboss">
                      <div className="bifold-gold-frame" />
                      <span className="bifold-crest">✦</span>
                      <h4 className="bifold-cover-text">{title}</h4>
                      <span className="bifold-sub-note">KLIKE POU OUVERTI</span>
                    </div>
                  </div>

                  {/* Face intérieure gauche (propre, pas de texte à l'envers) */}
                  <div className="bifold-cover-face bifold-cover-back" style={{ background: '#16281E' }}>
                    <div className="bifold-cover-emboss" style={{ borderColor: 'rgba(212, 175, 55, 0.4)' }}>
                      <span style={{ fontSize: 28, color: '#D4AF37' }}>✦</span>
                      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontStyle: 'italic', color: '#E8E1D3', marginTop: 10 }}>
                        Bèl Swè Fèt Fen Dane
                      </p>
                      <span style={{ fontSize: 10, letterSpacing: 2, color: '#D4AF37', textTransform: 'uppercase', marginTop: 10 }}>
                        2026 • 2027
                      </span>
                    </div>
                  </div>
                </div>

                {/* Page intérieure droite : Le message */}
                <div ref={cardRef} className="real-card bifold-page-right" style={{ opacity: 1, pointerEvents: 'auto' }}>
                  <div className="real-card-border" style={{ borderColor: template.accentColor || '#D4AF37' }} />

                  <div style={{ marginTop: 6, marginBottom: 4 }}>
                    <h2 className="card-main-title" style={{ color: template.envelopeColor }}>
                      {title}
                    </h2>
                    <div className="card-separator" style={{ background: template.accentColor || '#D4AF37' }} />
                  </div>

                  <div className="card-message-area">
                    <div className="card-destinataire">{recipient},</div>
                    <p className="card-text-body">{message}</p>
                  </div>

                  <div className="card-signature-box">
                    <div className="card-signature-label">Ak tout afeksyon mwen,</div>
                    <div className="card-signature-name">{sender}</div>
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
                    <p className="card-text-body" style={{ color: '#3A1E27' }}>{message}</p>
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
                    onClick={() => {
                      stopHolidaySoundtrack();
                      onOpenCustomizer(template);
                    }}
                  >
                    KREYE PA W LA TOU
                  </button>
                ) : (
                  <div className="stationery-btn-row">
                    <button
                      className="btn-stationery-sub"
                      onClick={handleDownloadCardImage}
                    >
                      TELECHAJE PNG
                    </button>
                    <button
                      className="btn-stationery-sub"
                      onClick={handleCopyLink}
                    >
                      {copiedLink ? 'KOPYE !' : 'KOPYE LYEN'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  className="btn-stationery-primary"
                  onClick={() => {
                    stopHolidaySoundtrack();
                    onOpenCustomizer(template);
                  }}
                >
                  PÈSONALIZE KAT PA W LA
                </button>

                <button
                  className="btn-stationery-secondary"
                  onClick={() => setShowCheckoutModal(true)}
                >
                  DEBLOKE MODÈL SA A
                </button>
              </>
            )}

            <button type="button" className="btn-stationery-link" onClick={replayAnimation}>
              <RotateCcw size={11} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              <span>GADE OUVÈTI ANVLÒP LA ANKÒ</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==========================================================
          MODAL DE PAIEMENT EXPRESS (MONCASH / STRIPE)
          ========================================================== */}
      {showCheckoutModal && (
        <div className="checkout-overlay">
          <div className="checkout-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span className="customizer-badge" style={{ color: '#7A1F2D', background: '#7A1F2D14' }}>
                  Peman an Sekirite
                </span>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 23, fontWeight: 700, color: '#2B4736', marginTop: 4 }}>
                  Debloke Kat pou {recipient}
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="customizer-close-btn"
                aria-label="Fèmen"
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#6B6864', lineHeight: 1.5, marginBottom: 18 }}>
              Chwazi mòd peman ou prefere a pou w ka voye lyen an sou WhatsApp ak telechaje foto kat la.
            </p>

            <form onSubmit={handleProcessPayment}>
              <div className="payment-cards-grid" style={{ marginBottom: 16 }}>
                <div
                  className={`payment-choice-card ${paymentMethod === 'moncash' ? 'active-moncash' : ''}`}
                  onClick={() => setPaymentMethod('moncash')}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: 14, color: '#C41230' }}>MonCash</strong>
                    <span style={{ fontSize: 12, color: '#555' }}>Ayiti • 100 HTG</span>
                  </div>
                  <div className="payment-icon-box moncash-box">
                    <Smartphone size={16} color="#C41230" />
                  </div>
                </div>

                <div
                  className={`payment-choice-card ${paymentMethod === 'card' ? 'active-card' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div>
                    <strong style={{ display: 'block', fontSize: 14, color: '#2B4736' }}>Kat / Stripe</strong>
                    <span style={{ fontSize: 12, color: '#555' }}>Diaspora • $2.99 USD</span>
                  </div>
                  <div className="payment-icon-box card-box">
                    <CreditCard size={16} color="#2B4736" />
                  </div>
                </div>
              </div>

              {paymentMethod === 'moncash' ? (
                <div className="form-group-clean">
                  <label className="form-label-clean">
                    <Smartphone size={13} style={{ color: '#C41230' }} />
                    <span>Nimewo Telefòn MonCash :</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: +509 34 56 7890"
                    className="form-input-clean"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: 11, color: '#888', marginTop: 4, display: 'block' }}>
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
                  <div className="form-row-2" style={{ marginTop: 8 }}>
                    <input type="text" placeholder="MM / AA" className="form-input-clean" required />
                    <input type="text" placeholder="CVC" className="form-input-clean" required />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn-validate-personalize"
                disabled={isProcessingPayment}
                style={{
                  background: paymentMethod === 'moncash' ? '#C41230' : 'var(--primary-green)',
                  color: '#FFFFFF'
                }}
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
                <ShieldCheck size={13} color="#2B4736" />
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

            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 700, color: '#2B4736', marginBottom: 8 }}>
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
