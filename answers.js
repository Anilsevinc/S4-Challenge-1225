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
                sonuclar.push({
                    ...urun, // Ürünün tüm özelliklerini kopyalıyoruz ve kategori bilgisini ekliyoruz
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

