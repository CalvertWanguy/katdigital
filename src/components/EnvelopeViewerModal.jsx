import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  Gift,
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
  Share2
} from 'lucide-react';

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
  const [isPaid, setIsPaid] = useState(Boolean(isDirectView)); // Si direct link = déjà payé
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('moncash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const cardRef = useRef(null);
  const sealRef = useRef(null);
  const promptRef = useRef(null);
  const actionsRef = useRef(null);

  // Verrouiller le défilement de l'arrière-plan de manière absolue (iOS & Android)
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

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);

  const recipient = customData?.recipient || 'Chè Vanessa';
  const sender = customData?.sender || 'David Jean';
  const message = customData?.message || template.defaultMessage;
  const title = customData?.heading || template.heading;

  // Code slug simulé (ex: 'x7K9p2')
  const slug = customData?.slug || 'x7K9p2';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://katdigital.ht';
  const uniqueCardLink = `${origin}/?to=${encodeURIComponent(recipient)}&from=${encodeURIComponent(sender)}&theme=${template.id}&msg=${encodeURIComponent(message)}`;

  const shareMessageText = `Gade bèl kat fèt mwen sot kreye pou ou a !\n\nKlike sou lyen sa a pou w ouvri bèl anvlòp ou an :\n${uniqueCardLink}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessageText)}`;

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
    // Étape 4 : La carte glisse hors de l'enveloppe vers le haut
    .to(cardRef.current, {
      y: -135,
      duration: 0.85,
      ease: 'power2.out',
      onComplete: () => {
        if (cardRef.current) cardRef.current.style.zIndex = 25;
        launchLuxuryConfetti();
      }
    })
    // Étape 5 : L'enveloppe s'estompe légèrement à l'arrière-plan
    .to(envelopeRef.current, {
      y: 10,
      opacity: 0.25,
      scale: 0.95,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4')
    // Étape 6 : La carte reste bien dégagée en hauteur avec un zoom subtil
    .to(cardRef.current, {
      y: -135,
      scale: 1.02,
      duration: 0.4,
      ease: 'power1.out'
    }, '-=0.3')
    // Étape 7 : Les 3 boutons d'action apparaissent nettement EN DESSOUS de la carte
    .to(actionsRef.current, {
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
    gsap.set(sealRef.current, { scale: 1, opacity: 1 });
    gsap.set(flapRef.current, { rotateX: 0, zIndex: 4 });
    gsap.set(cardRef.current, { y: 0, scale: 1, zIndex: 2 });
    gsap.set(envelopeRef.current, { y: 0, opacity: 1, scale: 1 });
    gsap.set(actionsRef.current, { opacity: 0, y: 20, pointerEvents: 'none' });

    setTimeout(openEnvelope, 300);
  };

  // Similation de validation de paiement MonCash / Stripe
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

  // Téléchargement haute résolution de la carte en format image PNG (pour statut WhatsApp)
  const handleDownloadCardImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');

    // Fond papier de luxe
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cadre doré double
    ctx.strokeStyle = '#D6BA85';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    // Titre
    ctx.fillStyle = template.envelopeColor;
    ctx.font = 'bold 64px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, 240);

    // Destinataire
    ctx.fillStyle = '#2B2620';
    ctx.font = 'italic 50px "Playfair Display", Georgia, serif';
    ctx.fillText(`${recipient},`, canvas.width / 2, 420);

    // Message multilignes
    ctx.fillStyle = '#4A463F';
    ctx.font = '36px "Cormorant Garamond", Georgia, serif';
    const words = message.split(' ');
    let line = '';
    let y = 560;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 800 && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += 55;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Signature
    ctx.fillStyle = '#8C877D';
    ctx.font = '24px "Montserrat", sans-serif';
    ctx.fillText('AK TOUT AFEKSYON MWEN,', canvas.width / 2, 1150);

    ctx.fillStyle = '#2B4736';
    ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
    ctx.fillText(sender, canvas.width / 2, 1220);

    // Filigrane discret
    ctx.fillStyle = '#A69279';
    ctx.font = '22px "Montserrat", sans-serif';
    ctx.fillText('KatDigital.ht • Bèl Swè Fen Dane', canvas.width / 2, 1340);

    // Déclenchement du téléchargement
    const link = document.createElement('a');
    link.download = `kat-${recipient.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(uniqueCardLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="viewer-modal">
      <button className="btn-close-modal" onClick={onClose} aria-label="Fèmen">
        <X size={20} />
      </button>

      <div className="viewer-scroll-container">
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
                <div className="card-top-caption">Bèl Swè Fèt Fen Dane</div>
                <h2 className="card-main-title" style={{ color: template.envelopeColor }}>
                  {title}
                </h2>
                <div className="card-separator" />
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

          {/* Panèl aksyon : Pozisyone nèt anba kat la san kache okenn tèks */}
          <div ref={actionsRef} className="card-actions-panel">
            {isPaid ? (
              // CAS 1 : KAT LA PEYE / VALID (Destinataire oswa Kliyan apre peman)
              <>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp-share"
                >
                  <WhatsAppOfficialLogo />
                  <span>Pataje lyen sa a sou WhatsApp</span>
                </a>

                {isDirectView ? (
                  <button
                    className="btn-create-for-100"
                    onClick={() => onOpenCustomizer(template)}
                  >
                    <Gift size={17} style={{ flexShrink: 0 }} />
                    <span>Kreye pa w la tou (100 Goud)</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', width: '92%', maxWidth: '320px' }}>
                    <button
                      className="btn-download-image"
                      onClick={handleDownloadCardImage}
                      style={{ flex: 1, padding: '11px 14px', fontSize: '13px' }}
                    >
                      <Download size={16} />
                      <span>Telechaje PNG</span>
                    </button>
                    <button
                      className="btn-copy-link"
                      onClick={handleCopyLink}
                      style={{ flex: 1, padding: '11px 14px', fontSize: '13px' }}
                    >
                      {copiedLink ? <Check size={16} color="#2B4736" /> : <Copy size={16} />}
                      <span>{copiedLink ? 'Kopye !' : 'Kopye Lyen'}</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              // CAS 2 : APÈSI DÉMO / AVAN PEMAN
              <>
                <button
                  className="btn-create-for-100"
                  onClick={() => onOpenCustomizer(template)}
                  style={{
                    background: 'var(--gold-foil)',
                    color: '#2B1D04',
                    border: 'none'
                  }}
                >
                  <Gift size={17} style={{ flexShrink: 0 }} />
                  <span>Pèsonalize & Kreye pa w la (100 Goud)</span>
                </button>

                <button
                  className="btn-unlock-share"
                  onClick={() => setShowCheckoutModal(true)}
                >
                  <Lock size={16} />
                  <span>Debloke & Voye Kat sa a (100 Goud)</span>
                </button>
              </>
            )}

            <button type="button" className="btn-replay-anim" onClick={replayAnimation}>
              <RotateCcw size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              <span>Gade ouvèti anvlòp la ankò</span>
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
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#6B6864', lineHeight: 1.5, marginBottom: 16 }}>
              Bèl kat ou an pare ! Chwazi mwayen peman w pou w resevwa lyen ofisyèl la epi voye l sou WhatsApp.
            </p>

            <form onSubmit={handleProcessPayment}>
              <div className="payment-cards-grid" style={{ marginBottom: 14 }}>
                <div
                  className={`payment-choice-card ${paymentMethod === 'moncash' ? 'active-moncash' : ''}`}
                  onClick={() => setPaymentMethod('moncash')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="payment-icon-box moncash-box">
                      <Smartphone size={18} color="#C41230" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>MonCash</div>
                      <div style={{ fontSize: 11, color: '#6B6864' }}>Ayiti • 100 Goud</div>
                    </div>
                  </div>
                  {paymentMethod === 'moncash' && <CheckCircle2 size={18} color="#C41230" />}
                </div>

                <div
                  className={`payment-choice-card ${paymentMethod === 'card' ? 'active-card' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="payment-icon-box card-box">
                      <CreditCard size={18} color="#2B4736" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Kat Kredi</div>
                      <div style={{ fontSize: 11, color: '#6B6864' }}>Diaspora • $2.99</div>
                    </div>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle2 size={18} color="#2B4736" />}
                </div>
              </div>

              {paymentMethod === 'moncash' && (
                <div className="form-group-clean">
                  <label className="form-label-clean">Nimewo telefòn MonCash ou :</label>
                  <input
                    type="tel"
                    placeholder="+509 XXXX-XXXX"
                    className="form-input-clean"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="btn-validate-personalize"
                style={{ marginTop: 14 }}
              >
                <Lock size={16} />
                <span>
                  {isProcessingPayment
                    ? 'Validasyon peman an kour...'
                    : `Konfime & Peye (${paymentMethod === 'moncash' ? '100 Goud' : '2.99 $'})`}
                </span>
              </button>

              <div className="security-footer-note">
                <ShieldCheck size={13} />
                <span>Peman 100% sekirize • Deblokaj enstantane</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL DE SUCCÈS (ÉCRAN DE VICTOIRE APRÈS PAIEMENT)
          ========================================================== */}
      {showSuccessModal && (
        <div className="checkout-overlay">
          <div className="checkout-card" style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={32} color="#2B4736" />
            </div>

            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 26, fontWeight: 700, color: '#2B4736' }}>
              Bravo {sender} !
            </h3>
            <p style={{ fontSize: 13, color: '#6B6864', margin: '6px 0 20px', lineHeight: 1.5 }}>
              Kat ou an pou <strong>{recipient}</strong> debloke avèk siksè. Ou ka voye l sou WhatsApp oswa telechaje l kounya !
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-share"
                style={{ width: '100%', maxWidth: 'none' }}
              >
                <WhatsAppOfficialLogo />
                <span>Pataje sou WhatsApp kounya</span>
              </a>

              <button
                className="btn-download-image"
                onClick={handleDownloadCardImage}
                style={{ width: '100%' }}
              >
                <Download size={17} />
                <span>Telechaje Imaj la pou Estati w (PNG)</span>
              </button>

              <button
                className="btn-copy-link"
                onClick={handleCopyLink}
                style={{ width: '100%' }}
              >
                {copiedLink ? <Check size={16} color="#2B4736" /> : <Copy size={16} />}
                <span>{copiedLink ? 'Lyen an kopye !' : 'Kopye lyen an'}</span>
              </button>

              <button
                onClick={() => setShowSuccessModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 12, color: '#8C877D', cursor: 'pointer', marginTop: 6 }}
              >
                Gade kat la ankò
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
