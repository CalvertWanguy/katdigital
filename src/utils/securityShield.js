/**
 * SISTÈM SEKIRITE & PWOTEKSYON KONT KAPTI D EKRAN (ANTI-SCREENSHOT & ANTI-INSPECT)
 * Pou KatDijital
 * 
 * Karakteristik :
 * 1. Blackout total lè yon moun eseye fè PrintScreen oswa Snipping Tool (Win+Shift+S / Cmd+Shift+4)
 * 2. Deteksyon pèt konsantrasyon (Blur / VisibilityChange) lè zouti kapti a louvri
 * 3. Efase clipboard otomatikman
 * 4. Bloke F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S, Ctrl+P
 * 5. Bloke klike dwat (Context Menu / Inspect)
 * 6. Deteksyon ouvèti DevTools
 */

// Konfigirasyon : Chanje a true lè w pare pou re-aktive tout pwoteksyon an
export const SHIELD_ENABLED = false;

let isShieldActive = false;
let blackoutElement = null;
let restoreTimeout = null;

function createBlackoutOverlay() {
  if (typeof document === 'undefined') return null;
  let el = document.getElementById('security-shield-blackout');
  if (!el) {
    el = document.createElement('div');
    el.id = 'security-shield-blackout';
    el.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: #000000;
      z-index: 99999999;
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #FFFFFF;
      font-family: 'Montserrat', sans-serif;
      text-align: center;
      padding: 24px;
      box-sizing: border-box;
      pointer-events: auto;
      user-select: none;
    `;
    el.innerHTML = `
      <div style="margin-bottom: 16px;">
        <svg viewBox="0 0 72 72" width="64" height="64" style="display: block; margin: 0 auto;">
          <defs>
            <radialGradient id="kdSecGold" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#FFF2B8" />
              <stop offset="25%" stop-color="#F5D77F" />
              <stop offset="60%" stop-color="#C99726" />
              <stop offset="85%" stop-color="#8A5E12" />
              <stop offset="100%" stop-color="#3E2402" />
            </radialGradient>
            <radialGradient id="kdSecBlack" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stop-color="#222222" />
              <stop offset="60%" stop-color="#121212" />
              <stop offset="100%" stop-color="#060606" />
            </radialGradient>
            <filter id="kdSecShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.7" />
            </filter>
          </defs>
          <circle cx="36" cy="36" r="34" fill="none" stroke="url(#kdSecGold)" stroke-width="1.2" opacity="0.75" />
          <circle cx="36" cy="36" r="31" fill="url(#kdSecGold)" filter="url(#kdSecShadow)" />
          <circle cx="36" cy="36" r="28" fill="none" stroke="#4A2E03" stroke-width="0.8" stroke-dasharray="1.5 2" />
          <circle cx="36" cy="36" r="25" fill="url(#kdSecBlack)" stroke="#E5C478" stroke-width="0.8" />
          
          <!-- Ti kouwòn an lò sou tèt KD -->
          <path d="M30 22 L32 25 L36 21 L40 25 L42 22 L41 27 L31 27 Z" fill="#FFF4D0" />
          <circle cx="36" cy="20" r="1" fill="#FFF" />
          
          <!-- Monogramme KD Signature KatDijital -->
          <text x="36" y="41" text-anchor="middle" fill="#FFF2B8" stroke="#8A5E12" stroke-width="0.5" font-family="'Montserrat', 'Cinzel', serif" font-size="16" font-weight="900" letter-spacing="1.2">KD</text>
          
          <!-- Anblèm Sekirite KatDijital -->
          <path d="M33 46 L39 46 A 1 1 0 0 1 40 47 L40 50 A 1 1 0 0 1 39 51 L33 51 A 1 1 0 0 1 32 50 L32 47 A 1 1 0 0 1 33 46 Z" fill="#E5C478" />
          <path d="M34 46 L34 44 A 2 2 0 0 1 38 44 L38 46" fill="none" stroke="#E5C478" stroke-width="1" />
          <circle cx="36" cy="48.5" r="0.6" fill="#121212" />
        </svg>
      </div>
      <h3 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px 0; letter-spacing: 0.5px;">
        ZÒN SEKIRIZE • KAT DIJITAL
      </h3>
      <p style="font-size: 13px; color: #A8A29E; max-width: 340px; margin: 0; line-height: 1.45;">
        Kapti d ekran ak enspeksyon kòd dezaktive pou pwoteje kreyasyon ak kontni modèl sa a.
      </p>
    `;
    document.body.appendChild(el);
  }
  return el;
}

export function triggerBlackout(durationMs = 2000, reason = 'screenshot') {
  if (!SHIELD_ENABLED) return;
  if (typeof document === 'undefined') return;
  const overlay = blackoutElement || createBlackoutOverlay();
  if (!overlay) return;

  overlay.style.display = 'flex';

  // Efase clipboard la si posib pou anpeche kole kapti a
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText('').catch(() => {});
    }
  } catch (e) {}

  if (restoreTimeout) clearTimeout(restoreTimeout);
  if (durationMs > 0) {
    restoreTimeout = setTimeout(() => {
      overlay.style.display = 'none';
    }, durationMs);
  }
}

export function hideBlackout() {
  if (restoreTimeout) clearTimeout(restoreTimeout);
  if (blackoutElement) {
    blackoutElement.style.display = 'none';
  }
}

/**
 * Inisyalize pwoteksyon global la sou tout paj la
 */
export function initSecurityShield() {
  if (!SHIELD_ENABLED) return;
  if (typeof window === 'undefined' || isShieldActive) return;
  isShieldActive = true;
  blackoutElement = createBlackoutOverlay();

  // 1. Bloke Klike Dwat (Right click / Context Menu)
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Bloke Raccourcis Klavye DevTools & Screenshot
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    // F12 (DevTools)
    if (key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      triggerBlackout(2500, 'f12');
      return false;
    }

    // PrintScreen
    if (key === 'PrintScreen' || e.keyCode === 44) {
      triggerBlackout(3000, 'printscreen');
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
    if (isCtrlOrCmd && e.shiftKey && (key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c')) {
      e.preventDefault();
      e.stopPropagation();
      triggerBlackout(2500, 'inspect');
      return false;
    }

    // Ctrl+U / Cmd+U (View Source)
    if (isCtrlOrCmd && (key === 'u' || key === 'U')) {
      e.preventDefault();
      e.stopPropagation();
      triggerBlackout(2000, 'view_source');
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if (isCtrlOrCmd && (key === 's' || key === 'S')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+P / Cmd+P (Print)
    if (isCtrlOrCmd && (key === 'p' || key === 'P')) {
      e.preventDefault();
      e.stopPropagation();
      triggerBlackout(2500, 'print');
      return false;
    }
  }, { capture: true });

  // 3. Deteksyon PrintScreen sou KeyUp tou (Windows Snipping Tool trigger)
  window.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      triggerBlackout(3000, 'printscreen');
    }
  }, { capture: true });

  // 4. Deteksyon Pèt Konsantrasyon (Blur / Snipping Tool overlay)
  // Lè Snipping Tool (Win+Shift+S) louvri, fenèt navigatè a pèdi focus imedyatman
  window.addEventListener('blur', () => {
    // Si yon modal sansib (Demo oswa Pèsonalizasyon) louvri, aktive blackout
    const isSensitiveModalOpen = document.querySelector('.envelope-modal-overlay, .personalize-modal-overlay');
    if (isSensitiveModalOpen) {
      triggerBlackout(0, 'blur'); // Rete nwa jiskaske fenèt la repran focus
    }
  });

  window.addEventListener('focus', () => {
    // Retounen nòmal lè itilizatè a tounen sou paj la
    setTimeout(() => {
      hideBlackout();
    }, 150);
  });

  // 5. Deteksyon DevTools ouvè via dimansyon fenèt
  let devToolsOpen = false;
  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    if (widthThreshold || heightThreshold) {
      if (!devToolsOpen) {
        devToolsOpen = true;
        const isSensitiveModalOpen = document.querySelector('.envelope-modal-overlay, .personalize-modal-overlay');
        if (isSensitiveModalOpen) {
          triggerBlackout(0, 'devtools_open');
        }
      }
    } else {
      if (devToolsOpen) {
        devToolsOpen = false;
        hideBlackout();
      }
    }
  };

  window.addEventListener('resize', checkDevTools);
  setInterval(checkDevTools, 1000);
}
