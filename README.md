# Arrow Rescue - Telegram Mini App

**Arrow Escape** (grid tabanlı puzzle) + **Animal Rescue** (kart/albüm koleksiyonu) temalı Telegram Mini App.

## 🎮 Oyun

- **Mekanik**: 6x6 grid üzerinde okları hareket ettirerek hayvanı kurtar
- **Win Condition**: Hayvan ile çıkış aynı satır/sütunda ve arada ok kalmadıysa WIN
- **Platform**: Telegram Mini App (web-native)
- **Game Engine**: Phaser 3

## 🛠️ Teknoloji

- **Frontend**: React 18 + TypeScript + Vite
- **Telegram SDK**: @tma.js/sdk-react
- **Test**: Vitest
- **Package Manager**: npm

## 📦 Kurulum

```bash
npm install
npm run dev      # Development server
npm test         # Unit testler
npm run build    # Production build
```

## 📁 Proje Yapısı

```
/src
  /game          # Phaser oyun kodu
  /telegram      # TMA.js wrapper
  /storage       # LocalStorage adapter
  /content       # Level JSON ve kurtarma kartları
  /tests         # Vitest testleri
```

## 📋 Dokümantasyon

- [`AGENTS.md`](AGENTS.md) - Projenin tek gerçeği (single source of truth)
- [`PROGRESS.md`](PROGRESS.md) - İlerleme takibi
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) - AI agent talimatları

## 🚀 Deploy

- **Vercel**: `VITE_BASE_PATH=/`
- **GitHub Pages**: `VITE_BASE_PATH=/Arrow_Escape/`

## 🔐 Güvenlik Notu

`initDataUnsafe` **ASLA güvenilir değil**. `initData` sadece sunucuda HMAC-SHA256 doğrulaması sonrası güvenilir.

Detay: https://core.telegram.org/bots/webapps

## 📄 Lisans

MIT
