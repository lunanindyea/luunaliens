const WA_NUMBER = "6285814568534";
const WA_TEMPLATE = "Halo kak aku mau pesan rabboki .... 5 pack ya";

const products = [
  {name:"Spicy Rabboki", price:28000, image:"https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80"},
  {name:"Original Kimbap", price:24000, image:"https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80"},
  {name:"Tteokbokki Seoul", price:26000, image:"https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=800&q=80"},
  {name:"Korean Fried Chicken", price:32000, image:"https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80"},
  {name:"Mandu Gyoza", price:22000, image:"https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80"},
  {name:"Cheesy Ramyeon", price:27000, image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"}
];

let cart = JSON.parse(localStorage.getItem("luunaliensCart") || "[]");
let currentSlide = 0;
let slideTimer;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function rupiah(n){ return "Rp" + n.toLocaleString("id-ID"); }
function saveCart(){ localStorage.setItem("luunaliensCart", JSON.stringify(cart)); }
function cartCount(){ return cart.reduce((sum,item)=>sum+item.qty,0); }

function renderCart(){
  $("#cartCount").textContent = cartCount();
  const items = $("#cartItems");
  const empty = $("#cartEmpty");
  const footer = $("#cartFooter");
  items.innerHTML = "";

  if(!cart.length){
    empty.style.display = "block";
    footer.style.display = "none";
    return;
  }
  empty.style.display = "none";
  footer.style.display = "block";

  cart.forEach(item=>{
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>${rupiah(item.price)}</p>
        <div class="qty">
          <button data-action="minus" data-name="${item.name}">−</button>
          <span>${item.qty}</span>
          <button data-action="plus" data-name="${item.name}">+</button>
        </div>
      </div>
      <strong>${rupiah(item.price*item.qty)}</strong>`;
    items.appendChild(row);
  });

  const total = cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  $("#cartTotal").textContent = rupiah(total);
}

function addToCart(name, price){
  const product = products.find(p=>p.name===name);
  const found = cart.find(i=>i.name===name);
  if(found) found.qty++;
  else cart.push({...product, price:Number(price), qty:1});
  saveCart();
  renderCart();
  openCart();
}

function changeQty(name, amount){
  const item = cart.find(i=>i.name===name);
  if(!item) return;
  item.qty += amount;
  if(item.qty<=0) cart = cart.filter(i=>i.name!==name);
  saveCart();
  renderCart();
}

function openCart(){
  $("#cartDrawer").classList.add("open");
  $("#cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart(){
  $("#cartDrawer").classList.remove("open");
  $("#cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function checkoutWhatsApp(){
  if(!cart.length){
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEMPLATE)}`,"_blank");
    return;
  }
  const lines = cart.map(i=>`• ${i.name} x${i.qty} — ${rupiah(i.price*i.qty)}`).join("\n");
  const total = cart.reduce((sum,i)=>sum+i.price*i.qty,0);
  const message = `Halo kak, aku mau pesan:\n${lines}\n\nTotal: ${rupiah(total)}\n\nMohon konfirmasi ketersediaan dan ongkir ya kak.`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`,"_blank");
}

function setWhatsAppFloat(){
  $("#waFloat").href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEMPLATE)}`;
}

// Slider
function showSlide(index){
  const slides = $$(".slide");
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((s,i)=>s.classList.toggle("active",i===currentSlide));
  $$(".dot").forEach((d,i)=>d.classList.toggle("active",i===currentSlide));
}
function startSlider(){
  clearInterval(slideTimer);
  slideTimer = setInterval(()=>showSlide(currentSlide+1),5000);
}
function initSlider(){
  const dots = $("#sliderDots");
  $$(".slide").forEach((_,i)=>{
    const d=document.createElement("button");
    d.className="dot"+(i===0?" active":"");
    d.setAttribute("aria-label",`Go to slide ${i+1}`);
    d.addEventListener("click",()=>{showSlide(i);startSlider();});
    dots.appendChild(d);
  });
  $("#nextSlide").addEventListener("click",()=>{showSlide(currentSlide+1);startSlider();});
  $("#prevSlide").addEventListener("click",()=>{showSlide(currentSlide-1);startSlider();});
  startSlider();
}

// Search + category
function filterProducts(){
  const q = $("#searchInput").value.trim().toLowerCase();
  const active = $(".category-tabs button.active")?.dataset.category || "all";
  let visible=0;
  $$(".product-card").forEach(card=>{
    const name=card.dataset.name.toLowerCase();
    const category=card.dataset.category;
    const matchQ=!q || name.includes(q) || card.textContent.toLowerCase().includes(q);
    const matchC=active==="all" || category===active;
    const show=matchQ&&matchC;
    card.style.display=show?"":"none";
    if(show) visible++;
  });
  $("#emptyState").hidden=visible!==0;
}
function initFilters(){
  $$(".category-tabs button").forEach(btn=>{
    btn.addEventListener("click",()=>{
      $$(".category-tabs button").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      filterProducts();
    });
  });
  $("#searchInput").addEventListener("input",filterProducts);
}

$$(".quick-add").forEach(btn=>{
  btn.addEventListener("click",()=>addToCart(btn.dataset.product, Number(btn.dataset.price.replace(",",""))));
});

$("#cartButton").addEventListener("click",openCart);
$("#closeCart").addEventListener("click",closeCart);
$("#cartOverlay").addEventListener("click",closeCart);
$("#cartItems").addEventListener("click",(e)=>{
  const btn=e.target.closest("button[data-action]");
  if(!btn) return;
  changeQty(btn.dataset.name,btn.dataset.action==="plus"?1:-1);
});
$("#checkoutButton").addEventListener("click",checkoutWhatsApp);
$("#cartBrowse").addEventListener("click",closeCart);

$("#searchPanel").addEventListener("keydown",(e)=>{
  if(e.key==="Escape") $("#searchPanel").classList.remove("open");
});
$(".search-toggle").addEventListener("click",()=>{
  $("#searchPanel").classList.toggle("open");
  if($("#searchPanel").classList.contains("open")) $("#searchInput").focus();
});
$("#closeSearch").addEventListener("click",()=>$("#searchPanel").classList.remove("open"));

$("#menuToggle").addEventListener("click",()=>{
  const nav=$(".nav");
  const open=nav.classList.toggle("mobile-open");
  nav.style.display=open?"flex":"";
  if(open){
    nav.style.position="absolute"; nav.style.top="70px"; nav.style.left="0"; nav.style.right="0";
    nav.style.background="var(--cream)"; nav.style.padding="25px 7%"; nav.style.flexDirection="column";
    nav.style.borderBottom="1px solid var(--line)";
  }
});

const translations = {
  id:{
    topbar:"FREE DELIVERY untuk area tertentu • Order via WhatsApp",
    navHome:"Home",navMenu:"Menu",navPromo:"Promo",navAbout:"About",navHow:"Cara Order",navFaq:"FAQ",
    heroEyebrow:"KOREAN FOOD • MADE WITH LOVE",heroTitle:"Your Korean<br><em>food fix</em> starts here.",
    heroText:"Nikmati comfort food Korea favoritmu — pedas, gurih, cheesy, dan selalu bikin pengen lagi.",
    heroCta:"Lihat Menu",heroSecondary:"Kenal luunaliens →",proofTitle:"Made for cravings.",proofText:"Korean taste, luunaliens way.",
    menuEyebrow:"THE MENU",menuTitle:"Pick your craving.",viewAll:"View all →",
    catAll:"All",catNoodles:"Noodles",catRice:"Rice & Roll",catSnack:"Snack",catChicken:"Chicken",
    promoText:"Mix your favorites dan dapatkan harga bundle yang lebih hemat.",promoCta:"Lihat Promo",
    aboutTitle:"A little taste of Korea, made for you.",
    aboutText:"luunaliens hadir untuk membawa Korean food yang fun, comforting, dan gampang dipesan. Dari satu bowl ramyeon sampai satu meja penuh kimbap — semuanya dibuat untuk menemani craving kamu.",
    howEyebrow:"SO EASY",howTitle:"Order in 3 steps.",step1Title:"Choose",step1Text:"Pilih makanan Korea favoritmu.",
    step2Title:"Add to cart",step2Text:"Atur jumlah pesanan di keranjang.",step3Title:"Chat us",step3Text:"Checkout lewat WhatsApp dan tunggu konfirmasi.",
    faqTitle:"Frequently asked.",faq1:"Bagaimana cara pesan?",faq1a:"Pilih menu, tambahkan ke keranjang, lalu klik checkout WhatsApp.",
    faq2:"Apakah bisa custom level pedas?",faq2a:"Bisa! Tulis request level pedas di pesan WhatsApp saat checkout.",
    faq3:"Apakah tersedia delivery?",faq3a:"Tersedia sesuai area layanan. Detail ongkir akan dikonfirmasi via WhatsApp.",
    footerText:"Korean food for your everyday cravings.",footerExplore:"Explore",footerHelp:"Help",
    waTooltip:"Chat via WhatsApp",cartTitle:"Your cravings.",cartEmpty:"Keranjangmu masih kosong.",cartBrowse:"Browse menu →",
    total:"Total",checkout:"Checkout via WhatsApp",checkoutNote:"Pesanan akan dikirim ke WhatsApp untuk konfirmasi.",
    searchPlaceholder:"Cari ramyeon, kimbap, tteokbokki..."
  },
  en:{
    topbar:"FREE DELIVERY in selected areas • Order via WhatsApp",
    navHome:"Home",navMenu:"Menu",navPromo:"Promo",navAbout:"About",navHow:"How to Order",navFaq:"FAQ",
    heroEyebrow:"KOREAN FOOD • MADE WITH LOVE",heroTitle:"Your Korean<br><em>food fix</em> starts here.",
    heroText:"Your favorite Korean comfort food — spicy, savory, cheesy, and always worth another bite.",
    heroCta:"View Menu",heroSecondary:"Meet luunaliens →",proofTitle:"Made for cravings.",proofText:"Korean taste, luunaliens way.",
    menuEyebrow:"THE MENU",menuTitle:"Pick your craving.",viewAll:"View all →",
    catAll:"All",catNoodles:"Noodles",catRice:"Rice & Roll",catSnack:"Snack",catChicken:"Chicken",
    promoText:"Mix your favorites and get a better bundle price.",promoCta:"See Promo",
    aboutTitle:"A little taste of Korea, made for you.",
    aboutText:"luunaliens brings fun, comforting Korean food that is easy to order. From one bowl of ramyeon to a table full of kimbap — made for your cravings.",
    howEyebrow:"SO EASY",howTitle:"Order in 3 steps.",step1Title:"Choose",step1Text:"Pick your favorite Korean food.",
    step2Title:"Add to cart",step2Text:"Set your quantities in the cart.",step3Title:"Chat us",step3Text:"Checkout via WhatsApp and wait for confirmation.",
    faqTitle:"Frequently asked.",faq1:"How do I order?",faq1a:"Choose a menu item, add it to your cart, then checkout via WhatsApp.",
    faq2:"Can I customize the spice level?",faq2a:"Yes! Add your preferred spice level in the WhatsApp message.",
    faq3:"Is delivery available?",faq3a:"Delivery depends on the service area. Shipping details will be confirmed via WhatsApp.",
    footerText:"Korean food for your everyday cravings.",footerExplore:"Explore",footerHelp:"Help",
    waTooltip:"Chat via WhatsApp",cartTitle:"Your cravings.",cartEmpty:"Your cart is empty.",cartBrowse:"Browse menu →",
    total:"Total",checkout:"Checkout via WhatsApp",checkoutNote:"Your order will be sent to WhatsApp for confirmation.",
    searchPlaceholder:"Search ramyeon, kimbap, tteokbokki..."
  }
};

function setLanguage(lang){
  document.documentElement.lang=lang;
  $$("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n;
    if(translations[lang][key]!==undefined) el.innerHTML=translations[lang][key];
  });
  $$("[data-i18n-placeholder]").forEach(el=>{
    const key=el.dataset.i18nPlaceholder;
    if(translations[lang][key]!==undefined) el.placeholder=translations[lang][key];
  });
  localStorage.setItem("luunaliensLang",lang);
}
$("#languageSelect").addEventListener("change",e=>setLanguage(e.target.value));

initSlider();
initFilters();
renderCart();
setWhatsAppFloat();
const savedLang=localStorage.getItem("luunaliensLang")||"id";
$("#languageSelect").value=savedLang;
setLanguage(savedLang);
