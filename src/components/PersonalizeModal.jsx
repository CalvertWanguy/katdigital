import React, { useState } from 'react';
import { X, Check, Smartphone, CreditCard, Sparkles } from 'lucide-react';
import { PRESET_MESSAGES } from '../data/templates';

export default function PersonalizeModal({ template, onClose, onSaveAndPreview }) {
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('fanmi');
  const [customMessage, setCustomMessage] = useState(PRESET_MESSAGES[0].text);
  const [paymentMethod, setPaymentMethod] = useState('moncash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    const found = PRESET_MESSAGES.find((m) => m.id === presetId);
    if (found) {
      setCustomMessage(found.text);
    }
  };

  const handleValidate = (e) => {
    e.preventDefault();
    if (!recipient.trim() || !sender.trim()) {
      alert('Tanpri mete non moun k ap resevwa l la ak non pa w !');
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
    <div className="customizer-modal">
      <div className="customizer-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: '#2B4736' }}>
              Pèsonalize Kat Pa w la
            </h3>
            <span style={{ fontSize: 12, color: '#6B6864' }}>Modèl : {template.title}</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6864' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleValidate}>
          {/* Noms */}
          <div className="form-group">
            <label className="form-label">Pou ki moun ? (Non moun k ap resevwa l la)</label>
            <input
              type="text"
              placeholder="Ex: Vanessa, Manman, Jean..."
              className="form-input"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">De ki moun ? (Non pa w)</label>
            <input
              type="text"
              placeholder="Ex: David, Pitit ou..."
              className="form-input"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              required
            />
          </div>

          {/* Bibliothèque de messages prêts */}
          <div className="form-group">
            <label className="form-label">Chwazi yon bèl mesaj tout pare :</label>
            <select
              className="form-select"
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
            >
              {PRESET_MESSAGES.map((msg) => (
                <option key={msg.id} value={msg.id}>
                  {msg.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Oswa modifye tèks la jan w vle :</label>
            <textarea
              rows={4}
              className="form-textarea"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              required
            />
          </div>

          {/* Moyen de paiement */}
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label">Mwayen peman (100 Goud / $2.99 USD) :</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div
                onClick={() => setPaymentMethod('moncash')}
                style={{
                  border: `2px solid ${paymentMethod === 'moncash' ? '#7A1F2D' : '#E2DCD1'}`,
                  background: paymentMethod === 'moncash' ? '#FAF2F4' : '#FFF',
                  padding: '10px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <Smartphone size={18} color="#7A1F2D" />
                <span>MonCash (100 HTG)</span>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                style={{
                  border: `2px solid ${paymentMethod === 'card' ? '#2B4736' : '#E2DCD1'}`,
                  background: paymentMethod === 'card' ? '#F0F5F2' : '#FFF',
                  padding: '10px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <CreditCard size={18} color="#2B4736" />
                <span>Kat Kredi ($2.99)</span>
              </div>
            </div>
          </div>

          {paymentMethod === 'moncash' && (
            <div className="form-group">
              <label className="form-label">Nimewo Telefòn MonCash ou :</label>
              <input
                type="tel"
                placeholder="+509 XXXX-XXXX"
                className="form-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          )}

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: 'var(--gold-foil)',
              color: '#2B1D04',
              fontWeight: 700,
              fontSize: 14,
              padding: '14px',
              borderRadius: 30,
              border: 'none',
              cursor: 'pointer',
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 6px 18px rgba(195, 157, 94, 0.35)'
            }}
          >
            <Sparkles size={18} />
            {isSubmitting ? 'Ap valide...' : 'Valide & Wè Kat la (100 HTG)'}
          </button>
        </form>
      </div>
    </div>
  );
}
