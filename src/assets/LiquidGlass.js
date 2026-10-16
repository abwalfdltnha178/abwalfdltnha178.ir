class LiquidGlass {
  constructor(options = {}) {
    // تنظیمات پیش‌فرض
    this.defaultConfig = {
      glassThickness: 80,
      bezelWidth: 40,
      ior: 1.4,
      scaleRatio: 1.0,
      blur: 2,
      specularOpacity: 0.6,
      specularSat: 0,
      tintColor: '255,255,255',
      tintOpacity: 0.05,
      innerShadow: 'rgba(255,255,255,0.1)',
      innerShadowBlur: 10,
      innerShadowSpread: 0,
      balancedSpecular: false,
      ...options
    };

    this.targets = new Map();
    this.defs = null;

    // ۱. بررسی پشتیبانی مرورگر از SVG در Backdrop-Filter
    this.isSvgSupported = this._checkSupport();

    // ۲. تزریق استایل‌های پایه (Fallback)
    this._injectStyles();

    // اگر مرورگر پشتیبانی می‌کند، ابزارهای پیشرفته را راه‌اندازی کن
    if (this.isSvgSupported) {
      this._ensureDefs();
      this._setupObservers();
    } else {
      console.warn("LiquidGlass: SVG filters in backdrop-filter not supported. Falling back to CSS blur.");
    }
  }

  // بررسی پشتیبانی مرورگر
  _checkSupport() {
    if (!('CSS' in window) || !('supports' in CSS)) return false;
    // بررسی استاندارد و همچنین نسخه وب‌کیت (سافاری)
    const standard = CSS.supports('backdrop-filter', 'url(#test)');
    const webkit = CSS.supports('-webkit-backdrop-filter', 'url(#test)');
    return standard || webkit;
  }

  // تزریق CSS با Fallback امن برای سئو
  _injectStyles() {
    if (document.getElementById('liquid-glass-styles')) return;

    const style = document.createElement('style');
    style.id = 'liquid-glass-styles';
    style.textContent = `
      .liquid-glass {
        position: relative;
        overflow: hidden;
      }
      .liquid-glass > .lg-layer {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
      }
      .liquid-glass > *:not(.lg-layer) {
        position: relative;
        z-index: 1;
      }
      /* Fallback: استایل جایگزین برای زمانی که محاسبات در حال انجام است یا مرورگر ضعیف است */
      .liquid-glass .lg-refraction {
        background: rgba(255, 255, 255, 0.02);
        -webkit-backdrop-filter: blur(15px);
        backdrop-filter: blur(15px);
        transition: backdrop-filter 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  // ایجاد نگهدارنده SVG برای فیلترها
  _ensureDefs() {
    if (this.defs) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = 'position:fixed;width:0;height:0;pointer-events:none;z-index:-1;';
    this.defs = this._createSvgEl('defs', { id: 'liquid-glass-defs' });
    svg.appendChild(this.defs);
    document.body.appendChild(svg);
  }

  // راه‌اندازی Observer ها برای بارگذاری تنبل (Lazy Load)
  _setupObservers() {
    // Intersection Observer: برای ردیابی ورود المان به کادر تصویر
    this.io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const state = this.targets.get(entry.target);
        if (state) {
          state.isVisible = entry.isIntersecting;
          // فقط وقتی در دید است، پردازش ریاضی انجام شود
          if (state.isVisible) {
            this._buildOrUpdate(entry.target);
          }
        }
      });
    }, { rootMargin: '100px' }); // ۱۰۰ پیکسل قبل از اینکه در دید قرار بگیرد ساخته شود

    // Resize Observer: برای تغییر اندازه صفحه
    this.ro = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        const state = this.targets.get(entry.target);
        // فقط المان‌هایی که در دید کاربر هستند آپدیت شوند (بهینه‌سازی INP)
        if (state && state.isVisible) {
          clearTimeout(state.timer);
          state.timer = setTimeout(() => this._buildOrUpdate(entry.target), 60);
        }
      });
    });
  }

  _createSvgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  _getConfig(el) {
    const d = this.defaultConfig;
    return {
      glassThickness: Number(el.dataset.thickness) || d.glassThickness,
      bezelWidth: Number(el.dataset.bezel) || d.bezelWidth,
      ior: Number(el.dataset.ior) || d.ior,
      scaleRatio: Number(el.dataset.scale) || d.scaleRatio,
      blur: Number(el.dataset.blur) || d.blur,
      specularOpacity: Number(el.dataset.specular) || d.specularOpacity,
      specularSat: d.specularSat,
      tintColor: el.dataset.tint || d.tintColor,
      tintOpacity: Number(el.dataset.tintOpacity) || d.tintOpacity,
      innerShadow: el.dataset.shadow || d.innerShadow,
      innerShadowBlur: d.innerShadowBlur,
      innerShadowSpread: d.innerShadowSpread,
      balancedSpecular: d.balancedSpecular
    };
  }

  _surfaceFn(x) { return Math.pow(1 - Math.pow(1 - x, 4), 0.25); }

  _calcRefractionProfile(glassThickness, bezelWidth, ior, samples = 128) {
    const eta = 1 / ior;
    const p = new Float64Array(samples);
    for (let i = 0; i < samples; i++) {
      const x = i / samples;
      const y = this._surfaceFn(x);
      const dx = x < 1 ? 0.0001 : -0.0001;
      const deriv = (this._surfaceFn(x + dx) - y) / dx;
      const mag = Math.sqrt(deriv * deriv + 1);
      
      const nx = -deriv / mag, ny = -1 / mag;
      const k = 1 - eta * eta * (1 - ny * ny);
      if (k >= 0) {
        const sq = Math.sqrt(k);
        const refX = -(eta * ny + sq) * nx;
        const refY = eta - (eta * ny + sq) * ny;
        p[i] = refX * ((y * bezelWidth + glassThickness) / refY);
      }
    }
    return p;
  }

  _generateMaps(w, h, radius, bezelWidth, profile, maxDisp, balanced) {
    const angle = Math.PI / 3;
    const sv = [Math.cos(angle), Math.sin(angle)];
    
    const dispCanvas = document.createElement('canvas');
    const specCanvas = document.createElement('canvas');
    dispCanvas.width = specCanvas.width = w;
    dispCanvas.height = specCanvas.height = h;
    
    const dispCtx = dispCanvas.getContext('2d', { willReadFrequently: true });
    const specCtx = specCanvas.getContext('2d', { willReadFrequently: true });
    const dispImg = dispCtx.createImageData(w, h);
    const specImg = specCtx.createImageData(w, h);
    const dD = dispImg.data;
    const sD = specImg.data;
    
    for (let i = 0; i < dD.length; i += 4) { dD[i] = 128; dD[i+1] = 128; dD[i+2] = 0; dD[i+3] = 255; }
    sD.fill(0);
    
    const r = radius, rSq = r * r, r1Sq = (r + 1) ** 2, rBSq = Math.max(r - bezelWidth, 0) ** 2;
    const wB = w - r * 2, hB = h - r * 2, S = profile.length;
    
    for (let y1 = 0; y1 < h; y1++) {
      for (let x1 = 0; x1 < w; x1++) {
        const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
        const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
        const dSq = x * x + y * y;
        if (dSq > r1Sq || dSq < rBSq) continue;
        
        const dist = Math.sqrt(dSq);
        const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
        if (op <= 0 || dist === 0) continue;
        
        const idx = (y1 * w + x1) * 4;
        
        // Displacement calculations
        const fromSide = r - dist;
        const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
        const disp = profile[bi] || 0;
        const dX = (-x / dist * disp) / maxDisp, dY = (-y / dist * disp) / maxDisp;
        dD[idx] = (128 + dX * 127 * op + 0.5) | 0;
        dD[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
        
        // Specular calculations
        const dot = balanced ? 1 : Math.abs((x / dist) * sv[0] + (-y / dist) * sv[1]);
        const edge = Math.sqrt(Math.max(0, 1 - (1 - (r - dist)) ** 2));
        const col = (255 * dot * edge) | 0;
        sD[idx] = sD[idx + 1] = sD[idx + 2] = col; 
        sD[idx + 3] = (col * dot * edge * op) | 0;
      }
    }
    
    dispCtx.putImageData(dispImg, 0, 0);
    specCtx.putImageData(specImg, 0, 0);
    
    return { dispUrl: dispCanvas.toDataURL(), specUrl: specCanvas.toDataURL() };
  }

  _buildOrUpdate(el) {
    const state = this.targets.get(el);
    if (!state) return;

    const w = el.offsetWidth, h = el.offsetHeight;
    if (w < 4 || h < 4) return;
    
    const cssR = parseFloat(getComputedStyle(el).borderTopLeftRadius || '0');
    const r = Math.max(2, Math.min(cssR || 24, w / 2, h / 2));
    const cfg = this._getConfig(el);
    
    const bezel = Math.min(cfg.bezelWidth, r - 1, Math.min(w, h) / 2 - 1);
    const profile = this._calcRefractionProfile(cfg.glassThickness, bezel, cfg.ior, 128);
    const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
    
    const maps = this._generateMaps(w, h, r, bezel, profile, maxDisp, cfg.balancedSpecular);
    
    if (state.filterNode) state.filterNode.remove();
    
    const id = 'lg-filter-' + Math.random().toString(36).slice(2, 10);
    const filterNode = this._createSvgEl('filter', {
      id, x: 0, y: 0, width: w, height: h,
      filterUnits: 'userSpaceOnUse', primitiveUnits: 'userSpaceOnUse',
      'color-interpolation-filters': 'sRGB'
    });

    const tr = this._createSvgEl('feComponentTransfer', { in: 'spec_layer', result: 'spec_faded' });
    tr.appendChild(this._createSvgEl('feFuncA', { type: 'linear', slope: cfg.specularOpacity }));

    filterNode.append(
      this._createSvgEl('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: cfg.blur, result: 'blurred' }),
      this._createSvgEl('feImage', { href: maps.dispUrl, width: w, height: h, result: 'disp_map' }),
      this._createSvgEl('feDisplacementMap', {
        in: 'blurred', in2: 'disp_map', scale: maxDisp * cfg.scaleRatio,
        xChannelSelector: 'R', yChannelSelector: 'G', result: 'displaced'
      }),
      this._createSvgEl('feColorMatrix', { in: 'displaced', type: 'saturate', values: cfg.specularSat, result: 'displaced_sat' }),
      this._createSvgEl('feImage', { href: maps.specUrl, width: w, height: h, result: 'spec_layer' }),
      this._createSvgEl('feComposite', { in: 'displaced_sat', in2: 'spec_layer', operator: 'in', result: 'spec_masked' }),
      tr,
      this._createSvgEl('feBlend', { in: 'spec_masked', in2: 'displaced', mode: 'normal', result: 'with_sat' }),
      this._createSvgEl('feBlend', { in: 'spec_faded', in2: 'with_sat', mode: 'normal' })
    );
    
    this.defs.appendChild(filterNode);
    state.filterNode = filterNode;
    
    // اعمال فیلتر تولید شده به استایل المان
    state.refr.style.borderRadius = state.tint.style.borderRadius = `${r}px`;
    state.refr.style.backdropFilter = state.refr.style.webkitBackdropFilter = `url(#${id})`;
    state.tint.style.backgroundColor = `rgba(${cfg.tintColor},${cfg.tintOpacity})`;
    state.tint.style.boxShadow = `inset 0 0 ${cfg.innerShadowBlur}px ${cfg.innerShadowSpread}px ${cfg.innerShadow}`;
  }

  // آماده‌سازی اولیه المان و تزریق دیو‌های داخلی
  apply(el) {
    if (this.targets.has(el)) return;

    const refr = document.createElement('div');
    refr.className = 'lg-layer lg-refraction';
    const tint = document.createElement('div');
    tint.className = 'lg-layer lg-tint';

    el.insertBefore(tint, el.firstChild);
    el.insertBefore(refr, el.firstChild);

    // اگر مرورگر SVG ساپورت نکرد، همینجا متوقف شو (CSS Fallback خودش مات می‌کند)
    if (!this.isSvgSupported) return;

    this.targets.set(el, { isVisible: false, filterNode: null, refr, tint, timer: null });
    
    // واگذاری بررسی رندر به Observer ها
    this.io.observe(el);
    this.ro.observe(el);
  }

  initAll() {
    document.querySelectorAll('.liquid-glass').forEach(el => this.apply(el));
  }
}
