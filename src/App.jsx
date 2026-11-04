import React, { useState, useEffect } from 'react';
import { TEMPLATES } from './data/templates';
import EnvelopeViewerModal from './components/EnvelopeViewerModal';
import PersonalizeModal from './components/PersonalizeModal';
import {
  LayoutGrid,
  Gift,
  Star,
  Bookmark,
  Heart,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [customizerTemplate, setCustomizerTemplate] = useState(null);
  const [customData, setCustomData] = useState(null);
  const [isDirectRecipientView, setIsDirectRecipientView] = useState(false);

  // Deteksyon yon lyen inik destinataire nan URL la
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const to = params.get('to');
      const from = params.get('from');
      const themeId = params.get('theme');
      const msg = params.get('msg');

      if (to && from) {
        const matchedTemplate = TEMPLATES.find((t) => t.id === themeId) || TEMPLATES[0];
        setCustomData({
          recipient: decodeURIComponent(to),
          sender: decodeURIComponent(from),
          message: msg ? decodeURIComponent(msg) : matchedTemplate.defaultMessage,
          heading: matchedTemplate.heading
        });
        setActiveTemplate(matchedTemplate);
        setIsDirectRecipientView(true);
      }
    }
  }, []);

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'noel') return t.category === 'noel';
    if (selectedCategory === 'nouvel-an') return t.category === 'nouvel-an';
    if (selectedCategory === 'tradition') return t.category === 'tradition';
    if (selectedCategory === 'mennaj') return t.category === 'mennaj';
    return true;
  });

  const handleOpenDemo = (template) => {
    setCustomData(null);
    setIsDirectRecipientView(false);
    setActiveTemplate(template);
  };

  const handleOpenCustomizer = (template) => {
    setCustomizerTemplate(template);
  };

  const handleSaveAndPreview = (data) => {
    setCustomData(data);
    setCustomizerTemplate(null);
    setActiveTemplate(customizerTemplate);
  };

  return (
    <div>
      {/* 1. Antèt Navigasyon */}
      <header className="header-nav">
        <a href="/" className="brand-logo">
          KatDigital <span>Koleksyon</span>
        </a>
        <div className="nav-tagline">Bèl Kat Vœux & Swè Dijital pou Fèt Fen Dane</div>
        <div>
          <button
            onClick={() => handleOpenDemo(TEMPLATES[0])}
            style={{
              background: '#2B4736',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              padding: '9px 18px',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Wè yon Démo
          </button>
        </div>
      </header>

      {/* 2. Bannyè ak Filtè Kategori */}
      <section className="hero-section">
        <div className="hero-subtitle">Koleksyon Espesyal Fèt Fen Dane 2026 - 2027</div>
        <h1 className="hero-title">
          Voye bèl swè ki pap janm efase,<br />fasilman bay tout moun ou renmen.
        </h1>
        <p className="hero-desc">
          Yon eksperyans papetri dijital kalite siperyè ak bèl anvlòp 3D ki ouvri. Chwazi yon modèl, pèsonalize pawòl ou, epi pataje l fasilman sou WhatsApp, rezo sosyal oswa mesaj pou sèlman <strong>100 Goud</strong>.
        </p>

        <div className="categories-bar">
          <button
            type="button"
            className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <LayoutGrid size={14} />
            <span>Tout Modèl yo</span>
          </button>

          <button
            type="button"
            className={`category-pill ${selectedCategory === 'noel' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('noel')}
          >
            <Gift size={14} />
            <span>Nwèl Tradisyonèl</span>
          </button>

          <button
            type="button"
            className={`category-pill ${selectedCategory === 'nouvel-an' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('nouvel-an')}
          >
            <Star size={14} />
            <span>Bòn Ane 2027</span>
          </button>

          <button
            type="button"
            className={`category-pill ${selectedCategory === 'tradition' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('tradition')}
          >
            <Bookmark size={14} />
            <span>1ye Janvye & Tradisyon</span>
          </button>

          <button
            type="button"
            className={`category-pill ${selectedCategory === 'mennaj' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('mennaj')}
          >
            <Heart size={14} />
            <span>Mesaj Lanmou</span>
          </button>
        </div>
      </section>

      {/* 3. Katalòg Kat */}
      <main className="catalog-container">
        <div className="section-heading">
          <span>Modèl ki Disponib yo ({filteredTemplates.length})</span>
          <span style={{ fontSize: 13, color: '#C39D5E', cursor: 'pointer', fontWeight: 600 }}>
            Nouvo modèl chak semèn
          </span>
        </div>

        <div className="card-grid">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="preview-item"
              onClick={() => handleOpenDemo(template)}
            >
              <div className="mockup-frame">
                <div
                  className="mockup-env"
                  style={{ background: template.envelopeColor }}
                />
                <div className="mockup-card-content">
                  <span
                    style={{
                      fontSize: '9px',
                      letterSpacing: '1.5px',
                      color: template.accentColor,
                      textTransform: 'uppercase',
                      fontWeight: 700
                    }}
                  >
                    {template.subtitle}
                  </span>
                  <div
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: template.envelopeColor,
                      margin: '6px 0',
                      fontStyle: 'italic'
                    }}
                  >
                    {template.title}
                  </div>
                  <p style={{ fontSize: '10px', color: '#736E65', lineHeight: 1.4 }}>
                    {template.defaultMessage.slice(0, 58)}...
                  </p>
                </div>

                <div className="mini-stamp" style={{ color: template.stampColor, borderColor: template.stampColor }}>
                  {template.stampText}
                </div>
              </div>

              <div className="card-meta-title">{template.title}</div>
              <div className="card-meta-desc">{template.subtitle} • Animasyon 3D & Mizik</div>

              <div className="card-meta-footer">
                <span className="price-pill">{template.priceHTG} Goud</span>
                <span className="btn-view-demo">
                  Ouvri <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. Modal Ouvèti Anvlòp */}
      {activeTemplate && (
        <EnvelopeViewerModal
          template={activeTemplate}
          customData={customData}
          isDirectView={isDirectRecipientView}
          onClose={() => {
            setActiveTemplate(null);
            setCustomData(null);
            if (isDirectRecipientView) {
              window.history.replaceState({}, '', '/');
            }
          }}
          onOpenCustomizer={(t) => {
            setActiveTemplate(null);
            handleOpenCustomizer(t);
          }}
        />
      )}

      {/* 5. Modal Pèsonalizasyon */}
      {customizerTemplate && (
        <PersonalizeModal
          template={customizerTemplate}
          onClose={() => setCustomizerTemplate(null)}
          onSaveAndPreview={handleSaveAndPreview}
        />
      )}
    </div>
  );
}
