import React, { useState, useEffect, useRef } from 'react';
import { TEMPLATES } from './data/templates';
import EnvelopeViewerModal from './components/EnvelopeViewerModal';
import PersonalizeModal from './components/PersonalizeModal';
import { stopHolidaySoundtrack } from './utils/audioSynthesizer';
import { initSecurityShield } from './utils/securityShield';
import {
  SquaresFour,
  TreeEvergreen,
  Champagne,
  Scroll,
  HandHeart,
  MagnifyingGlass,
  X,
  CaretLeft,
  CaretRight,
  NotePencil,
  Eye,
  DotsThree
} from '@phosphor-icons/react';

const CATEGORY_SECTIONS = [
  {
    id: 'noel',
    title: 'Nwèl Tradisyonèl',
    subtitle: 'Bèl kat Nwèl vlou, zetwal ak melodi fèt',
    icon: TreeEvergreen
  },
  {
    id: 'nouvel-an',
    title: 'Bòn Ane 2027 & Siksè',
    subtitle: 'Pachemen wayal, liv papetri folio ak swè siksè',
    icon: Champagne
  },
  {
    id: 'tradition',
    title: '1ye Janvye & Tradisyon 1804',
    subtitle: 'Fèt Nasyonal, soup joumou ak lespri libète',
    icon: Scroll
  },
  {
    id: 'mennaj',
    title: 'Mesaj Lanmou & Romantik',
    subtitle: 'Lèt damou sou papye kraft ak kè k ap flote',
    icon: HandHeart
  }
];

/* ==============================================================
   IKÒN & MOTIF GRAFIK POU PREVIEW CHAK KAT (DIVERSIFIE & PALPABLE)
   ============================================================== */
function PreviewSnowflakeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
      <circle cx="12" cy="12" r="1.5" fill="#D4AF37" />
    </svg>
  );
}

function PreviewConstellationIcon() {
  return (
    <svg viewBox="0 0 36 18" width="30" height="15" fill="none">
      <path d="M10 3 A 5 5 0 0 0 14 14 A 7 7 0 1 1 10 3 Z" fill="#F5D77F" opacity="0.95" />
      <polygon points="23,2 24.5,6 29,7 25.5,10 26.5,14 23,11.5 19.5,14 20.5,10 17,7 21.5,6" fill="#FFEBA3" />
      <circle cx="4" cy="12" r="1" fill="#FFF" />
      <circle cx="33" cy="12" r="1.2" fill="#FFF" />
    </svg>
  );
}

function PreviewPineTreeIcon() {
  return (
    <svg viewBox="0 0 24 26" width="16" height="18" fill="none">
      <polygon points="12,1 14,4 17,4 14.5,7 15.5,10 12,8 8.5,10 9.5,7 7,4 10,4" fill="#FFE685" />
      <polygon points="12,5 16,11 13.5,11 18,17 15,17 20,22 4,22 9,17 6,17 10.5,11 8,11" fill="#D4AF37" opacity="0.95" />
      <rect x="10.5" y="22" width="3" height="3" fill="#8C5922" />
    </svg>
  );
}

function PreviewHaiti1804Icon() {
  return (
    <svg viewBox="0 0 36 22" width="28" height="17" fill="none">
      <rect x="16.5" y="6" width="3" height="13" fill="#8C5922" />
      <path d="M18 7 Q11 3 7 8 Q13 6 17 8" fill="#1E5C32" opacity="0.9" />
      <path d="M18 7 Q25 3 29 8 Q23 6 19 8" fill="#1E5C32" opacity="0.9" />
      <path d="M18 7 Q18 2 15 1 Q16 4 17 7" fill="#1E5C32" opacity="0.9" />
      <polygon points="18,1 20,4 16,4" fill="#D4AF37" />
      <path d="M9 11 L14 14 L9 17 Z" fill="#00209F" />
      <path d="M27 11 L22 14 L27 17 Z" fill="#D21034" />
    </svg>
  );
}

function PreviewSoupJoumouIcon() {
  return (
    <svg viewBox="0 0 32 22" width="26" height="18" fill="none">
      <path d="M11 4 Q13 1 11 0" stroke="#FFDF88" strokeWidth="1" strokeLinecap="round" />
      <path d="M16 5 Q18 2 16 0" stroke="#FFDF88" strokeWidth="1" strokeLinecap="round" />
      <path d="M21 4 Q23 1 21 0" stroke="#FFDF88" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="16" cy="10" rx="12" ry="3.5" fill="#E59B12" />
      <path d="M4 10 C4 17, 10 20, 16 20 C22 20, 28 17, 28 10 Z" fill="#C97A08" stroke="#FFEAA0" strokeWidth="0.8" />
      <ellipse cx="16" cy="10" rx="9" ry="2" fill="#FFC344" />
    </svg>
  );
}

