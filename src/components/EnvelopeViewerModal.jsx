import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Gift, RotateCcw, X } from 'lucide-react';

// Véritable logo officiel vectoriel SVG WhatsApp (Reconnaissable et rassurant)
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

export default function EnvelopeViewerModal({ template, customData, onClose, onOpenCustomizer }) {
  const [isOpened, setIsOpened] = useState(false);
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const cardRef = useRef(null);
  const sealRef = useRef(null);
  const promptRef = useRef(null);
  const actionsRef = useRef(null);

  const recipient = customData?.recipient || 'Chère Vanessa';
  const sender = customData?.sender || 'David Jean';
  const message = customData?.message || template.defaultMessage;
  const title = customData?.heading || template.heading;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://katdijital.ht';
  const whatsappShareText = encodeURIComponent(
    `Gade bèl kat fèt mwen sot kreye pou ou a ! ✨\nKlike sou lyen sa a pou w ouvri bèl anvlòp ou an :\n👉 ${currentUrl}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappShareText}`;

  const playElegantChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (idx * 0.12));

        gain.gain.setValueAtTime(0, audioCtx.currentTime + (idx * 0.12));
        gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + (idx * 0.12) + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (idx * 0.12) + 0.6);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + (idx * 0.12));
        osc.stop(audioCtx.currentTime + (idx * 0.12) + 0.6);
      });
    } catch (e) {
      console.log('Audio chime error', e);
    }
  };

  const launchLuxuryConfetti = () => {
    const colors = template.confettiColors || ['#ECC880', '#C39D5E', '#FFFFFF'];
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 45,
      origin: { x: 0.2, y: 0.55 },
      colors
    });
    confetti({
      particleCount: 35,
      angle: 120,
      spread: 45,
      origin: { x: 0.8, y: 0.55 },
      colors
    });
  };

  const openEnvelope = () => {
    if (isOpened) return;
    setIsOpened(true);

    playElegantChime();

    const tl = gsap.timeline();

    tl.to(promptRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      onComplete: () => {
        if (promptRef.current) promptRef.current.style.display = 'none';
      }
    })
    .to(sealRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.25,
      ease: 'back.in(1.7)'
    }, '-=0.1')
    .to(flapRef.current, {
      rotateX: 180,
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: () => {
        if (flapRef.current) flapRef.current.style.zIndex = 1;
      }
    })
    .to(cardRef.current, {
      y: -190,
      duration: 0.85,
      ease: 'power2.out',
      onComplete: () => {
        if (cardRef.current) cardRef.current.style.zIndex = 25;
        launchLuxuryConfetti();
      }
    })
    .to(envelopeRef.current, {
      y: 110,
      opacity: 0.25,
      scale: 0.92,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
    .to(cardRef.current, {
      y: -20,
      scale: 1.05,
      duration: 0.6,
      ease: 'back.out(1.15)'
    }, '-=0.6')
    .to(actionsRef.current, {
      opacity: 1,
      y: 0,
      pointerEvents: 'auto',
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2');
  };

  const replayAnimation = () => {
    setIsOpened(false);
    gsap.killTweensOf('*');
    if (promptRef.current) {
      promptRef.current.style.display = 'block';
      gsap.set(promptRef.current, { opacity: 1, y: 0 });
    }
    gsap.set(sealRef.current, { scale: 1, opacity: 1 });
    gsap.set(flapRef.current, { rotateX: 0, zIndex: 4 });
    gsap.set(cardRef.current, { y: 0, scale: 1, zIndex: 2 });
    gsap.set(envelopeRef.current, { y: 0, opacity: 1, scale: 1 });
    gsap.set(actionsRef.current, { opacity: 0, y: 20, pointerEvents: 'none' });

    setTimeout(openEnvelope, 300);
  };

  return (
    <div className="viewer-modal">
      <button className="btn-close-modal" onClick={onClose} aria-label="Fermer">
        <X size={20} />
      </button>

      <div className="viewer-stage">
        <div ref={promptRef} className="open-prompt" onClick={openEnvelope}>
          Klike sou anvlòp la pou w ouvri l
        </div>

        <div
          ref={envelopeRef}
          className="real-envelope"
          style={{ background: template.envelopeColor }}
          onClick={openEnvelope}
        >
          <div className="real-liner" />

          <div ref={cardRef} className="real-card">
            <div className="real-card-border" />

            <div>
              <div className="card-top-caption">Vœux de Fin d'Année</div>
              <h2 className="card-main-title" style={{ color: template.envelopeColor }}>
                {title}
              </h2>
              <div className="card-separator" />
            </div>

            <div>
              <div className="card-destinataire">{recipient},</div>
              <p className="card-text-body">{message}</p>
            </div>

            <div className="card-signature-box">
              <div className="card-signature-label">Avèk anpil afeksyon de</div>
              <div className="card-signature-name">{sender}</div>
            </div>
          </div>

          <div
            className="real-envelope-pocket"
            style={{
              borderLeftColor: template.pocketColors.left,
              borderRightColor: template.pocketColors.right,
              borderBottomColor: template.pocketColors.bottom
            }}
          />

          <div
            ref={flapRef}
            className="real-envelope-flap"
            style={{ borderTopColor: template.flapColor }}
          />

          <div ref={sealRef} className="real-wax-seal">
            2027
          </div>
        </div>

        {/* Panneau d'actions : VRAI logo WhatsApp + Icône Cadeau de Prestige */}
        <div ref={actionsRef} className="card-actions-panel">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-share"
          >
            <WhatsAppOfficialLogo />
            <span>Pataje lyen sa a sou WhatsApp</span>
          </a>

          <button
            className="btn-create-for-100"
            onClick={() => onOpenCustomizer(template)}
          >
            <Gift size={17} style={{ flexShrink: 0 }} />
            <span>Pèsonalize & Resevwa pa w la (100 HTG)</span>
          </button>

          <span className="btn-replay-anim" onClick={replayAnimation}>
            <RotateCcw size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
            Rewè ouvèti anvlòp la
          </span>
        </div>
      </div>
    </div>
  );
}
