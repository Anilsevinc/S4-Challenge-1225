# S4-Challenge-1225
# Soru 1 – Menüde Arama Sistemi

Bu soruda amaç, restoran menüsündeki ürünleri **farklı kriterlere göre arayabilen** esnek bir yapı oluşturmaktı. Bunun için **higher-order function** yaklaşımını kullandım.

`menudeAra` adında bir fonksiyon yazdım. Bu fonksiyon, arama kriterini sabit tutmak yerine **callback** olarak dışarıdan alıyor. Böylece aynı fonksiyon ile:

- fiyatı 50 TL ve altı olan ürünler
- 500 kalorinin altındaki ürünler
- belirli bir malzemeyi (örneğin `"domates"`) içeren ürünler

gibi farklı aramalar yapılabiliyor.

Ayrıca arama sonucuna, ürünlerin **hangi kategoriye ait olduğu** bilgisini de ekledim. Böylece sonuçlar daha anlamlı hale geldi.

Bu yapı sayesinde kod tekrarından kaçınılmış oldu ve arama mantığı daha esnek bir hale getirildi.

---
