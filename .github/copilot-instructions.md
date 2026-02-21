# GitHub Copilot Instructions - Arrow Rescue TMA

Bu proje Arrow Escape (grid tabanlı puzzle) + Animal Rescue (kart/albüm) temalı Telegram Mini App'dir.

## Kritik Kurallar

### Her görev öncesi
1. AGENTS.md ve PROGRESS.md oku
2. 5 madde özetle
3. Sonra kod yazmaya başla

### MVP Scope (kilit - dışına çıkma)
- Oyun: 6x6 grid + ok hareketi + win condition
- Meta: Hayvan kurtarma kartları + albüm
- Platform: Telegram Mini App (web-native)
- YASAK: Unity WebGL, fizik, idle, multiplayer, pin mekanikleri

### PR Disiplini
- Bir PR = tek amaç
- PR sadece ilgili klasörlere dokunur (engine PR UI'a dokunamaz)
- Her PR sonunda: `npm test` + `npm run build` çalışmalı

### Telegram Güvenlik
- `initDataUnsafe` ASLA güvenilir değil
- `initData` sadece sunucuda HMAC-SHA256 doğrulaması sonrası güvenilir
- Kodlarda ilgili warning yorumu bırak

### DoD (Definition of Done)
Bir iş "bitti" sayılması için:
- Kod + test + build geçti
- PROGRESS.md güncellendi
- Demo link çalışıyor
- Değişiklik AGENTS.md ile çelişmiyor
