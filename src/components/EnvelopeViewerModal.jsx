import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Share2, RefreshCw, X, Sparkles, Send } from 'lucide-react';

export default function EnvelopeViewerModal({ template, customData, onClose, onOpenCustomizer }) {
  const [isOpened, setIsOpened] = useState(false);
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const cardRef = useRef(null);
  const sealRef = useRef(null);
  const promptRef = useRef(null);
  const actionsRef = useRef(null);

  // Valeurs par défaut si pas de customData
  const recipient = customData?.recipient || 'Chère Vanessa';
  const sender = customData?.sender || 'David Jean';
  const message = customData?.message || template.defaultMessage;
  const title = customData?.heading || template.heading;

  // Configuration du vrai lien WhatsApp avec encodage complet
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://katdijital.ht';
  const whatsappShareText = encodeURIComponent(
    `Gade bèl kat fèt mwen sot kreye pou ou a ! ✨\nKlike sou lyen sa a pou w ouvri bèl anvlòp ou an :\n👉 ${currentUrl}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappShareText}`;

  // Joue une douce mélodie de carillon (Web Audio API)
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
      console.log('Audio chiming error', e);
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

    // 1. Masquer l'instruction
    tl.to(promptRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      onComplete: () => {
        if (promptRef.current) promptRef.current.style.display = 'none';
      }
    })
    // 2. Faire disparaître le sceau
    .to(sealRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.25,
      ease: 'back.in(1.7)'
    }, '-=0.1')
    // 3. Rabat tourne à 180° en 3D
    .to(flapRef.current, {
      rotateX: 180,
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: () => {
        if (flapRef.current) flapRef.current.style.zIndex = 1;
      }
    })
    // 4. La carte glisse vers le haut
    .to(cardRef.current, {
      y: -190,
      duration: 0.85,
      ease: 'power2.out',
      onComplete: () => {
        if (cardRef.current) cardRef.current.style.zIndex = 25;
        launchLuxuryConfetti();
      }
    })
    // 5. L'enveloppe recule légèrement
    .to(envelopeRef.current, {
      y: 110,
      opacity: 0.25,
      scale: 0.92,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
    // 6. La carte se centre et s'agrandit pour lecture
    .to(cardRef.current, {
      y: -20,
      scale: 1.05,
      duration: 0.6,
      ease: 'back.out(1.15)'
    }, '-=0.6')
    // 7. Apparition des boutons avec le vrai lien
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
      <button className="btn-close-modal" onClick={onClose}>
        <X size={20} />
      </button>

      <div className="viewer-stage">
        
        {/* Invite d'ouverture */}
        <div ref={promptRef} className="open-prompt" onClick={openEnvelope}>
          ✉️ Klike sou anvlòp la pou w ouvri l
        </div>

        {/* Enveloppe physique */}
        <div
          ref={envelopeRef}
          className="real-envelope"
          style={{ background: template.envelopeColor }}
          onClick={openEnvelope}
        >
          {/* Doublure intérieure (Liner) */}
          <div className="real-liner" />

          {/* Carte de vœux qui glisse */}
          <div ref={cardRef} className="real-card">
            <div className="real-card-border" />

            <div>
              <div className="card-top-caption">✨ Vœux de Fin d'Année ✨</div>
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

          {/* Poche avant de l'enveloppe */}
          <div
            className="real-envelope-pocket"
            style={{
              borderLeftColor: template.pocketColors.left,
              borderRightColor: template.pocketColors.right,
              borderBottomColor: template.pocketColors.bottom
            }}
          />

          {/* Rabat supérieur */}
          <div
            ref={flapRef}
            className="real-envelope-flap"
            style={{ borderTopColor: template.flapColor }}
          />

          {/* Sceau en cire */}
          <div ref={sealRef} className="real-wax-seal">
            2027
          </div>
        </div>

        {/* Panneau d'actions avec le vrai lien WhatsApp */}
        <div ref={actionsRef} className="card-actions-panel">
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-share"
          >
            <Send size={18} />
            Pataje lyen sa a sou WhatsApp
          </a>

          <button
            className="btn-create-for-100"
            onClick={() => onOpenCustomizer(template)}
          >
            <Sparkles size={16} />
            Pèsonalize & Resevwa pa w la (100 HTG)
          </button>

          <span className="btn-replay-anim" onClick={replayAnimation}>
            <RefreshCw size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
            Rewè ouvèti anvlòp la
          </span>
        </div>

      </div>
    </div>
  );
}
