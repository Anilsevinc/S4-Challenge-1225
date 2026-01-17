const restoran = require('./data.js');

/**
 SORU 1: Menüde Arama Sistemi
Görev: Menüdeki ürünleri farklı kriterlere göre arayabilen bir higher-order function yaz.
İstenenler:

- menudeAra adında bir higher-order function oluştur
- Callback ile dinamik arama kriterleri belirlenebilsin
- Bulunan ürünlerin kategori bilgisi de dahil edilsin

// 50 TL ve altı ürünler
// 500 kalorinin altındaki ürünler  
// "domates" malzemesi içeren ürünler
 */

// ÇÖZÜM 1: Menüde Arama Sistemi
function menudeAra(restoran, callback) {
    const sonuclar = [];
    // Her menü kategorisini dolaşıyoruz
    restoran.menuler.forEach((menu) => {
        // Her kategorideki ürünleri dolaşıyoruz
        menu.urunler.forEach((urun) => {
            // Callback fonksiyonu ile ürünü test edip koşulun sağlanması durumunda eklenir
            if (callback(urun)) {
                sonuclar.push({...urun, // Ürünün tüm özelliklerini kopyalıyoruz ve kategori bilgisini ekliyoruz
                    kategori: menu.kategori
                });
            }
        });
    });

    return sonuclar;
}

/*
// Testler
const ucuzFiyatliUrunler = menudeAra(restoran, (urun) => urun.fiyat <= 50);
const azKalorili = menudeAra(restoran, (urun) => urun.kalori < 500);
const domatesliUrunler = menudeAra(restoran, (urun) => urun.malzemeler.includes("domates"));

console.log("50 TL ve altı ürünler:", ucuzFiyatliUrunler);
console.log("500 kalorinin altındaki ürünler:", azKalorili);
console.log('"domates" malzemesi içeren ürünler:', domatesliUrunler);
*/


/**
 SORU 2: Sipariş İşleme Sistemi
Görev: Siparişleri detaylı şekilde işleyen bir sistem oluştur.
İstenenler:

- siparisiIsle higher-order function'ı yaz
- Her sipariş ürününü menüde bulup detaylarını getir
- Callback ile sipariş detayını özelleştirilebilir yap
- Sipariş toplam tutarını hesapla

 */

// ÇÖZÜM 2: Sipariş İşleme Sistemi
// Veri yapısı
/* restoran.siparisler -> array , array içinde obje,
obje içinde masa, garson, saat ve durum key, urunler ise array*/

// Sipariş objesi için  için siparis, siparişteki ürünler için restoran ve özelleştirmek için callback parametreleri
function siparisIsle(siparis, restoran, callback) {
    const tumUrunler = [];    // Tüm ürünleri tutması için array
    // Restorandaki tüm menüleri dolaşması için forEach
    restoran.menuler.forEach((menu) => {
        // Menüdeki ürünleri dolaşma - urun burada array ekleyeceği ise obje
        menu.urunler.forEach((urun) => {
            tumUrunler.push({...urun, kategori: menu.kategori}); // Kategoriyi de ekleyerek yeni obje
        });

    });
    //console.log(tumUrunler); // Test
    
    // çıktı olarak dönecek obje 
    // parametre olarak verdiğimiz sipraisten burada bilgiler alınacak
    const siparisDetayi = {
        masa: siparis.masa,
        garson: siparis.garson,
        saat: siparis.saat,
        durum: siparis.durum,
        urunler: [],
        toplamTutar: 0
    };
    // Sipariş ürünlerinde dolaşma - urunler burada array - arrayin içindeki ürün özelliklerine bakacak
    siparis.urunler.forEach((siparisUrunu) => {
        // sipariste sadece id ve adet var bize adı fiyatı kalorisi vb özellikleri de lazım
        // tüm ürünlerden sipariş ürününün idsine göre ürünü bulma
        const bulunanUrun = tumUrunler.find(menuUrunu => menuUrunu.id === siparisUrunu.urunId);

        // Eğer o ürün varsayı kontrol edelim
        if (bulunanUrun) {
            const urununDetayi = {
            // toplam fiyatına ihtiyacımız var fiyatı ve adetini çarparak bulabiliriz
            urununToplamFiyati: bulunanUrun.fiyat * siparisUrunu.adet,
            //siparis objesinden alınacak
            adet: siparisUrunu.adet,
            // diğer özellikleri - menuden alınan
            id: bulunanUrun.id,
            ad: bulunanUrun.ad,
            fiyat: bulunanUrun.fiyat,
            kalori: bulunanUrun.kalori,
            malzemeler: bulunanUrun.malzemeler,
            kategori: bulunanUrun.kategori
            };
            
            //console.log(urununDetayi); // Test
            // 2 farklı yerden veri alıp objeyi oluşturduk

            // objeyi sipariş detayına ekliyoruz
            siparisDetayi.urunler.push(urununDetayi);
            // her eklenen ürünün fiyatını siparişin toplamına ekliyoruz
            siparisDetayi.toplamTutar += urununDetayi.urununToplamFiyati;
          
        }
    });
    
    // Özelleştirebilme için callback kontrolü ekliyoruz ve fonksiyopnu higher-order yapıyoruz
    if (callback) {
        return callback(siparisDetayi);
    }
    return siparisDetayi;

}

/* Testler 
const sonuc = siparisIsle(restoran.siparisler[0], restoran);
console.log(sonuc);

// siparişe indirim uygulayalım
const indirimli = siparisIsle(
    restoran.siparisler[0],
    restoran,
    (siparis) => {
        siparis.toplamTutar *= 0.9;
        return siparis;
    }
);

console.log(indirimli);
*/