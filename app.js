// ══════════════════════════════════════════
//  app.js — Merkezi uygulama mantığı
// ══════════════════════════════════════════

// ── Varsayılan Tokenlar ──────────────────
const DEFAULT_TOKENS = {
  RESTAURANT_NAME : 'CAN BEYLER',
  TAGLINE         : 'Kızarmış Piliç & Pilav',
  PROMO_TEXT      : 'AÇILIŞA ÖZEL UYGUN FİYATLARLA HİZMETİNİZDEYİZ',

  MENU_1_NAME  : 'Tavuklu Nohut Pilav',
  MENU_1_PRICE : '120',
  MENU_1_DESC  : 'Günlük taze tavuk, nohut ve buharda pilav',
  MENU_1_EMOJI : '🍚',

  MENU_2_NAME  : 'Çorba Çeşitleri',
  MENU_2_PRICE : '65',
  MENU_2_DESC  : 'Mercimek, domates, tarhana — her gün taze',
  MENU_2_EMOJI : '🍲',

  MENU_3_NAME  : 'Kızarmış Piliç',
  MENU_3_PRICE : '220',
  MENU_3_DESC  : 'Çıtır çıtır, baharatlı, tam porsiyon',
  MENU_3_EMOJI : '🍗',

  MENU_4_NAME  : 'Kanat Menü',
  MENU_4_PRICE : '180',
  MENU_4_DESC  : '6 adet kanat + patates kızartması',
  MENU_4_EMOJI : '🍖',

  PHONE        : '05336399706',
  WHATSAPP     : '905336399706',
  ADDRESS      : 'Aldere Mah. Mehmet Ali Altun Cad. 397 Sok. No: 6/A Mamak/ANKARA',
  MAPS_QUERY   : 'Can+Beyler+Mamak+Ankara',

  HOURS_1      : 'Pzt – Cmt: 10:00 – 22:00',
  HOURS_2      : 'Pazar: 11:00 – 21:00',

  PRIMARY      : '#8B0000',
  ACCENT       : '#ff6600',
};

const TOKEN_META = {
  RESTAURANT_NAME : { label:'Restoran Adı',        group:'Restoran', type:'text'     },
  TAGLINE         : { label:'Alt Başlık',           group:'Restoran', type:'text'     },
  PROMO_TEXT      : { label:'Kampanya Metni',       group:'Restoran', type:'textarea' },

  MENU_1_NAME  : { label:'Menü 1 Adı',           group:'Menü 1', type:'text'     },
  MENU_1_PRICE : { label:'Menü 1 Fiyat (₺)',      group:'Menü 1', type:'number'   },
  MENU_1_DESC  : { label:'Menü 1 Açıklama',       group:'Menü 1', type:'textarea' },
  MENU_1_EMOJI : { label:'Menü 1 Emoji',          group:'Menü 1', type:'text'     },

  MENU_2_NAME  : { label:'Menü 2 Adı',           group:'Menü 2', type:'text'     },
  MENU_2_PRICE : { label:'Menü 2 Fiyat (₺)',      group:'Menü 2', type:'number'   },
  MENU_2_DESC  : { label:'Menü 2 Açıklama',       group:'Menü 2', type:'textarea' },
  MENU_2_EMOJI : { label:'Menü 2 Emoji',          group:'Menü 2', type:'text'     },

  MENU_3_NAME  : { label:'Menü 3 Adı',           group:'Menü 3', type:'text'     },
  MENU_3_PRICE : { label:'Menü 3 Fiyat (₺)',      group:'Menü 3', type:'number'   },
  MENU_3_DESC  : { label:'Menü 3 Açıklama',       group:'Menü 3', type:'textarea' },
  MENU_3_EMOJI : { label:'Menü 3 Emoji',          group:'Menü 3', type:'text'     },

  MENU_4_NAME  : { label:'Menü 4 Adı',           group:'Menü 4', type:'text'     },
  MENU_4_PRICE : { label:'Menü 4 Fiyat (₺)',      group:'Menü 4', type:'number'   },
  MENU_4_DESC  : { label:'Menü 4 Açıklama',       group:'Menü 4', type:'textarea' },
  MENU_4_EMOJI : { label:'Menü 4 Emoji',          group:'Menü 4', type:'text'     },

  PHONE        : { label:'Telefon (0xxx...)',     group:'İletişim', type:'tel'  },
  WHATSAPP     : { label:'WhatsApp (90xxx...)',   group:'İletişim', type:'tel'  },
  ADDRESS      : { label:'Adres',                group:'İletişim', type:'textarea' },
  MAPS_QUERY   : { label:'Google Maps Arama',    group:'İletişim', type:'text' },
  HOURS_1      : { label:'Saat Satır 1',         group:'Saatler',  type:'text' },
  HOURS_2      : { label:'Saat Satır 2',         group:'Saatler',  type:'text' },
  PRIMARY      : { label:'Ana Renk',             group:'Tema',     type:'color' },
  ACCENT       : { label:'Vurgu Rengi',          group:'Tema',     type:'color' },
};

