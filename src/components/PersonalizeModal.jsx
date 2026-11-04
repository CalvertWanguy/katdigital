import React, { useState } from 'react';
import { X, Smartphone, CreditCard, Gift, Check } from 'lucide-react';
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
      alert('Veuillez renseigner le destinataire et votre nom.');
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
              Personnalisation de la Carte
            </h3>
            <span style={{ fontSize: 12, color: '#6B6864' }}>Modèle : {template.title}</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6864' }}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleValidate}>
          <div className="form-group">
            <label className="form-label">Destinataire (Nom ou prénom de la personne)</label>
            <input
              type="text"
              placeholder="Ex: Vanessa, Chers Parents, Jean..."
              className="form-input"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expéditeur (Votre nom)</label>
            <input
              type="text"
              placeholder="Ex: David, Votre fils..."
              className="form-input"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sélectionner un message suggéré :</label>
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
            <label className="form-label">Message personnalisé :</label>
            <textarea
              rows={4}
              className="form-textarea"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label">Option de règlement (100 HTG / $2.99 USD) :</label>
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
                <span>Carte bancaire ($2.99)</span>
              </div>
            </div>
          </div>

          {paymentMethod === 'moncash' && (
            <div className="form-group">
              <label className="form-label">Numéro MonCash :</label>
              <input
                type="tel"
                placeholder="+509 XXXX-XXXX"
                className="form-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          )}

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
            <Gift size={18} />
            {isSubmitting ? 'Validation en cours...' : 'Valider & Générer la carte (100 HTG)'}
          </button>
        </form>
      </div>
    </div>
  );
}
