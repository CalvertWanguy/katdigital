import React, { useState } from 'react';
import { TEMPLATES } from './data/templates';
import EnvelopeViewerModal from './components/EnvelopeViewerModal';
import PersonalizeModal from './components/PersonalizeModal';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [customizerTemplate, setCustomizerTemplate] = useState(null);
  const [customData, setCustomData] = useState(null);

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
    setActiveTemplate(customizerTemplate);
  };

  return (
    <div>
      {/* 1. En-tête Navigation */}
      <header className="header-nav">
        <a href="#" className="brand-logo">
          KatDigital <span>Collection</span>
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
            Découvrir une Démo
          </button>
        </div>
      </header>

      {/* 2. Bannière d'accueil & Filtres en Pilules sobres */}
      <section className="hero-section">
        <div className="hero-subtitle">Édition Spéciale Fin d'Année 2026 - 2027</div>
        <h1 className="hero-title">
          Partagez des vœux inoubliables,<br />directement sur WhatsApp.
        </h1>
        <p className="hero-desc">
          Une expérience de papeterie digitale haut de gamme. Sélectionnez un modèle avec ouverture animée, personnalisez vos messages et surprenez vos proches pour seulement <strong>100 HTG</strong>.
        </p>

        {/* Pilules de catégories sobres sans émojis */}
        <div className="categories-bar">
          <div
            className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            Tous les Modèles
          </div>
          <div
            className={`category-pill ${selectedCategory === 'noel' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('noel')}
          >
            Noël Classique
          </div>
          <div
            className={`category-pill ${selectedCategory === 'nouvel-an' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('nouvel-an')}
          >
            Nouvel An 2027
          </div>
          <div
            className={`category-pill ${selectedCategory === 'tradition' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('tradition')}
          >
            1er Janvier & Traditions
          </div>
          <div
            className={`category-pill ${selectedCategory === 'mennaj' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('mennaj')}
          >
            Messages Personnels
          </div>
        </div>
      </section>

      {/* 3. Catalogue de Cartes */}
      <main className="catalog-container">
        <div className="section-heading">
          <span>Modèles Disponibles ({filteredTemplates.length})</span>
          <span style={{ fontSize: 13, color: '#C39D5E', cursor: 'pointer', fontWeight: 600 }}>
            Nouvelles éditions chaque semaine
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
              <div className="card-meta-desc">{template.subtitle} • Animation 3D & Audio</div>

              <div className="card-meta-footer">
                <span className="price-pill">{template.priceHTG} HTG</span>
                <span className="btn-view-demo">
                  Ouvrir <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 4. Modal Visionneuse Enveloppe */}
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
