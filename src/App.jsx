import React, { useState, useEffect } from 'react';
import { TEMPLATES } from './data/templates';
import EnvelopeViewerModal from './components/EnvelopeViewerModal';
import PersonalizeModal from './components/PersonalizeModal';
import { stopHolidaySoundtrack } from './utils/audioSynthesizer';
import {
  LayoutGrid,
  Gift,
  Star,
  Bookmark,
  Heart,
  ArrowRight,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
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
    const matchesCategory =
      selectedCategory === 'all' || t.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q) ||
      t.heading.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.defaultMessage.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
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

  const getCategoryLabel = () => {
    switch (selectedCategory) {
      case 'noel': return 'Nwèl Tradisyonèl';
      case 'nouvel-an': return 'Bòn Ane 2027';
      case 'tradition': return '1ye Janvye & Tradisyon';
      case 'mennaj': return 'Mesaj Lanmou';
      default: return 'Tout Koleksyon yo';
    }
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
            className="btn-header-demo"
          >
            Wè yon Démo
          </button>
        </div>
      </header>

      {/* 2. Bannyè & Rechèch Éditrice (Style Image 2) */}
      <section className="hero-section">
        <h1 className="hero-title">
          Voye bèl swè fèt fen dane,<br />tou dwat nan kè moun ou renmen yo.
        </h1>
        <p className="hero-desc">
          Chwazi yon modèl papetri, ekri pawòl ou ak tout kè w, epi pataje yon souvni inik sou WhatsApp ak rezo sosyal pou sèlman <strong>100 Goud</strong>.
        </p>

        {/* Ba Rechèch & Koleksyon (Style Evite / Greenvelope) */}
        <div className="search-collections-bar">
          <div className="search-bar-inner">
            <span className="search-collections-badge">KOLEKSYON</span>
            <div className="search-input-box">
              <Search size={15} className="search-icon-svg" />
              <input
                type="text"
                placeholder="Chèche yon modèl, tèm, koulè oswa mesaj..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-text-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="btn-search-clear"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="search-breadcrumbs-row">
            <button
              type="button"
              className="crumb-btn"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            >
              Tout Modèl
            </button>
            <span className="crumb-sep">/</span>
            <span>Kat Dijital</span>
            <span className="crumb-sep">/</span>
            <strong className="crumb-active">{getCategoryLabel()}</strong>

            <button
              type="button"
              className={`btn-stationery-filter ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={12} />
              <span>FILTÈ</span>
            </button>
          </div>
        </div>

        {/* Filtè Kategori an Pilil Éditrice */}
        {showFilters && (
          <div className="categories-bar">
            <button
              type="button"
              className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <LayoutGrid size={13} />
              <span>Tout Modèl yo</span>
            </button>

            <button
              type="button"
              className={`category-pill ${selectedCategory === 'noel' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('noel')}
            >
              <Gift size={13} />
              <span>Nwèl Tradisyonèl</span>
            </button>

            <button
              type="button"
              className={`category-pill ${selectedCategory === 'nouvel-an' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('nouvel-an')}
            >
              <Star size={13} />
              <span>Bòn Ane 2027</span>
            </button>

            <button
              type="button"
              className={`category-pill ${selectedCategory === 'tradition' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('tradition')}
            >
              <Bookmark size={13} />
              <span>1ye Janvye & Tradisyon</span>
            </button>

            <button
              type="button"
              className={`category-pill ${selectedCategory === 'mennaj' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('mennaj')}
            >
              <Heart size={13} />
              <span>Mesaj Lanmou</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. Katalòg Kat */}
      <main className="catalog-container">
        <div className="section-heading">
          <span>Modèl ki Disponib yo ({filteredTemplates.length})</span>
          <span style={{ fontSize: 13, color: '#C39D5E', cursor: 'pointer', fontWeight: 600 }}>
            {filteredTemplates.length === 0 ? 'Okenn rezilta jwenn' : 'Koleksyon Ofisyèl 2026 - 2027'}
          </span>
        </div>

        {filteredTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6B6864' }}>
            <p style={{ fontSize: 16, marginBottom: 12 }}>Nou pa jwenn okenn modèl pou « {searchQuery} ».</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="btn-header-demo"
              style={{ display: 'inline-block' }}
            >
              Wè tout modèl yo
            </button>
          </div>
        ) : (
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

                <div className="card-meta-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{template.title}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                      color: template.accentColor,
                      background: '#FAF6EE',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: '1px solid #EADBBE'
                    }}
                  >
                    {template.format === 'parchment'
                      ? 'Pachemen'
                      : template.format === 'bifold'
                      ? 'Liv Papetri'
                      : template.format === 'kraft_sheet'
                      ? 'Lèt Kraft'
                      : 'Anvlòp De Liks'}
                  </span>
                </div>
                <div className="card-meta-desc">
                  {template.subtitle} • {template.ambientAnimation === 'snow' ? 'Flokon Nèj' : template.ambientAnimation === 'hearts' ? 'Kè Damou' : 'Poud Zétwal'} • Avèk Mizik
                </div>

                <div className="card-meta-footer">
                  <span className="price-pill">{template.priceHTG} Goud</span>
                  <span className="btn-view-demo">
                    Ouvri <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. Modal Ouvèti Anvlòp */}
      {activeTemplate && (
        <EnvelopeViewerModal
          template={activeTemplate}
          customData={customData}
          isDirectView={isDirectRecipientView}
          onClose={() => {
            stopHolidaySoundtrack();
            setActiveTemplate(null);
            setCustomData(null);
            if (isDirectRecipientView) {
              window.history.replaceState({}, '', '/');
            }
          }}
          onOpenCustomizer={(t) => {
            stopHolidaySoundtrack();
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
