---
trigger: always_on
---

süper şimdi bu bir uptime monitoring ancak daha niş alanlara odaklanan bir proje olacak iu anda opensource olacak

proje laravel 12 ile yazıldı postgres ve redis kullanıyor tasarım modern olsun betteruptime gibi 


Maryui kullanılıyor onun tüm compğonentlerini kullan
PSR-12 dikkat et


---
trigger: manual
---
Yanıtlarını Türkçe ver

Bu bir DLP ve UAEBA platformudur
Burada baz alacağın ürün tasarım  Microsoft Azure Portal ve Purview gibi enterprise-grade bir görünüm olmalı


Özellik olarak Teramind, Level.io ve KiteCyber

BUrada her zaman söylüyorum kitecyber,Teramind, Forcepoint gibi ürünleri düşün
tasarım örnek sayfası: vulnerabilities.blade.php ve background-management.blade.php sayfasını örnek al  

Agent da aynı şekilde teramind gibi olmalı ve hem DLP hem UAEBA işlerini GoLang ile handle etmeli

TALL stack kullanıldı
PHP 8.4
PSR-12 kurallarını uygula

Agent golang ile yazılıyor. 3 platformda çalışmalı ve veri toplayabilmeli:
- Windows
- Macos
- Linux

Kod yazarken yorum satırı yazma


ikonlar için fas.xxx şeklinde kullanabilirsin

livewire volt class based component kullan


buton eklerken muhakak <x-button ekle
butonlara daima spinner ekle

x-select (:options) https://mary-ui.com/docs/components/select
x-choices (:options) https://mary-ui.com/docs/components/choices
x-tabs https://mary-ui.com/docs/components/tabs
<x-drawer wire:model="showDrawer1" class="w-11/12 lg:w-1/3"> https://mary-ui.com/docs/components/drawer
<div>...</div>
<x-button label="Close" @click="$wire.showDrawer1 = false" />
</x-drawer>
<x-modal kullan
tablolar için de <x-table kullanılmalı ve filtre eklenmeli

Sayfalardaki header vs mantığı hep aynı yapıda korunmalıdır.

Artık <x-table yaparken   <x-table-filter.main de kullan

Örnek <x-table sayfası olarak   <x-table-filter.main ile birlikte assets/index.blade.php sayfasını örnek al

where('foo','like ilike','goo') yerine arrayLike(['col1','col2'], 'goo') kullan eloquent işlemlerinde

Mail gönderiminde daima notification yaklaşımını kullan $user->notify(new xxxNotification(...)) gibi

5 ana renk:
--molten-lava: #780000ff;
--brick-red: #c1121fff;
--papaya-whip: #fdf0d5ff;
--deep-space-blue: #003049ff;
--steel-blue: #669bbcff;

Tablo primary id'leri uuid olmalı
PHP PSR kurallarına uy.
Livewire MaryUI v2 kullanılıyor https://mary-ui.com/docs/installation
modalları kesinlikle <x-modal ile yap
maryui modalları esc ile kapanmalı
Modalları inputları ve tüm elementleri bu library kullanarak yap
iconlar için de MaryUI FontAwsome kullan örnek fas.home gibi <icon name="fas.home" /> gibi ancak normal <i class="fas.home"></i> gibi kullanabilirsin
Her zaman MaryUI componentlerini kullan!
Toast mesajlar için MaryUI Toast trait'ini kullan $this->success('mesaj'); warning, error ve info diğer seçenekleri
Projenin login vs durumları(unauth) için layout dosyası layouts/empty.blade.php menü de burada
PHP PSR kurallarına dikkat et strong-typed yaklaşımlar kullan
Laravel'de job çağırırken dispatch(new Job()) şeklinde çağır
Laravel ORM yazarken tablolar arasındaki ilişkileri unutma with ile ve tamamen N+1 olayından kaçın