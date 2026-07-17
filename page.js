import { useState } from 'react';

// Dijon Gece Bakkalı (Épicerie) Gerçek Piyasa Fiyatları ve Ürün Listesi
// Görseller Open Food Facts / Direct CDN URL'leri ile entegredir.
const PRODUCTS = [
  { id: 1, name: "Heineken Pack (6x33cl)", price: 9.99, category: "beer", image: "https://images.openfoodfacts.org/images/products/871/200/002/5713/front_fr.43.400.jpg", desc: "Soğuk servis edilir." },
  { id: 2, name: "Cody's Vody (250ml)", price: 7.50, category: "beer", image: "https://images.openfoodfacts.org/images/products/401/285/200/1851/front_de.6.400.jpg", desc: "%18 Vol. Enerji ve votka karışımı." },
  { id: 3, name: "Desperados Pack (3x33cl)", price: 10.00, category: "beer", image: "https://images.openfoodfacts.org/images/products/350/117/056/3274/front_fr.112.400.jpg", desc: "Tekila aromalı bira." },
  { id: 4, name: "Vodka Poliakov (70cl)", price: 29.99, category: "spirit", image: "https://images.openfoodfacts.org/images/products/314/717/001/0177/front_fr.54.400.jpg", desc: "%37.5 Vol. Premium üç kez damıtılmış." },
  { id: 5, name: "Whisky William Peel (70cl)", price: 39.99, category: "spirit", image: "https://images.openfoodfacts.org/images/products/326/547/121/0019/front_fr.46.400.jpg", desc: "Blended Scotch Whisky." },
  { id: 6, name: "Whisky Jack Daniel's (70cl)", price: 41.99, category: "spirit", image: "https://images.openfoodfacts.org/images/products/509/987/300/1392/front_fr.20.400.jpg", desc: "Klasik Old No. 7 Tennessee." },
  { id: 7, name: "Coca-Cola (1.75L)", price: 5.00, category: "soda", image: "https://images.openfoodfacts.org/images/products/544/900/013/1805/front_fr.420.400.jpg", desc: "Orijinal tat soğuk içecek." },
  { id: 8, name: "Pringles Original (175g)", price: 4.80, category: "snack", image: "https://images.openfoodfacts.org/images/products/505/399/013/8722/front_fr.459.400.jpg", desc: "Klasik tuzlu patates cipsi." },
  { id: 9, name: "Doritos Nacho Cheese (170g)", price: 5.00, category: "snack", image: "https://images.openfoodfacts.org/images/products/316/893/001/1004/front_fr.132.400.jpg", desc: "Yoğun peynirli mısır cipsi." }
];

