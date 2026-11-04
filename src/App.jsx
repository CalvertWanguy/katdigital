import React, { useState } from 'react';
import { TEMPLATES } from './data/templates';
import EnvelopeViewerModal from './components/EnvelopeViewerModal';
import PersonalizeModal from './components/PersonalizeModal';
import { Sparkles, Heart, Gift, Send, ArrowRight } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [customizerTemplate, setCustomizerTemplate] = useState(null);
  const [customData, setCustomData] = useState(null);

  // Filtrage par catégorie
  const filteredTemplates = TEMPLATES.filter((t) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'noel') return t.category === 'noel';
    if (selectedCategory === 'nouvel-an') return t.category === 'nouvel-an';
    if (selectedCategory === 'tradition') return t.category === 'tradition';
    if (selectedCategory === 'mennaj') return t.category === 'mennaj';
    return true;
  });

  const handleOpenDemo = (template) => {
    setActiveTemplate(template);
  };

  const handleOpenCustomizer = (template) => {
    setCustomizerTemplate(template);
  };

  const handleSaveAndPreview = (data) => {
    setCustomData(data);
    setCustomizerTemplate(null);
    // Ouvre immédiatement la visionneuse avec les données personnalisées
    setActiveTemplate(customizerTemplate);
  };

  return (
    <div>
      {/* 1. En-tête Navigation (Style Evite / Greenvelope) */}
      <header className="header-nav">
        <a href="#" className="brand-logo">
          KatDijital <span>Collection</span>
        </a>
        <div className="nav-tagline">Cartes & Vœux digitaux festifs pour WhatsApp</div>
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
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Wè yon Démo
          </button>
        </div>
      </header>

      {/* 2. Bannière d'accueil & Filtres en Pilules */}
      <section className="hero-section">
        <div className="hero-subtitle">Édition Spéciale Fèt Fen Dane 2026 - 2027</div>
        <h1 className="hero-title">
          Voye bèl vœux ki pap janm efase,<br />dirèkteman sou WhatsApp.
        </h1>
        <p className="hero-desc">
          Pa bezwen al nan lari chache kat fizik. Chwazi yon bèl modèl ki ouvri an 3D, mete bèl pawòl kreyòl oswa franse, epi fè moun ou renmen yo plezi pou sèlman <strong>100 Goud</strong>.
        </p>

        {/* Pilules de catégories Evite */}
        <div className="categories-bar">
          <div
            className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            🌟 Tout Modèl yo
          </div>
          <div
            className={`category-pill ${selectedCategory === 'noel' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('noel')}
          >
            🎄 Nwèl
          </div>
          <div
            className={`category-pill ${selectedCategory === 'nouvel-an' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('nouvel-an')}
          >
            ✨ Bòn Ane 2027
          </div>
          <div
            className={`category-pill ${selectedCategory === 'tradition' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('tradition')}
          >
            🇭🇹 1ye Janvye & Soup Joumou
          </div>
          <div
            className={`category-pill ${selectedCategory === 'mennaj' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('mennaj')}
          >
            ❤️ Pou Mennaj
          </div>
        </div>
      </section>

      {/* 3. Catalogue de Cartes */}
      <main className="catalog-container">
        <div className="section-heading">
          <span>Modèl Disponib yo ({filteredTemplates.length})</span>
          <span style={{ fontSize: 13, color: '#C39D5E', cursor: 'pointer', fontWeight: 600 }}>
            Nouvo modèl chak semèn →
          </span>
        </div>

        <div className="card-grid">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="preview-item"
              onClick={() => handleOpenDemo(template)}
            >
              {/* Mockup enveloppe + carte */}
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

              {/* Titre et détails */}
              <div className="card-meta-title">{template.title}</div>
              <div className="card-meta-desc">{template.subtitle} • Animasyon 3D & Mizik</div>

              <div className="card-meta-footer">
                <span className="price-pill">{template.priceHTG} HTG</span>
                <span className="btn-view-demo">
                  Ouvri Démo <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. Modal Visionneuse Enveloppe (Style Greenvelope) */}
      {activeTemplate && (
        <EnvelopeViewerModal
          template={activeTemplate}
          customData={customData}
          onClose={() => {
            setActiveTemplate(null);
            setCustomData(null);
          }}
          onOpenCustomizer={(t) => {
            setActiveTemplate(null);
            handleOpenCustomizer(t);
          }}
        />
      )}

      {/* 5. Modal Personnalisation */}
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