function PreviewRoyalCrownIcon() {
  return (
    <svg viewBox="0 0 30 18" width="24" height="15" fill="none">
      <path d="M4 15 L7 5 L11 10 L15 2 L19 10 L23 5 L26 15 Z" fill="#E5B842" stroke="#664608" strokeWidth="0.8" />
      <circle cx="7" cy="4" r="1.3" fill="#FFF5D6" />
      <circle cx="15" cy="1.8" r="1.5" fill="#FFF5D6" />
      <circle cx="23" cy="4" r="1.3" fill="#FFF5D6" />
      <rect x="5" y="15" width="20" height="2.5" fill="#B38012" rx="0.5" />
    </svg>
  );
}

function PreviewChampagneIcon() {
  return (
    <svg viewBox="0 0 30 24" width="24" height="19" fill="none">
      <circle cx="15" cy="3" r="1" fill="#FFEAA0" />
      <circle cx="11" cy="6" r="0.8" fill="#FFF" />
      <circle cx="19" cy="5" r="0.8" fill="#FFF" />
      <path d="M8 6 L13 11 L11.5 12 L6.5 7 Z" fill="#FFDF88" opacity="0.9" />
      <line x1="12.2" y1="11.5" x2="15.5" y2="17" stroke="#D4AF37" strokeWidth="1.2" />
      <path d="M22 6 L17 11 L18.5 12 L23.5 7 Z" fill="#FFDF88" opacity="0.9" />
      <line x1="17.8" y1="11.5" x2="14.5" y2="17" stroke="#D4AF37" strokeWidth="1.2" />
    </svg>
  );
}