// ── localStorage anahtar adları ──────────
const KEYS = {
  TOKENS : 'cb_tokens_v2',
  IMAGES : 'cb_images_v2',
  CART   : 'cb_cart_v2',
};

// ── Token işlemleri ──────────────────────
function getTokens() {
  try {
    const s = localStorage.getItem(KEYS.TOKENS);
    return s ? Object.assign({}, DEFAULT_TOKENS, JSON.parse(s)) : Object.assign({}, DEFAULT_TOKENS);
  } catch { return Object.assign({}, DEFAULT_TOKENS); }
}
function saveTokens(t) {
  try { localStorage.setItem(KEYS.TOKENS, JSON.stringify(t)); return true; }
  catch { return false; }
}
function resetTokens() { localStorage.removeItem(KEYS.TOKENS); }

// ── Resim işlemleri ──────────────────────
function getImages() {
  try {
    const s = localStorage.getItem(KEYS.IMAGES);
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
}
function saveImages(imgs) {
  try { localStorage.setItem(KEYS.IMAGES, JSON.stringify(imgs)); return true; }
  catch(e) {
    console.warn('Resim kaydedilemedi:', e);
    return false;
  }
}

// Resmi canvas'ta küçültüp sıkıştır
function compressImage(file, maxW = 800, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = e => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Sepet işlemleri ──────────────────────
function getCart() {
  try {
    const s = localStorage.getItem(KEYS.CART);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem(KEYS.CART, JSON.stringify(cart)); }
  catch {}
}
function clearCart() { localStorage.removeItem(KEYS.CART); }

function addToCart(item) {           // item: { id, name, price, emoji }
  const cart = getCart();
  const existing = cart.find(c => c.id === item.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });
  saveCart(cart);
  return cart;
}
function removeFromCart(id) {
  const cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
  return cart;
}
function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (item) {
    if (qty <= 0) return removeFromCart(id);
    item.qty = qty;
  }
  saveCart(cart);
  return getCart();
}
function cartTotal(cart) {
  return cart.reduce((sum, c) => sum + (parseFloat(c.price) * c.qty), 0);
}

// ── WhatsApp sipariş linki ────────────────
function buildWhatsAppOrderURL(cart, tokens) {
  const lines = cart.map(c =>
    `${c.emoji} *${c.name}* x${c.qty} — ₺${(parseFloat(c.price)*c.qty).toFixed(0)}`
  ).join('\n');
  const total = cartTotal(cart).toFixed(0);
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(tokens.MAPS_QUERY || tokens.ADDRESS)}`;

  const msg =
`🛒 *${tokens.RESTAURANT_NAME} — Yeni Sipariş*

${lines}

💰 *Toplam: ₺${total}*

📍 *Adres:* ${tokens.ADDRESS}
🗺️ ${mapsUrl}

_Sipariş uygulamadan gönderildi._`;

  const wa = tokens.WHATSAPP.replace(/\D/g, '');
  return `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
}

// ── DOM'a token uygula ───────────────────
function applyTokensToDOM(tokens) {
  document.querySelectorAll('[data-token]').forEach(el => {
    const k = el.dataset.token;
    if (tokens[k] == null) return;
    el.textContent = tokens[k];
  });
  // CSS değişkenleri
  if (tokens.PRIMARY) document.documentElement.style.setProperty('--primary', tokens.PRIMARY);
  if (tokens.ACCENT)  document.documentElement.style.setProperty('--accent',  tokens.ACCENT);
}

// ── PWA & Service Worker ─────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
let _deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredInstall = e;
  document.querySelectorAll('.pwa-install-btn').forEach(b => {
    b.style.display = 'inline-flex';
    b.onclick = () => { _deferredInstall.prompt(); b.style.display = 'none'; };
  });
});
