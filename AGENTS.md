# AGENTS — Arrow Escape + Animal Rescue (Telegram Mini App)
Bu dosya bu projenin TEK GERÇEĞİDİR (single source of truth).
Her görev öncesi önce bunu oku, sonra 5 maddede özetle ve ancak sonra kod yaz.

## 0) Ürün kararı (kilit)
- Çekirdek mekanik: Arrow Escape (grid tabanlı).
- Tema/meta: Animal Rescue (kurtarma kartları + albüm).
- Platform: Telegram Mini App (web-native).
- Unity WebGL YASAK (MVP'de yok).
- Pull-the-Pin / fizik / idle / multiplayer MVP'de yok. Sadece backlog.

## 1) Teknoloji ve repo iskeleti (kilit)
- Base template: Telegram-Mini-Apps/reactjs-template (React + TS + Vite + tma.js). NPM kullan (template npm ile oluşturuldu).
- Oyun canvas: Phaser (React içinde embed).
- Test: Vitest (core logic), minimal smoke test.
- Deploy: Vercel veya Netlify.

## 2) Scope (MVP0 / MVP1)
### MVP0 (5 level dikey dilim)
- 6x6 grid
- Oklar sadece yönünde hareket eder; çıkıştan çıkan ok board'dan silinir.
- Win koşulu: "Hayvan ile çıkış aynı satır/sütun ve arada ok yok."
- 5 örnek level JSON
- Win ekranı: "Kurtarıldı!" + 1 kart albüme ekle (localStorage)
- Share butonu (Telegram içinde link ile paylaşım)

### MVP1 (30 level + daily)
- 30 level JSON + daily seed
- Albüm ekranı (kart koleksiyonu)
- Basit analytics eventleri: level_start, level_win, level_fail, share_click
- Monetization sadece STUB: Rewarded buton yeri + Stars ürün taslağı (gerçek entegrasyon yok)

## 3) Win Condition (kilit)
- "Hayvan ile çıkış aynı satır veya sütunda ve arada hiç ok kalmadıysa WIN."

## 4) Regression Guard Contract (bir yeri yapıp bozma)
ZORUNLU:
1) Bir PR = tek amaç. (Engine PR'ı UI'ı ellemeyecek.)
2) PR dosya sınırı: sadece ilgili klasörlerde değişiklik.
3) Her PR sonunda:
   - `npm test` geçecek
   - `npm run build` geçecek
   - Manuel checklist: 1) Level açılıyor 2) Move çalışıyor 3) Win trigger 4) Album'e yazıyor 5) Share tıklanıyor
4) Main branch her zaman deploy edilebilir DEMO.
5) Rollback: PR açıklamasında "geri alma planı" maddesi zorunlu.

### PR Description Zorunlu Blok
- [ ] `npm test` geçti
- [ ] `npm run build` geçti
- [ ] 5 level açılıyor
- [ ] Win condition çalışıyor
- [ ] Albüm kayıt ediyor
- [ ] Share butonu tıklanınca Telegram link açıyor
- Rollback: `git revert <sha>` + deploy yeniden

## 5) Dosya yapısı (kilit)
- /src/game: Phaser oyun kodu
- /src/telegram: Telegram wrapper (tma.js / window.Telegram)
- /src/storage: localStorage + (sonra) CloudStorage adapter
- /src/content: rescue cards json
- /src/tests: unit tests

## 6) Komutlar
- npm install
- npm run dev
- npm test
- npm run build

## 7) "Yapılmayacaklar" listesi (MVP'de yasak)
- Yeni mekanik icadı (pin/fizik/merge/idle/RT multiplayer).
- Büyük asset pack, büyük ses dosyaları, gereksiz UI animasyonları.
- Popunder / agresif reklam formatları.
- Kripto/P2E ödül havuzu.

## 8) Telegram güvenlik kuralı
- `initDataUnsafe` ASLA güvenilir değil.
- `initData` yalnızca sunucuda HMAC-SHA256 doğrulaması sonrası güvenilir.
- Detay: https://core.telegram.org/bots/webapps

## 9) Definition of Done (DoD)
Bir iş "bitti" sayılması için:
- Kod + test + build geçti
- PROGRESS.md güncellendi
- Demo link çalışıyor
- Değişiklik AGENTS.md ile çelişmiyor
