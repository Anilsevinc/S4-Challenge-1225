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

/**
 SORU 3: Malzeme Envanter Sistemi
Görev: Siparişlerin malzeme tüketimini hesaplayan ve stok kontrolü yapan bir sistem yaz.
İstenenler:

- Sipariş detaylarından kullanılan malzemeleri topla
- Stok durumunu kontrol et
- Stok uyarıları ver (critical: %20'nin altı, low: %50'nin altı)
 */

// ÇÖZÜM 3: Malzeme Kontrol Sistemi
function malzemeKullanimi(siparis, restoran) {
    const kullanilanMalzemeler = {}; // Hangi malzemeler ne kadar kullanılmış olduğunu tutacak obje

    // Menüdeki tüm ürünler
    // flatmap kullandık ki array içi array durumunda tek arraye indirgesin
    const tumUrunler = restoran.menuler.flatmap(menu => menu.urunler.map(urun => ({ ...urun, kategori: menu.kategori }))
    );

    siparis.urunler.forEach((siparisUrunu) => {
        const bulunanUrun = tumUrunler.find(urun => urun.id === siparisUrunu.urunId);

        // id ler ile urunu bulduktan sonra mazlemelerini inceleyip kullanılan malzemelere ekliyoruz
        if (bulunanUrun) {
            bulunanUrun.malzemeler.forEach((malzeme) => {
                if (!kullanilanMalzemeler[malzeme]) {
                    kullanilanMalzemeler[malzeme] = 0;
                }
                kullanilanMalzemeler[malzeme] += siparisUrunu.adet;
            }
            );
        }
        // test 
        //console.log(kullanilanMalzemeler);
    });



    // Stok durumunu hesaplama

    const stokDurumu = {};

    //Object.keys objenin keylerini alır ve array olarak döner objeye forEach uygulayamayacağımız için arraye çeviriyoruz
    Object.keys(kullanilanMalzemeler).forEach((malzeme) => {
        // restorandan stoğu, kullanılan malzemeler objesindende miktarı alıp stok hesabı yapıyoruz
        const mevcutStok = restoran.stok[malzeme];
        const kullanilanMiktar = kullanilanMalzemeler[malzeme];
        const kalanStok = mevcutStok - kullanilanMiktar;
        const stokYuzdesi = (kalanStok / mevcutStok) * 100; // Stok yüzdesi hesaplama

        // stok durumuna göre durum hangi düzeyde olduğunu bildiriyoruz

        let durum;

        if (stokYuzdesi < 20) {
            durum = "critical";
        } else if (stokYuzdesi < 50) {
            durum = "low";
        } else {
            durum = "normal";
        }

        stokDurumu[malzeme] = {
            kullanilan: kullanilanMiktar,
            kalan: kalanStok,
            durum: durum
        };


    });

    return stokDurumu;


}//malzemeKullanimi-fonksiyon-bitişi

/* Test 
const rapor = malzemeKullanimi(restoran.siparisler[0], restoran);
console.log(rapor);
*/

/**
 SORU 4: Garson Performans Raporu
Görev: Garsonların performansını analiz eden bir sistem oluştur.
İstenenler:

- Her garsonun toplam satışını hesapla
- Kaç sipariş aldığını bul
- Ortalama sipariş tutarını hesapla
- En çok satan garson ve en düşük satan garson bilgisini göster
 */

