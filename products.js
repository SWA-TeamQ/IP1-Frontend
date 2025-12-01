(() => {

  const PRODUCTS = [
    { id:1, title:"Wireless Headphones", category:"electronics", price:129.99, rating:4.5, created:"2025-01-10" },
    { id:2, title:"Men's T-shirt", category:"clothing", price:19.99, rating:4.0,created:"2025-03-01" },
    { id:3, title:"Romantic Novel", category:"books", price:9.99, rating:4.2, created:"2024-11-11" },
    { id:4, title:"Organic Bananas — 1kg", category:"groceries", price:2.99, rating:4.7, created:"2025-04-22" },
    { id:5, title:"Desk Lamp", category:"electronics", price:45.00, rating:4.3,created:"2025-02-12" },
    { id:6, title:"Women's Jeans", category:"clothing", price:49.99, rating:3.9, created:"2025-06-02" },
    { id:7, title:"Cookbook — Easy Meals", category:"books", price:14.99, rating:4.8,  created:"2025-06-12" },
    { id:8, title:"Hand Sanitizer 250ml", category:"groceries", price:3.99, rating:4.1, created:"2025-03-30" },
    { id:9, title:"Bluetooth Speaker", category:"electronics", price:79.00, rating:4.6, created:"2025-07-01" },
    { id:10, title:"Novelty Mug", category:"others", price:11.99, rating:3.8,  created:"2024-12-01" },
  ];

  const state = {
    allProducts: PRODUCTS,
    filters: { search:'', category:'all', minRating:0, maxPrice:1000 },
    sort:'featured',
    page:1,
    perPage:6
  };

  const productGrid = document.getElementById('productGrid');
  const searchInput = document.getElementById('search');
  const categorySelect = document.getElementById('categorySelect');
  const ratingSelect = document.getElementById('ratingSelect');
  const priceRange = document.getElementById('priceRange');
  const priceLabel = document.getElementById('priceLabel');
  const sortSelect = document.getElementById('sortSelect');
  const paginationEl = document.getElementById('pagination');

  function debounce(fn, wait=200){
    let t;
    return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),wait); };
  }

  function formatPrice(p){ return `$${p.toFixed(2)}`; }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  function applyFiltersAndSort(){
    const f = state.filters;
    let items = state.allProducts.filter(p=>{
      if (f.category!=='all' && p.category!==f.category) return false;
      if (p.price > f.maxPrice) return false;
      if (p.rating < f.minRating) return false;
      if (f.search && !p.title.toLowerCase().includes(f.search.toLowerCase())) return false;
      return true;
    });

    switch(state.sort){
      case 'price-asc': items.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': items.sort((a,b)=>b.price-a.price); break;
      case 'rating-desc': items.sort((a,b)=>b.rating-a.rating); break;
      case 'newest': items.sort((a,b)=>new Date(b.created)-new Date(a.created)); break;
      default: items.sort((a,b)=>a.id-b.id);
    }

    return items;
  }

  function render(){
    const items = applyFiltersAndSort();
    const total = items.length;
    const pages = Math.max(1, Math.ceil(total/state.perPage));

    if (state.page > pages) state.page = pages;

    const start = (state.page-1)*state.perPage;
    const visible = items.slice(start,start+state.perPage);

    productGrid.innerHTML = visible.length === 0
      ? `<div class="no-results">No products found.</div>`
      : visible.map(p=>`
        <article class="product-card">
          <div class="product-media">
            <img src="${p.img}" alt="">
          </div>
          <h3 class="product-title">${escapeHtml(p.title)}</h3>
          <div class="product-meta">${capitalize(p.category)} · ${p.rating} ★</div>
          <div class="price-row">
            <div class="price">${formatPrice(p.price)}</div>
            <div class="badge">ID ${p.id}</div>
          </div>
        </article>`).join('');

    renderPagination(pages,total);
  }

  function renderPagination(pages,total){
    paginationEl.innerHTML = '';

    const makeBtn = (label, active=false, disabled=false, onClick=()=>{})=>{
      const b=document.createElement('button');
      b.className='page-btn'+(active?' active':'');
      b.textContent=label;
      b.disabled=disabled;
      b.onclick=onClick;
      return b;
    };

    paginationEl.appendChild(makeBtn('Prev',false,state.page===1,()=>{state.page--;render()}));

    for(let i=1;i<=pages;i++){
      paginationEl.appendChild(makeBtn(i,state.page===i,false,()=>{state.page=i;render()}));
    }

    paginationEl.appendChild(makeBtn('Next',false,state.page===pages,()=>{state.page++;render()}));
  }

  searchInput.addEventListener('input', debounce(e=>{
    state.filters.search=e.target.value;
    state.page=1;
    render();
  }));

  categorySelect.addEventListener('change', e=>{
    state.filters.category=e.target.value;
    state.page=1;
    render();
  });

  ratingSelect.addEventListener('change', e=>{
    state.filters.minRating=Number(e.target.value);
    state.page=1;
    render();
  });

  priceRange.addEventListener('input', e=>{
    state.filters.maxPrice=Number(e.target.value);
    priceLabel.textContent=`$${e.target.value}`;
    state.page=1;
    render();
  });

  sortSelect.addEventListener('change', e=>{
    state.sort=e.target.value;
    state.page=1;
    render();
  });

  priceLabel.textContent=`$${priceRange.value}`;
  render();

})();
