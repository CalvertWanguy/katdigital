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
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  MoreHorizontal
} from 'lucide-react';

const CATEGORY_SECTIONS = [
  {
    id: 'noel',
    title: 'Nwèl Tradisyonèl',
    subtitle: 'Bèl kat Nwèl vlou, zetwal ak melodi fèt',
    icon: Gift
  },
  {
    id: 'nouvel-an',
    title: 'Bòn Ane 2027 & Siksè',
    subtitle: 'Pachemen wayal, liv papetri folio ak swè siksè',
    icon: Star
  },
  {
    id: 'tradition',
    title: '1ye Janvye & Tradisyon 1804',
    subtitle: 'Fèt Nasyonal, soup joumou ak lespri libète',
    icon: Bookmark
  },
  {
    id: 'mennaj',
    title: 'Mesaj Lanmou & Romantik',
    subtitle: 'Lèt damou sou papye kraft ak kè k ap flote',
    icon: Heart
  }
];

function TemplateCard({ template, onOpenDemo, onOpenCustomizer }) {
  const [showMenu, setShowMenu] = useState(false);

  const getFormatBadge = (fmt) => {
    switch (fmt) {
      case 'parchment': return 'Pachemen';
      case 'bifold': return 'Liv Papetri';
      case 'kraft_sheet': return 'Lèt Kraft';
      default: return 'Anvlòp De Liks';
    }
  };

  return (
    <div className="canva-template-card" onClick={onOpenDemo}>
      {/* Mockup vizyèl */}
      <div className="canva-card-mockup">
        <div
          className="canva-mockup-bg"
          style={{ background: template.envelopeColor }}
        />

        <div className="canva-mockup-sheet">
          <span className="canva-sheet-subtitle">{template.subtitle}</span>
          <div className="canva-sheet-title" style={{ color: template.envelopeColor }}>
            {template.title}
          </div>
          <p className="canva-sheet-text">
            {template.defaultMessage.slice(0, 52)}...
          </p>
        </div>

        {/* Timbre officiel */}
        <div className="canva-card-stamp" style={{ color: template.stampColor, borderColor: template.stampColor }}>
          {template.stampText}
        </div>

        {/* Bouton 3 ti pwen (...) tankou sou Canva */}
        <div className="canva-card-dots-wrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="canva-card-dots-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Opsyon kat sa a"
            title="Opsyon"
          >
            <MoreHorizontal size={15} />
          </button>

          {showMenu && (
            <div className="canva-card-dropdown-menu">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onOpenDemo();
                }}
              >
                <Eye size={13} />
                <span>Ouvri Démo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onOpenCustomizer();
                }}
              >
                <Edit3 size={13} />
                <span>Pèsonalize</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enfòmasyon minimalist tankou Canva : Tit + Fòma ak Pri */}
      <div className="canva-card-info">
        <h3 className="canva-card-title">{template.title}</h3>
        <div className="canva-card-meta">
          <span>{getFormatBadge(template.format)}</span>
          <span className="canva-meta-dot">•</span>
          <span className="canva-price-text">{template.priceHTG} Goud</span>
        </div>
      </div>
    </div>
  );
}

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
      const customH = params.get('h') || params.get('heading');

      if (to && from) {
        const matchedTemplate = TEMPLATES.find((t) => t.id === themeId) || TEMPLATES[0];
        setCustomData({
          recipient: decodeURIComponent(to),
          sender: decodeURIComponent(from),
          message: msg ? decodeURIComponent(msg) : matchedTemplate.defaultMessage,
          heading: customH ? decodeURIComponent(customH) : matchedTemplate.heading
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

  const scrollCarousel = (categoryId, direction) => {
    const el = document.getElementById(`carousel-${categoryId}`);
    if (el) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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
          <span className="brand-name-main">KatDijital</span>{' '}
          <span className="brand-name-sub">Koleksyon</span>
        </a>
        <div className="nav-tagline">Bèl Kat Vœux & Swè Dijital pou Tout Okazyon</div>
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
          Voye bèl kat ak mesaj pèsonalize,<br />tou dwat nan kè moun ou renmen yo.
        </h1>
        <p className="hero-desc">
          Chwazi yon modèl papetri, ekri pawòl ou ak tout kè w, epi pataje yon souvni inik kote w vle pou sèlman <strong>100 Goud</strong>.
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

      {/* 3. Katalòg Kat (Style Canva Templates) */}
      <main className="catalog-container">
        {/* Ka 1 : Rechèch oswa yon sèl kategori filtre */}
        {(searchQuery.trim() !== '' || selectedCategory !== 'all') ? (
          <div>
            <div className="section-heading">
              <div>
                <span>{searchQuery ? `Rezilta pou « ${searchQuery} »` : getCategoryLabel()}</span>
                <span className="canva-results-count">({filteredTemplates.length} modèl)</span>
              </div>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="btn-header-demo"
              >
                Tout modèl yo
              </button>
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
              <div className="canva-filtered-grid">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onOpenDemo={() => handleOpenDemo(template)}
                    onOpenCustomizer={() => handleOpenCustomizer(template)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Ka 2 : Tout Koleksyon yo (Canva Horizontal Slide Rows) */
          <div className="canva-catalog-sections">
            {CATEGORY_SECTIONS.map((cat) => {
              const catTemplates = TEMPLATES.filter((t) => t.category === cat.id);
              if (catTemplates.length === 0) return null;
              const IconComp = cat.icon;

              return (
                <section key={cat.id} className="canva-category-row">
                  {/* Antèt Rangée Canva */}
                  <div className="canva-row-header">
                    <div className="canva-row-title-wrap">
                      <div className="canva-cat-icon-badge">
                        <IconComp size={16} />
                      </div>
                      <div>
                        <h2 className="canva-row-title">{cat.title}</h2>
                        <p className="canva-row-desc">{cat.subtitle}</p>
                      </div>
                    </div>

                    <div className="canva-row-actions">
                      <button
                        type="button"
                        className="canva-btn-view-all"
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        Wè tout ({catTemplates.length})
                      </button>

                      <div className="canva-nav-arrows">
                        <button
                          type="button"
                          className="canva-arrow-btn"
                          onClick={() => scrollCarousel(cat.id, 'left')}
                          aria-label="Glise a goch"
                          title="Glise a goch"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          className="canva-arrow-btn"
                          onClick={() => scrollCarousel(cat.id, 'right')}
                          aria-label="Glise a dwat"
                          title="Glise a dwat"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Piste Carrousel Glisman Orizontal (Slide pour voir tankou Canva) */}
                  <div className="canva-carousel-wrapper">
                    <div
                      id={`carousel-${cat.id}`}
                      className="canva-carousel-track"
                    >
                      {catTemplates.map((template) => (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          onOpenDemo={() => handleOpenDemo(template)}
                          onOpenCustomizer={() => handleOpenCustomizer(template)}
                        />
                      ))}
                    </div>

                    {/* Flèch sikilè Canva (Gòch ak Dwat) pou gide itilizatè yo sou mobil */}
                    <button
                      type="button"
                      className="canva-floating-arrow canva-floating-arrow-prev"
                      onClick={() => scrollCarousel(cat.id, 'left')}
                      aria-label="Wè modèl anvan yo"
                      title="Wè modèl anvan yo"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button
                      type="button"
                      className="canva-floating-arrow canva-floating-arrow-next"
                      onClick={() => scrollCarousel(cat.id, 'right')}
                      aria-label="Wè lòt modèl"
                      title="Wè lòt modèl"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* 4. Footer Minimalis, Simetrik & Épuré */}
      <footer className="app-main-footer">
        <div className="footer-inner-content">
          <div className="footer-logo-text">
            <span className="brand-name-main">KatDijital</span>{' '}
            <span className="brand-name-sub">Koleksyon</span>
          </div>
          <div className="footer-slogan">Kat dijital pèsonalize pou tout okazyon</div>

          <div className="footer-sub-row">
            <span>© 2026 KatDijital Koleksyon</span>
            <span className="footer-bullet">•</span>
            <span>Fèt ak anpil fyète pou tout Ayisyen nan mond lan !</span>
          </div>
        </div>
      </footer>

      {/* 5. Modal Ouvèti Anvlòp */}
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
