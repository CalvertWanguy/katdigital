import React, { useState, useEffect } from 'react';
import { X, User, Edit3, Eye, Music, Volume2, VolumeX, Upload, Trash2 } from 'lucide-react';
import { PRESET_MESSAGES } from '../data/templates';
import { MUSIC_OPTIONS, playHolidaySoundtrack, stopHolidaySoundtrack } from '../utils/audioSynthesizer';

export default function PersonalizeModal({ template, onClose, onSaveAndPreview }) {
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('fanmi');
  const [customMessage, setCustomMessage] = useState(PRESET_MESSAGES[0].text);
  const [selectedMusic, setSelectedMusic] = useState(template?.defaultMusic || 'jingle_bells');
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

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
      stopHolidaySoundtrack();
    };
  }, []);

  const handleSelectCategory = (presetId) => {
    setSelectedPreset(presetId);
    const found = PRESET_MESSAGES.find((m) => m.id === presetId);
    if (found) {
      setCustomMessage(found.text);
    }
  };

  const handleDeviceAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCustomAudioUrl(blobUrl);
      setUploadedFileName(file.name);
      stopHolidaySoundtrack();
      playHolidaySoundtrack('custom', blobUrl);
      setIsPlayingPreview(true);
    }
  };

  const handleRemoveUploadedAudio = () => {
    stopHolidaySoundtrack();
    setIsPlayingPreview(false);
    setCustomAudioUrl('');
    setUploadedFileName('');
  };

  const handleTogglePreviewAudio = (musicId) => {
    if (isPlayingPreview && selectedMusic === musicId && !uploadedFileName) {
      stopHolidaySoundtrack();
      setIsPlayingPreview(false);
    } else {
      setSelectedMusic(musicId);
      stopHolidaySoundtrack();
      playHolidaySoundtrack(musicId, uploadedFileName ? customAudioUrl : null);
      setIsPlayingPreview(true);
    }
  };

  const handleValidate = (e) => {
    e.preventDefault();
    if (!recipient.trim() || !sender.trim()) {
      alert('Tanpri mete non moun k ap resevwa kat la ak non pa w.');
      return;
    }

    stopHolidaySoundtrack();

    onSaveAndPreview({
      recipient,
      sender,
      message: customMessage,
      heading: template.heading,
      musicId: uploadedFileName ? 'custom' : selectedMusic,
      customAudioUrl: customAudioUrl || null
    });
  };

  return (
    <div
      className="customizer-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopHolidaySoundtrack();
          onClose();
        }
      }}
    >
      <div className="customizer-card">
        
        {/* Antèt Modal la */}
        <div className="customizer-header">
          <div>
            <span className="customizer-badge" style={{ color: template.envelopeColor, background: `${template.envelopeColor}14` }}>
              Modèl : {template.title}
            </span>
            <h3 className="customizer-title">Pèsonalize Kat Pa w la</h3>
          </div>
          <button
            onClick={() => {
              stopHolidaySoundtrack();
              onClose();
            }}
            className="customizer-close-btn"
            aria-label="Fèmen"
          >
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

          {/* Chwazi Mizik oswa Telechaje nan telefòn / aparèy */}
          <div className="form-group-clean">
            <label className="form-label-clean" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Music size={13} style={{ color: 'var(--primary-green)' }} />
                <span>Mizik Anbyans Kat la :</span>
              </div>
            </label>

            {/* Zòn Telechaje Mizik nan Aparèy la */}
            <div style={{ marginBottom: 12 }}>
              <input
                type="file"
                id="device-audio-upload"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={handleDeviceAudioUpload}
              />

              {uploadedFileName ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#F0F7F2',
                    border: '1.5px solid #2B4736',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                    <Volume2 size={15} color="#2B4736" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3326', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {uploadedFileName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <button
                      type="button"
                      style={{
                        background: 'var(--primary-green)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleTogglePreviewAudio('custom')}
                    >
                      {isPlayingPreview ? 'Kanpe' : 'Tande l'}
                    </button>
                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#C41230',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                      onClick={handleRemoveUploadedAudio}
                      title="Retire mizik sa a"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="device-audio-upload"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: '#FFFFFF',
                    border: '1.5px dashed #2B4736',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#2B4736',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Upload size={14} />
                  <span>Chwazi yon mizik nan aparèy ou (Telefòn / Òdinatè)</span>
                </label>
              )}
            </div>

            {/* Oubyen chwazi nan melodi fèt entegre yo */}
            <span style={{ fontSize: 11, color: '#777', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Oubyen chwazi yon bèl melodi fèt entegre :
            </span>
            <div className="preset-pill-list">
              {MUSIC_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`preset-pill-item ${selectedMusic === m.id && !uploadedFileName ? 'active' : ''}`}
                  onClick={() => {
                    handleRemoveUploadedAudio();
                    handleTogglePreviewAudio(m.id);
                  }}
                >
                  {isPlayingPreview && selectedMusic === m.id && !uploadedFileName ? (
                    <Volume2 size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  ) : (
                    <Music size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  )}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bouton Wè Kijan l ap Soti (Aperçu direct sans barrière) */}
          <div style={{ marginTop: 18 }}>
            <button type="submit" className="btn-validate-personalize">
              <Eye size={18} />
              <span>Wè Kijan l ap Soti (Aperçu)</span>
            </button>
            
            <div className="security-footer-note">
              <span>W ap ka tande mizik ou an epi wè animasyon an anvan w pataje oswa peye</span>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