function PreviewAirmailStampIcon() {
  return (
    <svg viewBox="0 0 34 26" width="30" height="23" fill="none" className="real-postage-stamp">
      <defs>
        <filter id="stampShadow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="rgba(0,0,0,0.25)" />
        </filter>
        <radialGradient id="stampHeartGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E63956" />
          <stop offset="100%" stopColor="#9E142B" />
        </radialGradient>
      </defs>
      {/* Perforated Stamp Base with fine die-cut tooth scallops */}
      <rect x="2" y="2" width="30" height="22" fill="#FAF6EE" stroke="#B33951" strokeWidth="1" strokeDasharray="3 1.5" filter="url(#stampShadow)" rx="0.5" />
      <rect x="4" y="4" width="26" height="18" fill="#FFFBF5" stroke="#C41230" strokeWidth="0.6" />
      {/* Guilloche Inner Frame */}
      <rect x="5.5" y="5.5" width="23" height="15" fill="none" stroke="#E29AAB" strokeWidth="0.4" strokeDasharray="1.5 1" />
      {/* Heart Medallion */}
      <circle cx="17" cy="13" r="5.5" fill="#FDF3F5" stroke="#C41230" strokeWidth="0.6" />
      <path d="M17 9.8 C15.4 8, 12.2 8.8, 12.2 11.5 C12.2 13.8, 17 16.2, 17 16.2 C17 16.2, 21.8 13.8, 21.8 11.5 C21.8 8.8, 18.6 8, 17 9.8 Z" fill="url(#stampHeartGrad)" />
      {/* Denomination & Country */}
      <text x="6" y="8" fontSize="2.8" fontWeight="bold" fill="#8C1D33" fontFamily="sans-serif" letterSpacing="0.3">POSTE</text>
      <text x="22" y="8" fontSize="2.8" fontWeight="bold" fill="#8C1D33" fontFamily="sans-serif">100G</text>
      {/* Postal Cancellation Wavy Lines across stamp */}
      <path d="M1 9 Q6 7 11 9 Q16 11 21 9 Q26 7 33 9" stroke="rgba(35, 75, 115, 0.45)" strokeWidth="0.8" fill="none" />
      <path d="M1 13 Q6 11 11 13 Q16 15 21 13 Q26 11 33 13" stroke="rgba(35, 75, 115, 0.45)" strokeWidth="0.8" fill="none" />
      <path d="M1 17 Q6 15 11 17 Q16 19 21 17 Q26 15 33 17" stroke="rgba(35, 75, 115, 0.45)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function PreviewDoubleHeartsIcon() {
  return (
    <svg viewBox="0 0 32 20" width="28" height="17" fill="none">
      <defs>
        <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1" floodColor="rgba(100, 20, 45, 0.32)" />
        </filter>
        <radialGradient id="heartGrad1" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFAEC0" />
          <stop offset="55%" stopColor="#E86F88" />
          <stop offset="100%" stopColor="#B33951" />
        </radialGradient>
        <radialGradient id="heartGrad2" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF2F6" />
          <stop offset="55%" stopColor="#F7B2C2" />
          <stop offset="100%" stopColor="#D9637E" />
        </radialGradient>
      </defs>
      {/* Heart 1 (Back/Primary) */}
      <path d="M11 3 C8.2 0.8, 3.2 1.8, 3.2 6.5 C3.2 10.5, 11 15, 11 15 C11 15, 18.8 10.5, 18.8 6.5 C18.8 1.8, 13.8 0.8, 11 3 Z" fill="url(#heartGrad1)" filter="url(#heartShadow)" />
      {/* Heart 2 (Front/Secondary) */}
      <path d="M20 5 C17.8 3, 13.5 3.5, 13.5 7.2 C13.5 10.8, 20 14.5, 20 14.5 C20 14.5, 26.5 10.8, 26.5 7.2 C26.5 3.5, 22.2 3, 20 5 Z" fill="url(#heartGrad2)" stroke="#FFFFFF" strokeWidth="0.75" filter="url(#heartShadow)" />
    </svg>
  );
}

function TemplateCard({ template, onOpenDemo, onOpenCustomizer }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const justClosedRef = useRef(false);

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        justClosedRef.current = true;
        setShowMenu(false);
        setTimeout(() => {
          justClosedRef.current = false;
        }, 150);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowMenu(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu]);

  const getFormatBadge = (fmt) => {
    switch (fmt) {
      case 'parchment': return 'Pachemen';
      case 'bifold': return 'Liv Papetri';
      case 'kraft_sheet': return 'Lèt Kraft';
      default: return 'Anvlòp De Liks';
    }
  };

  return (
    <div
      className="canva-template-card"
      onClick={() => {
        if (!justClosedRef.current) {
          onOpenDemo();
        }
      }}
    >
      {/* Mockup vizyèl espesifik selon fòma kat la (Anvlòp, Pachemen, Liv, Lèt Kraft) */}
      <div className={`canva-card-mockup is-format-${template.format || 'envelope'}`}>
        
        {/* FÒMA 1 : ANVLÒP DE LUKS AK KAT KI GLISE SOTI AN DEDAN L */}
        {(!template.format || template.format === 'envelope') && (
          <div className="preview-envelope-container">
            <div className="preview-env-back" style={{ background: template.envelopeColor }} />
            <div className="preview-env-flap" style={{ borderBottomColor: template.flapColor || template.envelopeColor }} />
            <div className={`preview-env-card is-${template.coverArtType || 'default'}`}>
              <div className="preview-paper-edge" />
              <div className="preview-motif-badge">
                {template.coverArtType === 'snowflakes' && <PreviewSnowflakeIcon />}
                {template.coverArtType === 'constellation' && <PreviewConstellationIcon />}
                {template.coverArtType === 'pine_tree' && <PreviewPineTreeIcon />}
              </div>
              <div
                className="preview-card-heading"
                style={{
                  color: template.envelopeColor,
                  fontFamily: template.titleFont || "'Montserrat', sans-serif",
                  fontStyle: template.fontStyle || 'normal',
                  fontSize: template.titleFont?.includes('Cinzel') ? '9.5px' : '10.5px',
                  lineHeight: '1.25',
                  letterSpacing: template.titleFont?.includes('Cinzel') ? '0.8px' : '0.2px'
                }}
              >
                {template.title}
              </div>
              <div className="preview-card-divider" style={{ background: template.accentColor }} />
              <p className="preview-card-snippet">{template.defaultMessage.slice(0, 52)}...</p>
            </div>
            <div className="preview-env-front" style={{ borderBottomColor: template.envelopeColor }} />
            <div className="preview-tactile-seal">
              <svg viewBox="0 0 40 40" className="preview-seal-svg">
                <defs>
                  <radialGradient id={`previewWax-${template.id}`} cx="38%" cy="32%" r="65%">
                    <stop offset="0%" stopColor="#E2BD6E" />
                    <stop offset="55%" stopColor="#A67417" />
                    <stop offset="100%" stopColor="#543603" />
                  </radialGradient>
                </defs>
                <path
                  d="M20 3 C29 2.5, 36 8, 37 17 C38 24, 34 32, 26 37 C20 40, 12 38, 6 33 C1 28, 2 19, 4 11 C6 5, 13 3, 20 3 Z"
                  fill={`url(#previewWax-${template.id})`}
                  stroke="#4A2E03"
                  strokeWidth="0.8"
                />
                <circle cx="20" cy="20" r="11" fill="#754A07" />
                <text x="20" y="23.5" textAnchor="middle" fill="#FFF3CD" fontSize="8.5" fontWeight="bold" fontFamily="'Montserrat', sans-serif">
                  KD
                </text>
              </svg>
            </div>
          </div>
        )}

        {/* FÒMA 2 : PACHEMEN WAYAL AK DE WOULE ANWO AK ANBA */}
        {template.format === 'parchment' && (
          <div className="preview-parchment-container">
            <div className="preview-parchment-roller preview-roller-top" style={{ background: template.rodColor || '#855A25' }} />
            <div className="preview-parchment-paper" style={{ background: template.parchmentBg || '#F5E6CA', borderColor: template.accentColor || '#C99726' }}>
              <div className="preview-parchment-seal-ribbon" />
              <div className="preview-motif-badge" style={{ marginTop: 2 }}>
                {template.coverArtType === 'haiti_1804' && <PreviewHaiti1804Icon />}
                {template.coverArtType === 'soup_joumou' && <PreviewSoupJoumouIcon />}
                {template.coverArtType === 'royal_decree' && <PreviewRoyalCrownIcon />}
              </div>
              <div
                className="preview-card-heading"
                style={{
                  color: template.envelopeColor,
                  fontFamily: template.titleFont || "'Montserrat', sans-serif",
                  fontStyle: template.fontStyle || 'normal',
                  fontSize: template.titleFont?.includes('Cinzel') ? '10px' : '11px',
                  letterSpacing: template.titleFont?.includes('Cinzel') ? '0.8px' : '0.2px',
                  marginTop: 2
                }}
              >
                {template.title}
              </div>
              <div className="preview-card-divider" style={{ background: template.accentColor }} />
              <p className="preview-card-snippet" style={{ color: '#3A2714' }}>{template.defaultMessage.slice(0, 48)}...</p>
            </div>
            <div className="preview-parchment-roller preview-roller-bottom" style={{ background: template.rodColor || '#855A25' }} />
          </div>
        )}

        {/* FÒMA 3 : LIV PAPETRI FOLIO DE LUKS */}
        {template.format === 'bifold' && (
          <div className="preview-bifold-container">
            <div
              className="preview-bifold-cover"
              style={{
                background: `linear-gradient(135deg, ${template.coverColor || '#1E3326'} 0%, #122118 100%)`,
                borderColor: template.accentColor || '#D4AF37'
              }}
            >
              <div className="preview-bifold-spine" />
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                {template.coverArtType === 'champagne_celebration' ? <PreviewChampagneIcon /> : <PreviewPineTreeIcon />}
              </div>

              <div
                className="preview-bifold-title"
                style={{
                  fontFamily: template.titleFont || "'Montserrat', sans-serif",
                  fontStyle: template.fontStyle || 'normal',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                  marginTop: 3,
                  padding: '0 6px',
                  textAlign: 'center'
                }}
              >
                {template.title}
              </div>

              <div className="preview-bifold-gold-seal">KD</div>
            </div>
          </div>
        )}

        {/* FÒMA 4 : LÈT KRAFT AK KÈ K AP FLOTE (DIZAYN PWÒP, ELEGANT TANKOU ANVAN AN) */}
        {template.format === 'kraft_sheet' && (
          <div className="preview-kraft-container">
            <div className="preview-kraft-sheet" style={{ background: template.kraftColor || '#E8D5B7' }}>
              {/* Bòdi Avyon Rétro Otantik (Airmail Stripes) pou Premye Kat Mesaj Lanmou an */}
              {template.coverArtType === 'airmail_love' && (
                <>
                  <div className="preview-airmail-border" />
                  <div className="preview-airmail-stamp">
                    <PreviewAirmailStampIcon />
                  </div>
                </>
              )}
              {template.id === 'lanmou-velours-rose' && (
                <>
                  <div className="preview-lace-border" />
                  <div style={{ position: 'absolute', top: 6, right: 8, fontSize: '11px', color: template.accentColor || '#E86F88', letterSpacing: '2px', zIndex: 3 }}>
                    ♥♥
                  </div>
                </>
              )}
              {!template.coverArtType && (
                <div className="preview-kraft-top-flap" />
              )}
              {template.coverArtType !== 'airmail_love' && template.id !== 'lanmou-velours-rose' && (
                <div className="preview-kraft-heart" style={{ color: template.accentColor || '#B33951' }}>
                  ♥
                </div>
              )}
              <div
                className="preview-card-heading"
                style={{
                  color: template.id === 'lanmou-velours-rose' ? '#7A1C3E' : '#5C222F',
                  fontFamily: template.titleFont || "'Playfair Display', serif",
                  fontStyle: template.fontStyle || 'normal',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  lineHeight: '1.3',
                  marginTop: 6,
                  padding: '0 8px',
                  display: 'block',
                  overflow: 'visible',
                  maxHeight: 'none',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                  textAlign: 'center'
                }}
              >
                {template.title}
              </div>
              <div className="preview-card-divider" style={{ background: template.accentColor || '#B33951', width: 22, height: 1.5, margin: '4px auto' }} />
              <p className="preview-card-snippet" style={{ color: '#401A24', fontSize: '9.5px', lineHeight: '1.38', padding: '0 8px' }}>
                {template.defaultMessage.slice(0, 48)}...
              </p>
            </div>
          </div>
        )}

        {/* Bouton 3 ti pwen (...) tankou sou Canva */}
        <div ref={menuRef} className="canva-card-dots-wrap" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="canva-card-dots-btn"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Opsyon kat sa a"
            title="Opsyon"
          >
            <DotsThree size={16} weight="bold" />
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
                <Eye size={14} weight="regular" />
                <span>Ouvri Démo</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onOpenCustomizer();
                }}
              >
                <NotePencil size={14} weight="regular" />
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

