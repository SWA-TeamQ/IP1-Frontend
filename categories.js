

(function () {
  'use strict';

  
  function qs(sel, ctx = document) { return ctx.querySelector(sel); }
  function qsa(sel, ctx = document) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function debounce(fn, wait = 160) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  }
  function capitalize(s){ return s ? (s.charAt(0).toUpperCase() + s.slice(1)) : ''; }
  function fmtPrice(n){ return `$${Number(n || 0).toFixed(2)}`; }

  function init() {
    if (!window.PAGE_DATA) {
      console.warn('categories.js: PAGE_DATA not found. Provide PAGE_DATA before loading this script.');
      return;
    }
    const DATA = window.PAGE_DATA;
    const ITEMS = Array.isArray(DATA.items) ? DATA.items.slice() : [];
    const SUBS = Array.isArray(DATA.subcategories) ? DATA.subcategories.slice() : ['all'];
    const PER_PAGE = Number(DATA.perPage || 6);

    
    const gridEl = qs('#grid');
    const paginationEl = qs('#pagination');
    const sideListEl = qs('.side-list');
    const searchInput = qs('#search');
    const sortSelect = qs('#sort');
    const priceInput = qs('#price');

    
    if (!gridEl) {
      console.error('categories.js: #grid element not found.');
      return;
    }
    if (!paginationEl) {
      console.warn('categories.js: #pagination not found — creating one.');
      const p = document.createElement('div');
      p.id = 'pagination';
      gridEl.after(p);
    }

    
    if (sideListEl) {
      sideListEl.innerHTML = '';
      SUBS.forEach(s => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.sub = s;
        btn.textContent = (s === 'all') ? 'All' : capitalize(s);
        sideListEl.appendChild(btn);
      });
    }

    
    const state = {
      items: ITEMS,
      filters: {
        sub: DATA.initialSub || 'all',
        search: DATA.initialSearch || '',
        maxPrice: Number(DATA.initialMaxPrice != null ? DATA.initialMaxPrice : (priceInput ? Number(priceInput.value || 1e9) : 1e9)),
      },
      sort: (sortSelect && sortSelect.value) || 'featured',
      page: 1,
      perPage: PER_PAGE
    };

    
    if (priceInput && state.filters.maxPrice) priceInput.value = state.filters.maxPrice;
    if (sortSelect && state.sort) sortSelect.value = state.sort;
    if (searchInput && state.filters.search) searchInput.value = state.filters.search;

    
    function pipeline() {
      const f = state.filters;
      let out = state.items.filter(p => {
        if (f.sub && f.sub !== 'all' && p.sub !== f.sub) return false;
        if (p.price > f.maxPrice) return false;
        if (f.search) {
          const s = f.search.toLowerCase();
          if (!p.title.toLowerCase().includes(s) && !(p.category && p.category.toLowerCase().includes(s))) return false;
        }
        return true;
      });

      
      switch (state.sort) {
        case 'price-asc': out.sort((a,b) => a.price - b.price); break;
        case 'price-desc': out.sort((a,b) => b.price - a.price); break;
        case 'rating-desc': out.sort((a,b) => (b.rating||0) - (a.rating||0)); break;
        case 'newest': out.sort((a,b) => new Date(b.created || 0) - new Date(a.created || 0)); break;
        default: out.sort((a,b) => (a.id || 0) - (b.id || 0));
      }
      return out;
    }

  
    function render() {
      const visible = pipeline();
      const total = visible.length;
      const pages = Math.max(1, Math.ceil(total / state.perPage));
      if (state.page > pages) state.page = pages;
      const start = (state.page - 1) * state.perPage;
      const pageItems = visible.slice(start, start + state.perPage);

      // grid
      gridEl.innerHTML = '';
      if (!pageItems.length) {
        gridEl.innerHTML = `<div class="muted">No products found. Try widening filters.</div>`;
      } else {
        const frag = document.createDocumentFragment();
        pageItems.forEach(p => {
          const card = document.createElement('article');
          card.className = 'card';
          card.innerHTML = `
            <img src="${escapeHtml(p.img || '')}" alt="${escapeHtml(p.title || '')}">
            <h3>${escapeHtml(p.title || '')}</h3>
            <div class="meta">${escapeHtml(p.sub || p.category || '')} · ${p.rating ? (p.rating + ' ★') : ''}</div>
            <div class="price">${fmtPrice(p.price)}</div>
          `;
          frag.appendChild(card);
        });
        gridEl.appendChild(frag);
      }


      renderPagination(pages, total);
      highlightSidebar();
    }

    function renderPagination(pages, total) {
      const pEl = paginationEl || qs('#pagination');
      pEl.innerHTML = '';

      const frag = document.createDocumentFragment();
      frag.appendChild(makeBtn('Prev', state.page > 1, ()=> { state.page = Math.max(1, state.page - 1); render(); }));

      // numeric pages (center up to 5)
      const visible = 5;
      let start = Math.max(1, state.page - Math.floor(visible/2));
      let end = Math.min(pages, start + visible - 1);
      if (end - start + 1 < visible) start = Math.max(1, end - visible + 1);

      if (start > 1) {
        frag.appendChild(makeNumBtn(1));
        if (start > 2) frag.appendChild(ellipsis());
      }
      for (let i = start; i <= end; i++) frag.appendChild(makeNumBtn(i));
      if (end < pages) {
        if (end < pages - 1) frag.appendChild(ellipsis());
        frag.appendChild(makeNumBtn(pages));
      }

      frag.appendChild(makeBtn('Next', state.page < pages, ()=> { state.page = Math.min(pages, state.page + 1); render(); }));

      // summary
      const info = document.createElement('div');
      info.className = 'muted';
      info.style.minWidth = '160px';
      info.style.textAlign = 'center';
      info.textContent = `${total} items — page ${state.page}/${pages}`;
      frag.appendChild(info);

      pEl.appendChild(frag);

      function makeNumBtn(n) { return makeBtn(n, true, ()=> { state.page = n; render(); }, n === state.page); }
    }

    function makeBtn(label, enabled=true, onClick=()=>{}, active=false) {
      const b = document.createElement('button');
      b.className = 'page-btn' + (active ? ' active' : '');
      b.type = 'button';
      b.textContent = label;
      b.disabled = !enabled;
      b.addEventListener('click', onClick);
      return b;
    }
    function ellipsis() { const d = document.createElement('div'); d.className = 'page-btn'; d.textContent = '…'; d.style.pointerEvents = 'none'; return d; }

   
    function highlightSidebar(){
      if (!sideListEl) return;
      const buttons = qsa('.side-list [data-sub]');
      buttons.forEach(btn => {
        const s = btn.dataset.sub || 'all';
        if ((state.filters.sub || 'all') === s) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    }

    
    if (sideListEl) {
      sideListEl.addEventListener('click', (ev) => {
        const btn = ev.target.closest('button');
        if (!btn || !btn.dataset) return;
        state.filters.sub = btn.dataset.sub || 'all';
        state.page = 1;
        render();
      });
    }

   
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        state.filters.search = e.target.value.trim();
        state.page = 1;
        render();
      }, 200));
    }
    if (priceInput) {
      priceInput.addEventListener('input', debounce((e) => {
        state.filters.maxPrice = Number(e.target.value);
        state.page = 1;
        render();
      }, 120));
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        state.page = 1;
        render();
      });
    }

  
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
