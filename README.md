# S4-Challenge-1225
## Soru 1 – Menüde Arama Sistemi

Bu soruda amaç, restoran menüsündeki ürünleri **farklı kriterlere göre arayabilen** esnek bir yapı oluşturmaktı. Bunun için **higher-order function** yaklaşımını kullandım.

`menudeAra` adında bir fonksiyon yazdım. Bu fonksiyon, arama kriterini sabit tutmak yerine **callback** olarak dışarıdan alıyor. Böylece aynı fonksiyon ile:

- fiyatı 50 TL ve altı olan ürünler
- 500 kalorinin altındaki ürünler
- belirli bir malzemeyi (örneğin `"domates"`) içeren ürünler

gibi farklı aramalar yapılabiliyor.

Ayrıca arama sonucuna, ürünlerin **hangi kategoriye ait olduğu** bilgisini de ekledim. Böylece sonuçlar daha anlamlı hale geldi.

Bu yapı sayesinde kod tekrarından kaçınılmış oldu ve arama mantığı daha esnek bir hale getirildi.

---

## Soru 2 – Sipariş Detaylandırma ve Toplam Tutar Hesaplama

Bu soruda amaç, restoran sistemindeki bir siparişi yalnızca ürün ID ve adet bilgisiyle sınırlı kalmadan, menüdeki ürün bilgileriyle birleştirerek detaylı hale getirmek ve toplam tutarı doğru şekilde hesaplamaktı.

Bu amaçla, sipariş içindeki her ürün için menüde karşılık gelen ürün bilgisi `find` metodu kullanılarak bulundu. Böylece siparişte sadece ID bulunan ürünler; ad, fiyat, kalori, malzemeler ve kategori gibi tüm detaylarıyla birlikte işlenebilir hale getirildi.

Sipariş detaylarını tutmak için `siparisDetaylari` adında yeni bir obje oluşturuldu. Bu obje içerisinde:

- siparişe ait masa, garson, saat ve durum bilgileri  
- detaylandırılmış ürünlerin tutulduğu bir `urunler` dizisi  
- tüm ürünlerin toplam fiyatının hesaplandığı `toplamTutar` alanı yer aldı.

Her bir ürün için:

- ürünün birim fiyatı ile adedi çarpılarak **ürün bazlı toplam fiyat** hesaplandı  
- bu bilgiler yeni bir obje halinde `urunler` dizisine eklendi  
- aynı anda siparişin genel `toplamTutar` değeri güncellendi  

---

## Soru 3 – Malzeme Stok Kontrol Sistemi

Bu soruda amaç, verilen bir siparişe göre restoranın stoklarında hangi malzemelerin ne kadar kullanıldığını hesaplamak ve stok durumunu kontrol eden bir sistem oluşturmaktı.

Bu amaçla `malzemeKullanimi` adında bir fonksiyon yazıldı. Fonksiyon, parametre olarak bir **sipariş** ve **restoran** objesini alıyor.

### Yapılan işlemler

- Öncelikle restoran menüsündeki tüm ürünler tek bir array haline getirildi.
- Siparişte yer alan ürünler, `urunId` üzerinden menüdeki ürünlerle eşleştirildi.
- Her ürünün malzemeleri, sipariş adedine göre hesaplanarak kullanilanMalzemeler objesinde toplandı.
- Daha sonra bu kullanılan miktarlar, restoran stok bilgileri ile karşılaştırıldı.
- Stok yüzdesine göre durum bilgisi üretildi:
  - `%20` altı → **critical**
  - `%50` altı → **low**
  - Diğer durumlar → **normal**

### Sonuç

Fonksiyon, her malzeme için:
- Kullanılan miktar
- Kalan stok
- Stok durumu 

bilgilerini içeren bir **stok durumu raporu** döndürmektedir.

Bu yapı sayesinde:
- Sipariş bazlı stok kontrolü yapılabilir
- Kritik stoklar önceden fark edilebilir
- Malzeme stok yönetimi daha güvenli hale gelir