// ÇÖZÜM 4: Garson Performans Raporu
function garsonPerformansRaporu(restoran) {
    const garsonlar = {};
    const tumUrunler = restoran.menuler.flatMap(menu =>
        menu.urunler);

    restoran.siparisler.forEach((siparis) => {
        const garsonAdi = siparis.garson;

        // garson var mı yok mu kontrolü yoksa oluştur
        if (!garsonlar[garsonAdi]) {
            garsonlar[garsonAdi] = {
                toplamSatis: 0,
                siparisSayisi: 0,
                ortalamaSiparis: 0 };
        }
        // sipariş hangi garsona aitse siparis sayısını artır
        garsonlar[garsonAdi].siparisSayisi += 1;

        let siparisToplami = 0;
        siparis.urunler.forEach((siparisUrunu) => {
            const urun = tumUrunler.find(u => u.id === siparisUrunu.urunId);

            if (urun) {
                siparisToplami += urun.fiyat * siparisUrunu.adet;
            }
        });

        garsonlar[garsonAdi].toplamSatis += siparisToplami;



    }
    );// for each bitimi

    // Garsonların sattıkları siparişe göre ortalama sipraişleri
    Object.keys(garsonlar).forEach((garsonAdi) => {
        const garson = garsonlar[garsonAdi];
        garson.ortalamaSiparis = garson.toplamSatis / garson.siparisSayisi;
    });

    // en çok satan ile an az satış yapaın bulunması
    let enCokSatanGarson = null;
    let enDusukSatanGarson = null;

    Object.keys(garsonlar).forEach((garsonAdi) => {
        const garson = garsonlar[garsonAdi];
        if (
            !enCokSatanGarson || garson.toplamSatis > garsonlar[enCokSatanGarson].toplamSatis
        ) {
            enCokSatanGarson = garsonAdi;
        }
        if (
            !enDusukSatanGarson || garson.toplamSatis < garsonlar[enDusukSatanGarson].toplamSatis
        ) {
            enDusukSatanGarson = garsonAdi;
        }
    });


    //performans raporu
    return {
        "Garson Performans Raporu": garsonlar,

        "En Çok Satış Yapan Garson": {
            ad: enCokSatanGarson,
            toplamSatis: garsonlar[enCokSatanGarson].toplamSatis
        },

        "En Düşük Satış Yapan Garson": {
            ad: enDusukSatanGarson,
            toplamSatis: garsonlar[enDusukSatanGarson].toplamSatis
        }
    };

}// fonksiyon bitimi

/* Test
const rapor = garsonPerformansRaporu(restoran);
console.log(rapor);
*/

/*
SORU 5: Kategori Bazlı Satış Analizi
Görev: Hangi kategorilerin ne kadar satış yaptığını analiz et.
İstenenler:

- Her kategoriden kaç ürün satıldığını bul
- Kategori bazlı ciro hesapla
- En çok satan kategoriyi bul
- Kategorileri pasta grafiği gibi yüzdelik olarak göster
*/

// ÇÖZÜM 5: Kategori Bazlı Satış Analizi
function kategoriBazliAnaliz(restoran) {
    // ihtiyacımız olanlar ürünün kategorisi, id si ve fiyatı daha sonra id ye göre eşleme yapıp ciroyu hesaplamak için adeti alacağız
    const urunMap = {};
    restoran.menuler.forEach((menu) => {
        menu.urunler.forEach((urun) => {
            urunMap[urun.id] = {
                kategori: menu.kategori,
                fiyat: urun.fiyat
            };
        });
    });

    // Kategori bazında satış için objeyi oluşturuyoruz
    const kategoriSatis = {};
    restoran.menuler.forEach((menu) => {
        kategoriSatis[menu.kategori] = {
            adet: 0,
            ciro: 0
        };
    });

    // urunMap ve kategoriSatis kullanarak adetlerden ciroyu hesapladık
    restoran.siparisler.forEach(siparis => {
        siparis.urunler.forEach(item => {
            const info = urunMap[item.urunId];  // urunId ile kategori ve fiyat bilgisi
            kategoriSatis[info.kategori].adet += item.adet;  // kategoriye adeti ekle
            kategoriSatis[info.kategori].ciro += item.adet * info.fiyat; // kategoriye ciroyu ekle
        });
    });
    // En çok satan kategoriyi bulma
    let enCokSatanKategori = "";
    let maxAdet = 0;
    for (const kategori in kategoriSatis) {
        if (kategoriSatis[kategori].adet > maxAdet) {
            maxAdet = kategoriSatis[kategori].adet;
            enCokSatanKategori = kategori;
        }
    }
    // Kategorilerin yüzdesini hesaplama
    let toplamAdet = 0;
    for (const kategori in kategoriSatis) {
        toplamAdet += kategoriSatis[kategori].adet;
    }

    console.log("Kategori Bazlı Satış Analizi:");
    for (const kategori in kategoriSatis) {
        const adet = kategoriSatis[kategori].adet;
        const ciro = kategoriSatis[kategori].ciro;
        const yuzde = ((adet / toplamAdet) * 100).toFixed(2); //toFixed ile ondalık kısımdan 2 rakam gösteriyoruz - string olarak dönüyor - sadece formatlama
        console.log(`${kategori}: ${adet} adet, Ciro: ${ciro}₺, Pay: %${yuzde}`);
    }

    console.log("En çok satan kategori:", enCokSatanKategori);


} // kategoriBazliAnaliz fonksiyonu bitişi
