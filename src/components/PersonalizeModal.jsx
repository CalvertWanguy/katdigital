import React, { useState, useEffect } from 'react';
import { X, User, Edit3, Eye } from 'lucide-react';
import { PRESET_MESSAGES } from '../data/templates';

export default function PersonalizeModal({ template, onClose, onSaveAndPreview }) {
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('fanmi');
  const [customMessage, setCustomMessage] = useState(PRESET_MESSAGES[0].text);

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

    onSaveAndPreview({
      recipient,
      sender,
      message: customMessage,
      heading: template.heading
    });
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
          
          {/* Moun yo */}
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

          {/* Seleksyon Mesaj Rapid an Pilil */}
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

          {/* Bouton Wè Kijan l ap Soti (Aperçu direct sans barrière) */}
          <div style={{ marginTop: 20 }}>
            <button type="submit" className="btn-validate-personalize">
              <Eye size={18} />
              <span>Wè Kijan l ap Soti (Aperçu)</span>
            </button>
            
            <div className="security-footer-note">
              <span>Ou pral wè bèl anvlòp la ouvri ak non w anvan w peye</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