export default function NightShop() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const MIN_ORDER = 30.00;
  const DELIVERY_FEE = 5.00;
  const WHATSAPP_NUMBER = "33689039099"; // 0689039099 numarası uluslararası formata çevrildi

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + change;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }).filter(Boolean));
  };

  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const isOrderValid = subTotal >= MIN_ORDER;
  const total = subTotal + DELIVERY_FEE;

  const handleOrder = (e) => {
    e.preventDefault();
    if (!isOrderValid || !address || !phone || !name) return;

    // WhatsApp Mesaj Taslağı Hazırlama
    let message = `🌃 *NIGHT SHOP - DIJON SIPARISI*\n`;
    message += `----------------------------------\n`;
    cart.forEach(item => {
      message += `• ${item.qty}x ${item.name} - ${(item.price * item.qty).toFixed(2)} €\n`;
    });
    message += `----------------------------------\n`;
    message += `💰 *Ara Toplam:* ${subTotal.toFixed(2)} €\n`;
    message += `🚗 *Teslimat Ücreti:* ${DELIVERY_FEE.toFixed(2)} €\n`;
    message += `⭐ *GENEL TOPLAM:* ${total.toFixed(2)} €\n\n`;
    message += `📍 *Müşteri Bilgileri:*\n`;
    message += `👤 İsim: ${name}\n`;
    message += `📞 Telefon: ${phone}\n`;
    message += `🏠 Adres: ${address}\n\n`;
    message += `_Lütfen siparişimi kapıda ödeme (nakit/kart) olarak gönderin._`;

    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
  };

  const filteredProducts = selectedCategory === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f3f4f6] font-sans antialiased">
      {/* Header */}
      <header className="border-b-2 border-blue-600 bg-slate-900 p-6 text-center shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-widest text-white uppercase">🌃 NIGHT SHOP</h1>
        <p className="text-blue-500 font-semibold mt-1">Dijon İçi 7/24 Hızlı Gece Servisi</p>
        <div className="inline-block mt-4 rounded-full bg-slate-800 px-4 py-2 text-xs border border-slate-700">
          🕒 <strong className="text-white">24 SAAT AÇIK</strong> &nbsp;|&nbsp; 
          💰 Min: <strong className="text-blue-400">30.00 €</strong> &nbsp;|&nbsp; 
          🚗 Teslimat: <strong className="text-blue-400">5.00 €</strong>
        </div>
      </header>

      <div className="container mx-auto p-4 lg:flex lg:gap-8">
        {/* Kategoriler ve Ürünler */}
        <main className="lg:w-2/3">
          {/* Kategori Seçici */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {["all", "beer", "spirit", "soda", "snack"].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900" 
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat === "all" && "Hepsi"}
                {cat === "beer" && "🍺 Bira & Alkollü Karışımlar"}
                {cat === "spirit" && "🍾 Sert Alkollüler"}
                {cat === "soda" && "🥤 Meşrubatlar"}
                {cat === "snack" && "🍿 Cennetler (Cips/Çerez)"}
              </button>
            ))}
          </div>

          {/* Ürün Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-blue-600 transition-all">
                <div className="relative h-40 w-full mb-3 flex items-center justify-center bg-white rounded-lg p-2 overflow-hidden">
                  <img src={product.image} alt={product.name} className="max-h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{product.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-blue-400">{product.price.toFixed(2)} €</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-extrabold text-sm transition-colors"
                  >
                    + Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Sepet ve Bilgiler (Yan Panel) */}
        <aside className="lg:w-1/3 mt-8 lg:mt-0 bg-slate-900 border border-slate-800 p-6 rounded-xl self-start sticky top-4">
          <h2 className="text-xl font-bold text-white border-l-4 border-blue-500 pl-3 mb-4">Sepetiniz</h2>
          
          {cart.length === 0 ? (
            <p className="text-slate-500 text-sm">Sepetiniz boş. Ürün eklemeye başlayın!</p>
          ) : (
            <div>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                    <div>
                      <span className="font-semibold text-white">{item.name}</span>
                      <div className="text-xs text-blue-400 font-bold">{(item.price * item.qty).toFixed(2)} €</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="bg-slate-800 px-2 py-1 rounded text-white font-bold hover:bg-slate-700">-</button>
                      <span className="font-bold text-white">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="bg-slate-800 px-2 py-1 rounded text-white font-bold hover:bg-slate-700">+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fiyatlandırma Bilgileri */}
              <div className="bg-slate-950 p-4 rounded-lg mb-6 text-sm space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Ara Toplam:</span>
                  <span>{subTotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Teslimat Ücreti (Livraison):</span>
                  <span>{DELIVERY_FEE.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-white border-t border-slate-850 pt-2 text-base">
                  <span>Genel Toplam:</span>
                  <span className="text-blue-400">{total.toFixed(2)} €</span>
                </div>
              </div>

              {/* Sipariş Formu */}
              <form onSubmit={handleOrder} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Adınız Soyadınız" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white focus:border-blue-600 focus:outline-none"
                />
                <input 
                  type="text" 
                  placeholder="Telefon Numaranız" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white focus:border-blue-600 focus:outline-none"
                />
                <textarea 
                  placeholder="Teslimat Adresi (Dijon)" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required
                  rows="3"
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-sm text-white focus:border-blue-600 focus:outline-none"
                />

                {/* Dinamik Limit Kontrol Butonu */}
                {!isOrderValid ? (
                  <div className="bg-red-950/40 text-red-400 border border-red-900 text-xs p-3 rounded-lg text-center font-semibold">
                    ⚠️ Sipariş verebilmek için en az 30.00 € değerinde ürün eklemelisiniz. (Eksik: {(MIN_ORDER - subTotal).toFixed(2)} €)
                  </div>
                ) : (
                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-lg text-sm transition-all shadow-lg shadow-emerald-900"
                  >
                    💬 WhatsApp ile Siparişi Gönder
                  </button>
                )}
              </form>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
