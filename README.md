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

