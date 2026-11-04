import React, { useState, useEffect } from 'react';
import { X, Smartphone, CreditCard, Gift, User, Edit3, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PRESET_MESSAGES } from '../data/templates';

export default function PersonalizeModal({ template, onClose, onSaveAndPreview }) {
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('fanmi');
  const [customMessage, setCustomMessage] = useState(PRESET_MESSAGES[0].text);
  const [paymentMethod, setPaymentMethod] = useState('moncash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verrouiller le défilement de l'arrière-plan sur ordinateur et mobile
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  const handleSelectCategory = (presetId) => {
    setSelectedPreset(presetId);
    const found = PRESET_MESSAGES.find((m) => m.id === presetId);
    if (found) {
      setCustomMessage(found.text);
    }
  };

  const handleValidate = (e) => {
    e.preventDefault();
    if (!recipient.trim() || !sender.trim()) {
      alert('Tanpri mete non moun k ap resevwa kat la ak non pa w.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSaveAndPreview({
        recipient,
        sender,
        message: customMessage,
        heading: template.heading
      });
    }, 600);
  };

  return (
    <div className="customizer-modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="customizer-card">
        
        {/* Antèt Modal la */}
        <div className="customizer-header">
          <div>
            <span className="customizer-badge" style={{ color: template.envelopeColor, background: `${template.envelopeColor}14` }}>
              Modèl : {template.title}
            </span>
            <h3 className="customizer-title">Pèsonalize Kat Pa w la</h3>
          </div>
          <button onClick={onClose} className="customizer-close-btn" aria-label="Fèmen">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleValidate} className="customizer-form">
          
          {/* Seksyon 1 : Moun yo */}
          <div className="form-row-2">
            <div className="form-group-clean">
              <label className="form-label-clean">
                <User size={13} style={{ color: 'var(--primary-green)' }} />
                <span>Pou ki moun ?</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Vanessa, Manman..."
                className="form-input-clean"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>

            <div className="form-group-clean">
              <label className="form-label-clean">
                <Edit3 size={13} style={{ color: 'var(--primary-green)' }} />
                <span>De ki moun ? (Non w)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: David, Pitit ou..."
                className="form-input-clean"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Seksyon 2 : Seleksyon Mesaj Rapid an Pilil */}
          <div className="form-group-clean">
            <label className="form-label-clean">
              <span>Chwazi yon bèl mesaj rapid :</span>
            </label>
            <div className="preset-pill-list">
              {PRESET_MESSAGES.map((msg) => (
                <button
                  key={msg.id}
                  type="button"
                  className={`preset-pill-item ${selectedPreset === msg.id ? 'active' : ''}`}
                  onClick={() => handleSelectCategory(msg.id)}
                >
                  {msg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tèks mesaj la */}
          <div className="form-group-clean">
            <label className="form-label-clean">
              <span>Tèks kat la (ou ka modifye l jan w vle) :</span>
            </label>
            <textarea
              rows={3}
              className="form-textarea-clean"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              required
            />
          </div>

          {/* Seksyon 3 : Chwa Mwayen Peman */}
          <div className="form-group-clean">
            <label className="form-label-clean">
              <span>Mwayen peman :</span>
            </label>
            <div className="payment-cards-grid">
              
              <div
                className={`payment-choice-card ${paymentMethod === 'moncash' ? 'active-moncash' : ''}`}
                onClick={() => setPaymentMethod('moncash')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="payment-icon-box moncash-box">
                    <Smartphone size={18} color="#C41230" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1A201C' }}>MonCash</div>
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
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1A201C' }}>Kat Kredi</div>
                    <div style={{ fontSize: 11, color: '#6B6864' }}>Diaspora • $2.99 USD</div>
                  </div>
                </div>
                {paymentMethod === 'card' && <CheckCircle2 size={18} color="#2B4736" />}
              </div>

            </div>
          </div>

          {/* Nimewo MonCash si chwazi */}
          {paymentMethod === 'moncash' && (
            <div className="form-group-clean moncash-input-anim">
              <label className="form-label-clean">
                <span>Nimewo telefòn MonCash ou :</span>
              </label>
              <input
                type="tel"
                placeholder="+509 XXXX-XXXX"
                className="form-input-clean"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          )}

          {/* Bouton Aksyon */}
          <div style={{ marginTop: 22 }}>
            <button type="submit" disabled={isSubmitting} className="btn-validate-personalize">
              <Gift size={18} />
              <span>{isSubmitting ? 'Ap prepare kat ou an...' : 'Valide epi wè kat la (100 Goud)'}</span>
            </button>
            
            <div className="security-footer-note">
              <ShieldCheck size={13} />
              <span>Peman an sekirite • Lyen inik ou an ap pare touswit</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
