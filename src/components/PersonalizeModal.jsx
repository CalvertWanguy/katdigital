import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  NotePencil,
  Eye,
  MusicNotes,
  SpeakerHigh,
  SpeakerSlash,
  UploadSimple,
  Trash,
  WarningCircle
} from '@phosphor-icons/react';
import { PRESET_MESSAGES } from '../data/templates';
import { MUSIC_OPTIONS, playHolidaySoundtrack, stopHolidaySoundtrack } from '../utils/audioSynthesizer';

export default function PersonalizeModal({ template, onClose, onSaveAndPreview }) {
  const [activeTab, setActiveTab] = useState('message'); // 'message' | 'music'
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [customHeading, setCustomHeading] = useState(template?.heading || 'Bòn Fèt Nwèl & Lapè nan Kè');
  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('fanmi');
  const [customMessage, setCustomMessage] = useState(PRESET_MESSAGES[0].text);
  const [selectedMusic, setSelectedMusic] = useState(template?.defaultMusic || 'deck_the_halls');
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Kalkile limit tèks optimal selon fòma ak tèm kat la
  const maxChars = template?.maxChars || (
    template?.format === 'parchment' ? 420 :
    template?.format === 'bifold' ? 380 :
    template?.format === 'kraft_sheet' ? 350 : 320
  );

  // Verrouiller le défilement de l'arrière-plan de manière absolue
  useEffect(() => {
    stopHolidaySoundtrack(true);
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
      stopHolidaySoundtrack(true);
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
      setActiveTab('message');
      setValidationError('Tanpri mete non moun k ap resevwa kat la ak non pa w.');
      setTimeout(() => setValidationError(''), 4500);
      return;
    }

    stopHolidaySoundtrack();

    onSaveAndPreview({
      recipient: recipient.trim(),
      sender: sender.trim(),
      message: customMessage.trim(),
      heading: customHeading.trim() || template.heading,
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
            <span className="customizer-model-tag">
              Modèl : {template.title}
            </span>
            <h3 className="customizer-heading">Pèsonalize Kat Pa w la</h3>
          </div>

          <button
            onClick={() => {
              stopHolidaySoundtrack();
              onClose();
            }}
            className="customizer-close-btn"
            aria-label="Fèmen"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Bouton Onglet Navigasyon zanmitay (1. Mesaj | 2. Mizik) */}
        <div className="customizer-tabs">
          <button
            type="button"
            className={`customizer-tab-btn ${activeTab === 'message' ? 'active' : ''}`}
            onClick={() => setActiveTab('message')}
          >
            <NotePencil size={15} weight="regular" />
            <span>1. Mesaj Kat la</span>
          </button>

          <button
            type="button"
            className={`customizer-tab-btn ${activeTab === 'music' ? 'active' : ''}`}
            onClick={() => setActiveTab('music')}
          >
            <MusicNotes size={15} weight="regular" />
            <span>2. Mizik & Anbyans</span>
            {uploadedFileName && <span className="customizer-tab-badge-dot" />}
          </button>
        </div>

        {validationError && (
          <div className="customizer-error-banner" role="alert">
            <WarningCircle size={16} weight="regular" className="error-banner-icon" />
            <span className="error-banner-text">{validationError}</span>
            <button
              type="button"
              className="btn-banner-close"
              onClick={() => setValidationError('')}
              aria-label="Fèmen"
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        )}

        <form onSubmit={handleValidate} className="customizer-form-wrap">
          {/* Zòn Fòmilè a ak Défilement Pwòp */}
          <div className="customizer-body">
            {activeTab === 'message' ? (
              <div className="tab-pane-fade">
                {/* 1. Tit kat la (anlè a) - Premye chan */}
                <div className="form-field-wrap">
                  <div className="form-field-header-row">
                    <label className="form-field-label">
                      <NotePencil size={14} weight="regular" style={{ color: 'var(--primary-green)' }} />
                      <span>Tit kat la (anlè a) :</span>
                    </label>
                    <span className="form-field-helper">Ou ka chanje tèks sa a tou</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Ex: Bòn Fèt Nwèl & Lapè nan Kè..."
                    className="form-input-modern"
                    value={customHeading}
                    onChange={(e) => setCustomHeading(e.target.value)}
                    maxLength={55}
                    required
                  />
                </div>

                {/* 2. Moun yo (Destinataire & Expéditeur) */}
                <div className="form-row-2">
                  <div className="form-field-wrap">
                    <label className="form-field-label">
                      <User size={14} weight="regular" style={{ color: 'var(--primary-green)' }} />
                      <span>Pou ki moun ?</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Vanessa, Manman cheri..."
                      className="form-input-modern"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field-wrap">
                    <label className="form-field-label">
                      <User size={14} weight="regular" style={{ color: 'var(--primary-green)' }} />
                      <span>De ki moun ? (Non pa w)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: David, Pitit ou..."
                      className="form-input-modern"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* 3. Seleksyon Modèl Mesaj Rapid (2 pa defo + bouton Wè plis) */}
                <div className="form-field-wrap">
                  <div className="form-field-header-row">
                    <label className="form-field-label">
                      <span>Chwazi yon modèl mesaj :</span>
                    </label>
                    <button
                      type="button"
                      className="btn-toggle-presets"
                      onClick={() => setShowAllPresets(!showAllPresets)}
                    >
                      {showAllPresets ? 'Mwens modèl' : '+ Wè plis modèl'}
                    </button>
                  </div>
                  <div className="preset-pill-grid">
                    {(showAllPresets ? PRESET_MESSAGES : PRESET_MESSAGES.slice(0, 2)).map((msg) => (
                      <button
                        key={msg.id}
                        type="button"
                        className={`preset-pill-modern ${selectedPreset === msg.id ? 'active' : ''}`}
                        onClick={() => handleSelectCategory(msg.id)}
                      >
                        <span>{msg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Tèks Mesaj la ak bouton Efase rapid */}
                <div className="form-field-wrap" style={{ marginBottom: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="form-field-header-row">
                    <label className="form-field-label">
                      <span>Tèks kat la :</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {customMessage && (
                        <button
                          type="button"
                          className="btn-clear-textarea"
                          onClick={() => setCustomMessage('')}
                          title="Efase tout tèks la d'un coup"
                        >
                          <Trash size={13} weight="regular" />
                          <span>Efase tèks la</span>
                        </button>
                      )}
                      <span className="form-field-helper" style={{ fontWeight: 600, color: customMessage.length >= maxChars ? '#C41230' : '#8C877D' }}>
                        {customMessage.length} / {maxChars}
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    className="form-textarea-modern"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    maxLength={maxChars}
                    placeholder="Ekri pawòl ou ak tout kè w la a..."
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="tab-pane-fade">
                {/* Tab 2 : Seleksyon Mizik & Melodi */}
                <div className="music-section-intro">
                  <span className="form-field-label">
                    <MusicNotes size={14} weight="regular" style={{ color: 'var(--primary-green)' }} />
                    <span>Chwazi yon melodi fèt pou akonpaye ouvèti kat la :</span>
                  </span>
                </div>

                <div className="music-cards-list">
                  {MUSIC_OPTIONS.map((m) => {
                    const isSelected = selectedMusic === m.id && !uploadedFileName;
                    const isPlayingThis = isPlayingPreview && isSelected;

                    return (
                      <div
                        key={m.id}
                        className={`music-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          handleRemoveUploadedAudio();
                          handleTogglePreviewAudio(m.id);
                        }}
                      >
                        <div className="music-option-left">
                          <div className={`music-icon-bubble ${isSelected ? 'selected' : ''}`}>
                            {m.id === 'none' ? <SpeakerSlash size={16} weight="regular" /> : <MusicNotes size={16} weight="regular" />}
                          </div>
                          <div className="music-option-text-wrap">
                            <div className="music-option-name">{m.label}</div>
                            <div className="music-option-desc">{m.desc}</div>
                          </div>
                        </div>

                        {m.id !== 'none' && (
                          <button
                            type="button"
                            className={`music-listen-btn ${isPlayingThis ? 'playing' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePreviewAudio(m.id);
                            }}
                          >
                            {isPlayingThis ? <SpeakerHigh size={14} weight="regular" /> : <SpeakerSlash size={14} weight="regular" />}
                            <span>{isPlayingThis ? 'K ap jwe' : 'Koute'}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Telechaje pwòp vwa oswa mizik pa w */}
                <div className="music-upload-section">
                  <input
                    type="file"
                    id="device-audio-upload"
                    accept="audio/*"
                    style={{ display: 'none' }}
                    onChange={handleDeviceAudioUpload}
                  />

                  {uploadedFileName ? (
                    <div className="uploaded-audio-banner">
                      <div className="uploaded-audio-meta">
                        <SpeakerHigh size={17} weight="regular" color="var(--primary-green)" />
                        <span className="uploaded-audio-filename">{uploadedFileName}</span>
                      </div>
                      <div className="uploaded-audio-actions">
                        <button
                          type="button"
                          className="btn-uploaded-listen"
                          onClick={() => handleTogglePreviewAudio('custom')}
                        >
                          {isPlayingPreview ? 'Kanpe' : 'Koute'}
                        </button>
                        <button
                          type="button"
                          className="btn-uploaded-delete"
                          onClick={handleRemoveUploadedAudio}
                          title="Retire dosye sa a"
                        >
                          <Trash size={15} weight="regular" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label htmlFor="device-audio-upload" className="music-upload-dropzone">
                      <div className="upload-circle-icon">
                        <UploadSimple size={16} weight="regular" />
                      </div>
                      <div className="upload-text-group">
                        <strong>Oubyen telechaje yon vwa oswa mizik pa w</strong>
                        <span>Fòma MP3, M4A oswa WAV nan telefòn oswa òdinatè w</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Ba Aksyon Fikse anba (Sticky Footer - Toujou Vizib) */}
          <div className="customizer-footer">
            <button type="submit" className="btn-validate-modern">
              <Eye size={17} weight="regular" />
              <span>Wè Kijan l ap Soti (Aperçu)</span>
            </button>
            <p className="customizer-footer-note">
              Gratis pou wè démo a • Pataje l kote w vle pou sèlman <strong>100&nbsp;Goud</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
