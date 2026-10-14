/* ==========================================================
   RACSHELL — Katalog verisi
   ----------------------------------------------------------
   Ürün eklemek / değiştirmek için sadece bu dosyayı düzenleyin.

   images : Ürün fotoğrafları (ilki kapak, ikincisi kartın üzerine
            gelince görünen fotoğraf). Fotoğrafları
            assets/urunler/<urun-adi>/ klasörüne koyun.
   price  : İsteğe bağlı. Boş bırakılırsa fiyat gösterilmez.
   sizes  : İsteğe bağlı. Boş bırakılırsa beden alanı gizlenir.
   tag    : İsteğe bağlı küçük etiket ("Yeni", "Favori" ...)
   ========================================================== */

const CATEGORIES = [
  { id: "elbise", label: "Elbise", note: "Günlük & Davet" },
  { id: "takim",  label: "Takım",  note: "Ceket & Set" },
  { id: "canta",  label: "Çanta",  note: "Günlük & Gece" },
  { id: "taki",   label: "Takı",   note: "Bileklik & Yüzük" }
];

const PRODUCTS = [
  {
    name: "Kırmızı Korse Takım",
    category: "takim",
    colors: ["#d4231f"],
    tag: "Yeni", tagStyle: "red",
    desc: "Fermuar ve bağcık detaylı korse, yüksek bel geniş paça pantolonla takım. Cesur kırmızısıyla dikkatleri üzerinize çekin.",
    images: [
      "assets/urunler/korse-takim/korse-takim-1.jpg",
      "assets/urunler/korse-takim/korse-takim-detay-2.jpg",
      "assets/urunler/korse-takim/korse-takim-2.jpg",
      "assets/urunler/korse-takim/korse-takim-3.jpg",
      "assets/urunler/korse-takim/korse-takim-4.jpg",
      "assets/urunler/korse-takim/korse-takim-detay-1.jpg"
    ]
  },
  {
    name: "Kırmızı A Kesim Elbise",
    category: "elbise",
    colors: ["#b5121b"],
    tag: "Yeni", tagStyle: "red",
    desc: "Sıfır kol, bisiklet yaka ve vücudu saran A kesim. Sade, zamansız ve her davete yakışan bir kırmızı.",
    images: [
      "assets/urunler/kirmizi-elbise/kirmizi-elbise-1.jpg",
      "assets/urunler/kirmizi-elbise/kirmizi-elbise-detay-1.jpg",
      "assets/urunler/kirmizi-elbise/kirmizi-elbise-2.jpg",
      "assets/urunler/kirmizi-elbise/kirmizi-elbise-3.jpg",
      "assets/urunler/kirmizi-elbise/kirmizi-elbise-4.jpg"
    ]
  },
  {
    name: "Siyah Asimetrik Takım",
    category: "takim",
    colors: ["#1c1a1a"],
    tag: "Yeni",
    desc: "Asimetrik kesim, tek düğmeli ceket ve bilek boy pantolon. Keskin hatlarıyla güçlü ve zarif bir duruş.",
    images: [
      "assets/urunler/siyah-takim/siyah-takim-1.jpg",
      "assets/urunler/siyah-takim/siyah-takim-detay-1.jpg",
      "assets/urunler/siyah-takim/siyah-takim-2.jpg",
      "assets/urunler/siyah-takim/siyah-takim-3.jpg",
      "assets/urunler/siyah-takim/siyah-takim-detay-2.jpg"
    ]
  },

  /* ---------- Çanta ---------- */
  {
    name: "Altın Geometrik Clutch",
    category: "canta",
    colors: ["#c9a24e"],
    tag: "Yeni",
    desc: "Geometrik kesimli metalik yüzeyiyle davetlerin ve özel gecelerin parlayan tamamlayıcısı.",
    images: ["assets/urunler/canta/altin-clutch.jpg"]
  },
  {
    name: "Gümüş Metalik Clutch",
    category: "canta",
    colors: ["#c9cbd0"],
    desc: "Yumuşak büzgülü formu ve klipsli kapağıyla gece kombinlerinize ışıltı katar.",
    images: ["assets/urunler/canta/gumus-clutch.jpg"]
  },
  {
    name: "Leopar Desenli Tote Çanta",
    category: "canta",
    colors: ["#c9a679", "#2a2522"],
    desc: "Geniş iç hacmi ve leopar deseniyle hem şık hem kullanışlı; günün her anına eşlik eder.",
    images: ["assets/urunler/canta/leopar-tote-canta.jpg"]
  },
  {
    name: "Mor Desenli Çanta",
    category: "canta",
    colors: ["#6b2350"],
    desc: "Canlı mor tonu ve desenli yüzeyiyle kombinlerinize renk katan kompakt bir model.",
    images: ["assets/urunler/canta/mor-desenli-canta.jpg"]
  },

  /* ---------- Takı ---------- */
  {
    name: "Altın Rengi Bileklikler",
    category: "taki",
    colors: ["#c9a24e"],
    desc: "Tek başına ya da kat kat; zincir, örgü ve kelepçe modellerinde altın rengi bileklik seçenekleri.",
    images: ["assets/urunler/taki/bileklikler.jpg"]
  },
  {
    name: "Yüzük Koleksiyonu",
    category: "taki",
    colors: ["#c9a24e", "#d9d9d9"],
    desc: "Minimal ve detaylı modellerle her tarza uygun yüzük seçenekleri. Modelleri mağazamızda inceleyebilirsiniz.",
    images: ["assets/urunler/taki/yuzukler.jpg"]
  }
];