function CategoryCarouselSection({ cat, templates, onOpenDemo, onOpenCustomizer, onSelectCategory }) {
  const trackRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [templates]);

  const scroll = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = direction === 'left' ? -280 : 280;
    el.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkScroll, 320);
  };

  const IconComp = cat.icon;

  return (
    <section key={cat.id} className="canva-category-row">
      {/* Antèt Rangée Canva : Tit a goch, Flèch a dwat sou Desktop */}
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
          {onSelectCategory && (
            <button
              type="button"
              className="canva-btn-view-all"
              onClick={() => onSelectCategory(cat.id)}
            >
              Wè tout ({templates.length})
            </button>
          )}

          <div className="canva-nav-arrows">
            <button
              type="button"
              className={`canva-arrow-btn ${!canScrollLeft ? 'disabled is-hidden' : ''}`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              style={{
                opacity: canScrollLeft ? 1 : 0,
                pointerEvents: canScrollLeft ? 'auto' : 'none',
                visibility: canScrollLeft ? 'visible' : 'hidden',
                transition: 'opacity 0.25s ease, visibility 0.25s ease'
              }}
              aria-label="Glise a goch"
              title="Glise a goch"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              className={`canva-arrow-btn ${!canScrollRight ? 'disabled is-hidden' : ''}`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              style={{
                opacity: canScrollRight ? 1 : 0,
                pointerEvents: canScrollRight ? 'auto' : 'none',
                visibility: canScrollRight ? 'visible' : 'hidden',
                transition: 'opacity 0.25s ease, visibility 0.25s ease'
              }}
              aria-label="Glise a dwat"
              title="Glise a dwat"
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      <div className="canva-carousel-wrapper">
        <div
          ref={trackRef}
          id={`carousel-${cat.id}`}
          className="canva-carousel-track"
          onScroll={checkScroll}
        >
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onOpenDemo={() => onOpenDemo(template)}
              onOpenCustomizer={() => onOpenCustomizer(template)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [customizerTemplate, setCustomizerTemplate] = useState(null);
  const [customData, setCustomData] = useState(null);
  const [isDirectRecipientView, setIsDirectRecipientView] = useState(false);

  // Inisyalize boukliye sekirite anti-kapti ak anti-enspekte
  useEffect(() => {
    initSecurityShield();
  }, []);

  // Deteksyon yon lyen inik destinataire nan URL la (Supporte slug backend API ak query params)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cardSlug = params.get('c');
      const to = params.get('to');
      const from = params.get('from');

      if (cardSlug) {
        fetch(`/api/cards/${cardSlug}`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.order) {
              const matchedTemplate = TEMPLATES.find((t) => t.id === data.order.template_id) || TEMPLATES[0];
              setCustomData({
                recipient: data.order.recipient_name,
                sender: data.order.sender_name,
                message: data.order.message_content,
                heading: data.order.heading || matchedTemplate.heading,
                musicId: data.order.music_id || matchedTemplate.defaultMusic
              });
              setActiveTemplate(matchedTemplate);
              setIsDirectRecipientView(true);
            }
          })
          .catch((err) => console.error('Erreur chargement carte API:', err));
      } else if (to && from) {
        const themeId = params.get('theme');
        const msg = params.get('msg');
        const customH = params.get('h') || params.get('heading');
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
    stopHolidaySoundtrack(true);
    setCustomData(null);
    setIsDirectRecipientView(false);
    setActiveTemplate(template);
  };

  const handleOpenCustomizer = (template) => {
    stopHolidaySoundtrack(true);
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
      default: return 'Tout Modèl yo';
    }
  };

  return (
    <div>
      {/* 1. Antèt Navigasyon */}
      <header className="header-nav">
        <a href="/" className="brand-logo">
          <span className="brand-kat">KAT</span>
          <span className="brand-dijital">DIJITAL</span>
        </a>
        <div className="nav-tagline">Bèl Kat Ve & Swè Dijital pou Tout Okazyon</div>
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
          <span className="hero-title-line">Voye bèl kat ak mesaj pèsonalize,</span>
          <span className="hero-title-line">tou dwat nan kè moun ou renmen yo.</span>
        </h1>
        <p className="hero-desc">
          Chwazi yon modèl papetri, ekri pawòl ou ak tout kè w, epi pataje yon souvni inik kote w vle pou sèlman <strong>100 Goud</strong>.
        </p>

        {/* Ba Rechèch Éditrice */}
        <div className="search-collections-bar">
          <div className="search-bar-inner">
            <div className="search-input-box">
              <MagnifyingGlass size={16} weight="regular" className="search-icon-svg" />
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
                  <X size={14} weight="bold" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtè Kategori an Pilil Éditrice */}
        <div className="categories-bar">
          <button
            type="button"
            className={`category-pill category-pill-all ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <SquaresFour size={15} weight="regular" />
            <span>Tout Modèl yo</span>
          </button>

            <button
              type="button"
              className={`category-pill ${selectedCategory === 'noel' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('noel')}
            >
              <TreeEvergreen size={15} weight="regular" />
              <span>Nwèl Tradisyonèl</span>
            </button>

            <button
              type="button"
              className={`category-pill ${selectedCategory === 'nouvel-an' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('nouvel-an')}
            >
              <Champagne size={15} weight="regular" />
              <span>Bòn Ane 2027</span>
            </button>

            <button
              type="button"
              className={`category-pill ${selectedCategory === 'tradition' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('tradition')}
            >
              <Scroll size={15} weight="regular" />
              <span>1ye Janvye & Tradisyon</span>
            </button>

            <button
              type="button"
              className={`category-pill ${selectedCategory === 'mennaj' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('mennaj')}
            >
              <HandHeart size={15} weight="regular" />
              <span>Mesaj Lanmou</span>
            </button>
          </div>
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

              return (
                <CategoryCarouselSection
                  key={cat.id}
                  cat={cat}
                  templates={catTemplates}
                  onOpenDemo={handleOpenDemo}
                  onOpenCustomizer={handleOpenCustomizer}
                  onSelectCategory={setSelectedCategory}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* 4. Footer Minimalis, Simetrik & Épuré */}
      <footer className="app-main-footer">
        <div className="footer-inner-content">
          <div className="footer-logo-text">
            <span className="brand-kat">KAT</span>
            <span className="brand-dijital">DIJITAL</span>
          </div>
          <div className="footer-slogan">Kat dijital pèsonalize pou tout okazyon</div>

          <div className="footer-sub-row">
            <span>© 2026 KAT DIJITAL</span>
            <span className="footer-bullet">•</span>
            <span>Tout dwa rezève</span>
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
            stopHolidaySoundtrack(true);
            setActiveTemplate(null);
            setCustomData(null);
            if (isDirectRecipientView) {
              window.history.replaceState({}, '', '/');
            }
          }}
          onOpenCustomizer={(t) => {
            stopHolidaySoundtrack(true);
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
